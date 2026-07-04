import { Buffer } from "node:buffer";
import { createMcpHandler } from "mcp-handler";
import { ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { compileLocally } from "@/lib/compile-local";
import { generateText } from "@/lib/llm";
import { isCustomSectionUpdateKey } from "@/lib/document-import";
import {
  buildCurrentSectionsMap,
  buildUpdateContextPrompt,
  SECTION_KEYS,
} from "@/lib/meto-prompts";
import { mergeProfileSectionUpdates } from "@/lib/profile-sections";
import { dualWriteSectionUpdates } from "@/lib/knowledge/extract";
import { autoCreateProjectsFromDeveloperUpdate } from "@/lib/projects/auto-create";
import { loadProjectMemoriesGrouped } from "@/lib/projects/project-memories";
import { buildTodayContext } from "@/lib/projects/today-context";
import { buildProjectContext } from "@/lib/projects/types";
import type { KnowledgeObject } from "@/lib/knowledge/types";
import { isKnowledgeFlagEnabled } from "@/lib/knowledge/feature-flags";
import { isV2FullyEnabled } from "@/lib/knowledge/v2-mode";
import { flushRegeneration, scheduleRegeneration } from "@/lib/views/regen-queue";
import { resolveHandoffBundle, resolveSectionContent } from "@/lib/views/read";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * MCP route runs on Node.js runtime (required for mcp-handler/sdk internals).
 */
export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ username: string; path?: string[] }>;
};

type ProfileAuthRow = {
  id: string;
  username: string | null;
};

type ContextSectionRow = {
  section_type: string;
  title: string;
  content: string;
  display_order: number | null;
  updated_at?: string | null;
};

/**
 * Parse `Authorization: Bearer <token>` from an incoming request.
 * Returns null when the header is absent/malformed.
 */
function extractBearerToken(request: Request): string | null {
  const rawHeader = request.headers.get("authorization");
  if (!rawHeader) return null;

  const [scheme, token] = rawHeader.split(" ");
  if (scheme?.toLowerCase() !== "bearer" || !token?.trim()) {
    return null;
  }

  return token.trim();
}

/**
 * Lightweight JSON parser that accepts plain JSON or fenced markdown JSON.
 * This is useful because LLM responses sometimes arrive wrapped in ```json blocks.
 */
function parseJsonSafely<T>(value: string): T {
  const cleaned = value
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

/**
 * Keep only section keys that our persistence layer supports:
 * - Core section keys from Meto prompt definitions
 * - Custom keys in the "custom:Title" format
 * We also trim values and ignore empty updates.
 */
function normalizeLlmUpdates(
  input: unknown
): Record<string, string> {
  if (!input || typeof input !== "object") {
    return {};
  }

  const allowedCore = new Set<string>(SECTION_KEYS);
  const output: Record<string, string> = {};

  for (const [key, value] of Object.entries(input as Record<string, unknown>)) {
    if (!allowedCore.has(key) && !isCustomSectionUpdateKey(key)) {
      continue;
    }

    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (!trimmed) continue;

    output[key] = trimmed;
  }

  return output;
}

/**
 * Authenticate this MCP request for a specific username by comparing:
 * - Route param username
 * - Authorization bearer token
 * against `profiles(username, mcp_access_token)`.
 *
 * Returns `{ userId, username }` when valid, otherwise `null`.
 */
async function authenticateMcpRequest(
  request: Request,
  usernameParam: string
): Promise<{ userId: string; username: string } | null> {
  const token = extractBearerToken(request);
  if (!token) return null;

  const normalizedUsername = usernameParam.trim().toLowerCase();
  if (!normalizedUsername) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, username")
    .eq("username", normalizedUsername)
    .eq("mcp_access_token", token)
    .maybeSingle<ProfileAuthRow>();

  if (error || !data) {
    return null;
  }

  // Best-effort heartbeat for interoperability health in the dashboard.
  // This powers "last sync" visibility without blocking successful MCP calls.
  await admin
    .from("profiles")
    .update({ mcp_last_used_at: new Date().toISOString() })
    .eq("id", data.id);

  return {
    userId: data.id,
    username: data.username?.toLowerCase() ?? normalizedUsername,
  };
}

/**
 * Load all context sections for one user in display order.
 * This is the source of truth for both resource reads and tool writes.
 */
async function getContextSections(userId: string): Promise<ContextSectionRow[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("context_sections")
    .select("section_type, title, content, display_order, updated_at")
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return (data ?? []) as ContextSectionRow[];
}

function buildHandoffVersion(rows: ContextSectionRow[]): string {
  const checksumInput = rows
    .map(
      (row) =>
        `${row.section_type}:${row.updated_at ?? "none"}:${row.content.length}`
    )
    .join("|");
  return Buffer.from(checksumInput).toString("base64url").slice(0, 24);
}

function latestSectionUpdate(rows: ContextSectionRow[]): string | null {
  const sorted = rows
    .map((row) => row.updated_at)
    .filter((value): value is string => Boolean(value))
    .sort();
  return sorted.length ? sorted[sorted.length - 1] : null;
}

function buildHandoffBundleText(
  username: string,
  rows: ContextSectionRow[]
): string {
  const compiled = compileLocally("universal", rows);
  const version = buildHandoffVersion(rows);
  const updatedAt = latestSectionUpdate(rows) ?? new Date().toISOString();

  const sectionBlock = rows
    .map(
      (row) =>
        `## ${row.title || row.section_type}\n${row.content.trim() || "(empty)"}`
    )
    .join("\n\n");

  return [
    `# Meto Handoff Bundle`,
    ``,
    `username: ${username}`,
    `version: ${version}`,
    `updated_at: ${updatedAt}`,
    ``,
    `## Compiled context`,
    compiled,
    ``,
    `## Raw sections`,
    sectionBlock,
  ].join("\n");
}

/**
 * Rebuild the local compiled profile cache after updates.
 * We intentionally use compileLocally() (not an LLM compile) for predictable,
 * low-latency cache refresh after every MCP write tool call.
 */
async function rebuildCompiledContextCache(userId: string): Promise<void> {
  const admin = createAdminClient();
  const sections = await getContextSections(userId);

  if (sections.length === 0) {
    return;
  }

  const compiled = compileLocally("universal", sections);
  const now = new Date().toISOString();

  const { error } = await admin.from("compiled_profiles").upsert(
    {
      user_id: userId,
      format: "universal",
      full_context: compiled,
      last_compiled: now,
    },
    { onConflict: "user_id,format" }
  );

  if (error) throw error;
}

/**
 * Ask the project's LLM helper to merge a single fact into profile section
 * updates, then persist those updates into `context_sections`.
 */
async function mergeFactIntoProfileWithLlm(
  userId: string,
  newFact: string
): Promise<{ sections: string[]; projectsCreated: number }> {
  const admin = createAdminClient();
  const currentRows = await getContextSections(userId);
  const currentSections = buildCurrentSectionsMap(currentRows);
  const customSections = currentRows
    .filter((row) => row.section_type === "custom")
    .map((row) => ({ title: row.title, content: row.content }));

  const prompt = buildUpdateContextPrompt(
    currentSections,
    `User: ${newFact}\nMeto:`,
    customSections
  );

  const llmRaw = await generateText(prompt, { temperature: 0.2 });
  const parsed = parseJsonSafely<{ updates?: unknown }>(llmRaw);
  const updates = normalizeLlmUpdates(parsed.updates);

  if (Object.keys(updates).length === 0) {
    throw new Error("LLM returned no valid profile section updates.");
  }

  await mergeProfileSectionUpdates(admin, userId, updates);

  let projectsCreated = 0;
  try {
    const projectResult = await autoCreateProjectsFromDeveloperUpdate(
      admin,
      userId,
      {
        updates,
        fact: newFact,
        source: "mcp",
      }
    );
    projectsCreated = projectResult.createdCount;
  } catch (projectError) {
    console.error("MCP auto-create projects failed:", projectError);
  }

  if (isKnowledgeFlagEnabled("writeEnabled")) {
    try {
      await dualWriteSectionUpdates(admin, userId, updates, "mcp");
    } catch (knowledgeError) {
      console.error("MCP knowledge dual-write failed:", knowledgeError);
    }
  }

  if (isKnowledgeFlagEnabled("layerEnabled")) {
    try {
      const { data: profile } = await admin
        .from("profiles")
        .select("username")
        .eq("id", userId)
        .single();
      if (isV2FullyEnabled()) {
        await flushRegeneration(admin, userId, profile?.username ?? null);
      } else {
        void scheduleRegeneration(admin, userId, profile?.username ?? null);
      }
    } catch (regenError) {
      console.error("MCP view regeneration failed:", regenError);
    }
  }

  return { sections: Object.keys(updates), projectsCreated };
}

function mcpTransportPaths(username: string) {
  const root = `/api/mcp/${username}`;
  return {
    streamableHttpEndpoint: root,
    sseEndpoint: `${root}/sse`,
    sseMessageEndpoint: `${root}/message`,
  };
}

/**
 * Build a per-user MCP handler after auth succeeds.
 * We create it per request so all tools/resources are safely scoped to the
 * authenticated user from the route param + bearer token.
 */
function createUserScopedMcpHandler(
  username: string,
  userId: string
) {
  return createMcpHandler(
    (server) => {
      /**
       * RESOURCE: profile://{section}
       * Reads one section's raw text from `context_sections`.
       *
       * Example: profile://about, profile://work, profile://goals
       */
      server.registerResource(
        "meto-profile-section",
        new ResourceTemplate("profile://{section}", {
          list: async () => {
            const rows = await getContextSections(userId);
            return {
              resources: [
                {
                  uri: "profile://handoff",
                  name: "Meto handoff bundle",
                  description:
                    "Compiled + raw profile content with version metadata for frictionless agent handoffs.",
                  mimeType: "text/plain",
                },
                ...rows.map((row) => ({
                  uri: `profile://${row.section_type}`,
                  name: row.title || row.section_type,
                  description: `Raw profile text for ${row.section_type}`,
                  mimeType: "text/plain",
                })),
              ],
            };
          },
        }),
        {
          title: "Meto profile section",
          description: "Read raw text from one Meto context section.",
          mimeType: "text/plain",
        },
        async (uri, variables) => {
          const section = String(variables.section ?? "").trim().toLowerCase();
          if (!section) {
            throw new Error("Section is required in profile://{section}.");
          }

          if (section === "handoff") {
            const rows = await getContextSections(userId);
            const text = await resolveHandoffBundle(
              createAdminClient(),
              userId,
              username,
              rows
            );
            return {
              contents: [
                {
                  uri: uri.href,
                  mimeType: "text/plain",
                  text,
                },
              ],
            };
          }

          const admin = createAdminClient();
          const generated = await resolveSectionContent(
            admin,
            userId,
            section
          );

          if (generated) {
            return {
              contents: [
                {
                  uri: uri.href,
                  mimeType: "text/plain",
                  text: generated,
                },
              ],
            };
          }

          const { data, error } = await admin
            .from("context_sections")
            .select("content, updated_at")
            .eq("user_id", userId)
            .eq("section_type", section)
            .order("updated_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (error) throw error;
          if (!data?.content) {
            throw new Error(`Section "${section}" not found for user "${username}".`);
          }

          return {
            contents: [
              {
                uri: uri.href,
                mimeType: "text/plain",
                text: data.content,
              },
            ],
          };
        }
      );

      /**
       * RESOURCE: profile://project/{slug}
       * Project-scoped knowledge graph for developer workspace.
       * profile://project/{slug}/today — today's context bundle.
       */
      server.registerResource(
        "meto-project",
        new ResourceTemplate("profile://project/{slug}", {
          list: async () => {
            const admin = createAdminClient();
            const { data: projects } = await admin
              .from("projects")
              .select("slug, name, description")
              .eq("user_id", userId)
              .order("updated_at", { ascending: false });

            const base =
              projects?.map((p) => ({
                uri: `profile://project/${p.slug}`,
                name: p.name,
                description: p.description || `Project memory for ${p.slug}`,
                mimeType: "text/plain",
              })) ?? [];

            const today = (projects ?? []).map((p) => ({
              uri: `profile://project/${p.slug}/today`,
              name: `${p.name} — today's context`,
              description: "Current sprint, architecture, rules, recent changes",
              mimeType: "text/plain",
            }));

            return { resources: [...base, ...today] };
          },
        }),
        {
          title: "Meto project memory",
          description: "Read project-scoped AI context from the developer workspace.",
          mimeType: "text/plain",
        },
        async (uri, variables) => {
          const rawSlug = String(variables.slug ?? "").trim().toLowerCase();
          if (!rawSlug) {
            throw new Error("Project slug is required in profile://project/{slug}.");
          }

          const today = rawSlug.endsWith("/today");
          const slug = today ? rawSlug.replace(/\/today$/, "") : rawSlug;

          const admin = createAdminClient();
          const { data: project, error } = await admin
            .from("projects")
            .select(
              "id, slug, name, description, status, current_focus, repo_url, last_scanned_at"
            )
            .eq("user_id", userId)
            .eq("slug", slug)
            .maybeSingle();

          if (error) throw error;
          if (!project) {
            throw new Error(`Project "${slug}" not found for user "${username}".`);
          }

          const grouped = await loadProjectMemoriesGrouped(admin, userId, project.id);
          const memoriesByRole: Record<string, KnowledgeObject[]> = {};
          const flat: KnowledgeObject[] = [];

          for (const [role, items] of Object.entries(grouped)) {
            memoriesByRole[role] = items as KnowledgeObject[];
            flat.push(...(items as KnowledgeObject[]));
          }

          if (today) {
            const { data: events } = await admin
              .from("project_events")
              .select("title, content, created_at")
              .eq("project_id", project.id)
              .eq("user_id", userId)
              .order("created_at", { ascending: false })
              .limit(8);

            const text = buildTodayContext(
              project as never,
              memoriesByRole,
              (events ?? []).map((e) => ({
                title: e.title,
                content: e.content,
                created_at: e.created_at,
              }))
            );

            return {
              contents: [{ uri: uri.href, mimeType: "text/plain", text }],
            };
          }

          const text = buildProjectContext(project as never, flat);
          return {
            contents: [{ uri: uri.href, mimeType: "text/plain", text }],
          };
        }
      );

      /**
       * TOOL: update_meto_profile
       * Input schema: { new_fact: string }
       *
       * 1) Sends fact to LLM helper to generate merged profile updates
       * 2) Persists merged updates to `context_sections`
       * 3) Rebuilds compiled cache via compileLocally()
       */
      server.registerTool(
        "update_meto_profile",
        {
          title: "Update Meto profile",
          description:
            "Merge a new user fact into profile sections and rebuild compiled cache.",
          inputSchema: {
            new_fact: z.string().min(1),
          },
        },
        async ({ new_fact }) => {
          const { sections, projectsCreated } =
            await mergeFactIntoProfileWithLlm(userId, new_fact);
          await rebuildCompiledContextCache(userId);

          const projectNote =
            projectsCreated > 0
              ? ` Auto-created ${projectsCreated} project${projectsCreated === 1 ? "" : "s"} in developer workspace.`
              : "";

          return {
            content: [
              {
                type: "text",
                text: `Profile updated successfully. Merged fact into sections: ${sections.join(", ")}.${projectNote}`,
              },
            ],
          };
        }
      );
    },
    {
      capabilities: {
        resources: {},
        tools: {},
      },
    },
    {
      // Cursor streamable_http posts to the root endpoint URL we expose in config.
      // Do not use basePath here — mcp-handler would append /mcp and cause 404s.
      ...mcpTransportPaths(username),
      redisUrl: process.env.REDIS_URL,
      maxDuration: 60,
      verboseLogs: true,
    }
  );
}

/**
 * Shared route dispatcher:
 * - Authenticates username + bearer token
 * - Creates a user-scoped MCP handler
 * - Forwards request to mcp-handler (supports Streamable HTTP + SSE transport)
 */
async function handleMcpRequest(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { username } = await params;
    const auth = await authenticateMcpRequest(request, username);
    if (!auth) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mcpHandler = createUserScopedMcpHandler(auth.username, auth.userId);
    return mcpHandler(request);
  } catch (error) {
    console.error("MCP route error:", error);
    return Response.json(
      { error: "Failed to process MCP request." },
      { status: 500 }
    );
  }
}

/**
 * Export all relevant HTTP verbs for MCP clients.
 * - POST: Streamable HTTP requests / tool calls
 * - GET:  stream resume and/or SSE transport entry
 * - DELETE: session cleanup for clients that use it
 */
export async function GET(request: Request, context: RouteContext) {
  return handleMcpRequest(request, context);
}

export async function POST(request: Request, context: RouteContext) {
  return handleMcpRequest(request, context);
}

export async function DELETE(request: Request, context: RouteContext) {
  return handleMcpRequest(request, context);
}
