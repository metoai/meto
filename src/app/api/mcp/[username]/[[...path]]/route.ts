import { after } from "next/server";
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
import { loadProjectMemoriesGrouped, recordProjectEvent } from "@/lib/projects/project-memories";
import { buildTodayContext } from "@/lib/projects/today-context";
import { buildProjectContext } from "@/lib/projects/types";
import type { KnowledgeObject } from "@/lib/knowledge/types";
import { isKnowledgeFlagEnabled } from "@/lib/knowledge/feature-flags";
import { isV2FullyEnabled } from "@/lib/knowledge/v2-mode";
import { flushRegeneration, scheduleRegeneration } from "@/lib/views/regen-queue";
import { resolveHandoffBundle, resolveSectionContent } from "@/lib/views/read";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserContextSections, getCompiledContext } from "@/lib/context/read";
import { measureLatency } from "@/lib/observability";

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

type IdempotentResult = {
  result: { content: [{ type: "text"; text: string }] };
  timestamp: number;
};

const toolIdempotencyCache = new Map<string, IdempotentResult>();
const IDEMPOTENCY_TTL_MS = 60_000;

function checkIdempotency(key: string): { content: [{ type: "text"; text: string }] } | null {
  const cached = toolIdempotencyCache.get(key);
  if (cached && Date.now() - cached.timestamp < IDEMPOTENCY_TTL_MS) {
    return cached.result;
  }
  return null;
}

function setIdempotency(key: string, result: { content: [{ type: "text"; text: string }] }) {
  if (toolIdempotencyCache.size > 1000) {
    const now = Date.now();
    for (const [k, v] of toolIdempotencyCache.entries()) {
      if (now - v.timestamp >= IDEMPOTENCY_TTL_MS) {
        toolIdempotencyCache.delete(k);
      }
    }
  }
  toolIdempotencyCache.set(key, { result, timestamp: Date.now() });
}

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
  let cleaned = value
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) {
    cleaned = match[0];
  }

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

import { hashMcpToken } from "@/lib/mcp-auth";

/**
 * Authenticate this MCP request for a specific username by comparing:
 * - Route param username
 * - Authorization bearer token
 * against `profiles(username, mcp_access_token_hash)` (falling back to legacy `mcp_access_token`).
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

  const tokenHash = hashMcpToken(token);
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("profiles")
    .select("id, username")
    .eq("username", normalizedUsername)
    .or(`mcp_access_token_hash.eq.${tokenHash},mcp_access_token.eq.${token}`)
    .maybeSingle<ProfileAuthRow>();

  if (error || !data) {
    return null;
  }

  // Best-effort non-blocking heartbeat for interoperability health in the dashboard.
  void admin
    .from("profiles")
    .update({ mcp_last_used_at: new Date().toISOString() })
    .eq("id", data.id)
    .then(() => {});

  return {
    userId: data.id,
    username: data.username?.toLowerCase() ?? normalizedUsername,
  };
}



function triggerBackgroundProfileProcessing(
  userId: string,
  newFact: string,
  updates: Record<string, string>
) {
  const admin = createAdminClient();
  after(async () => {
    try {
      await autoCreateProjectsFromDeveloperUpdate(
        admin,
        userId,
        {
          updates,
          fact: newFact,
          source: "mcp",
        }
      );
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

    try {
      await getCompiledContext(admin, userId, "universal");
    } catch (cacheError) {
      console.error("MCP cache warmup failed:", cacheError);
    }
  });
}

/**
 * Ask the project's LLM helper to merge a single fact into profile section
 * updates, then persist those updates into `context_sections`.
 */
async function mergeFactIntoProfileWithLlm(
  userId: string,
  newFact: string
): Promise<{ sections: string[] }> {
  const admin = createAdminClient();
  const currentRows = await getUserContextSections(admin, userId) as ContextSectionRow[];
  const currentSections = buildCurrentSectionsMap(currentRows);
  const customSections = currentRows
    .filter((row) => row.section_type === "custom")
    .map((row) => ({ title: row.title, content: row.content }));

  const prompt = buildUpdateContextPrompt(
    currentSections,
    `User: ${newFact}\nMeto:`,
    customSections
  );

  let parsed: { updates?: unknown } | null = null;
  let attempts = 0;
  let lastError: unknown;

  while (attempts < 2 && !parsed) {
    attempts++;
    try {
      const temperature = attempts === 1 ? 0.2 : 0.4;
      const llmRaw = await generateText(prompt, { temperature });
      parsed = parseJsonSafely<{ updates?: unknown }>(llmRaw);
    } catch (error) {
      lastError = error;
      if (!(error instanceof SyntaxError)) {
        throw error;
      }
    }
  }

  if (!parsed) {
    throw lastError || new Error("Failed to parse LLM JSON after multiple attempts.");
  }

  const updates = normalizeLlmUpdates(parsed.updates);

  if (Object.keys(updates).length === 0) {
    throw new Error("LLM returned no valid profile section updates.");
  }

  await mergeProfileSectionUpdates(admin, userId, updates);

  triggerBackgroundProfileProcessing(userId, newFact, updates);

  return { sections: Object.keys(updates) };
}

function mcpTransportPaths(username: string) {
  const root = `/api/mcp/${username}`;
  return {
    streamableHttpEndpoint: root,
    sseEndpoint: `${root}/sse`,
    sseMessageEndpoint: `${root}/message`,
  };
}

function formatMetoSyncBanner(data: {
  action: string;
  detail: string;
  scope?: string;
  sections?: string[];
}): string {
  const line = "─".repeat(58);
  const detailSnippet = data.detail.replace(/\n/g, " ").slice(0, 44);
  const scopeText = data.scope ? data.scope.slice(0, 44) : "Global Profile";
  const sectionsText = data.sections?.length ? data.sections.join(", ").slice(0, 44) : "";

  return [
    `┌${line}┐`,
    `│ ✦ Meto Context Synced                                    │`,
    `│ • Action: ${data.action.slice(0, 44).padEnd(46)}│`,
    `│ • Recorded: ${detailSnippet.padEnd(44)}│`,
    `│ • Scope: ${scopeText.padEnd(47)}│`,
    ...(sectionsText ? [`│ • Sections: ${sectionsText.padEnd(44)}│`] : []),
    `│ • Synced across: Cursor, Claude, Antigravity, Windsurf   │`,
    `└${line}┘`,
  ].join("\n");
}

async function searchMetoContext(
  userId: string,
  query: string,
  projectSlug?: string
): Promise<{
  found: boolean;
  text: string;
}> {
  const admin = createAdminClient();
  const rawTokens = query
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter(
      (t) =>
        t.length > 2 &&
        ![
          "what", "how", "why", "when", "where", "which", "should", "could", "would",
          "we", "you", "use", "using", "the", "for", "with", "from", "and", "our",
          "can", "best", "some", "any", "like", "good", "tool", "stack"
        ].includes(t)
    );

  if (rawTokens.length === 0) {
    return {
      found: false,
      text: "No specific keywords to search for past Meto decisions.",
    };
  }

  type MatchItem = {
    title: string;
    content: string;
    type: string;
    scope: string;
    score: number;
  };

  const matches: MatchItem[] = [];

  // 1. Search project-specific events & memories if projectSlug provided
  if (projectSlug) {
    const cleanSlug = projectSlug.trim().toLowerCase();
    const { data: project } = await admin
      .from("projects")
      .select("id, name, slug")
      .eq("user_id", userId)
      .eq("slug", cleanSlug)
      .maybeSingle();

    if (project) {
      const { data: events } = await admin
        .from("project_events")
        .select("title, content, event_type, created_at")
        .eq("project_id", project.id)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(25);

      if (events) {
        for (const ev of events) {
          const textToSearch = `${ev.title} ${ev.content || ""}`.toLowerCase();
          let score = 0;
          for (const token of rawTokens) {
            if (textToSearch.includes(token)) score += 3; // higher weight for current project
          }
          if (score > 0) {
            matches.push({
              title: ev.title,
              content: ev.content || ev.title,
              type: ev.event_type.toUpperCase(),
              scope: `Project: ${project.name}`,
              score,
            });
          }
        }
      }
    }
  }

  // 2. Search knowledge_objects (decisions, preferences, rules, tools)
  const { data: knowledgeRows } = await admin
    .from("knowledge_objects")
    .select("title, content, type, metadata")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(40);

  if (knowledgeRows) {
    for (const obj of knowledgeRows) {
      const textToSearch = `${obj.title} ${obj.content || ""}`.toLowerCase();
      let score = 0;
      for (const token of rawTokens) {
        if (textToSearch.includes(token)) score += 2;
      }
      if (score > 0) {
        matches.push({
          title: obj.title,
          content: obj.content,
          type: (obj.type || "memory").toUpperCase(),
          scope: "Global Developer Memory",
          score,
        });
      }
    }
  }

  // 3. Search profile context_sections (work, skills, working_style, etc.)
  const contextRows = (await getUserContextSections(admin, userId)) as ContextSectionRow[];
  for (const sec of contextRows) {
    const textToSearch = `${sec.title} ${sec.content || ""}`.toLowerCase();
    let score = 0;
    for (const token of rawTokens) {
      if (textToSearch.includes(token)) score += 1;
    }
    if (score > 0) {
      matches.push({
        title: sec.title || sec.section_type,
        content: sec.content.slice(0, 300),
        type: "PREFERENCE",
        scope: "Developer Profile",
        score,
      });
    }
  }

  // Sort by score descending and deduplicate
  matches.sort((a, b) => b.score - a.score);
  const topMatches = matches.slice(0, 3);

  if (topMatches.length === 0) {
    return {
      found: false,
      text: `No prior verified decisions or preferences found in Meto for "${query}". Feel free to explore and choose the best modern pattern for this task.`,
    };
  }

  const lines = [
    `┌────────────────────────────────────────────────────────────┐`,
    `│ ✦ Meto Recall: Past Decisions & Preferences                │`,
    `│ Query: ${query.slice(0, 48).padEnd(51)}│`,
    `├────────────────────────────────────────────────────────────┤`,
  ];

  for (const m of topMatches) {
    lines.push(`│ • [${m.type}] ${m.title.slice(0, 48)}`);
    lines.push(`│   Scope: ${m.scope}`);
    lines.push(`│   Details: ${m.content.slice(0, 80).replace(/\n/g, " ")}`);
    lines.push(`│`);
  }

  lines.push(`└────────────────────────────────────────────────────────────┘`);

  return {
    found: true,
    text: lines.join("\n"),
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
            return measureLatency(`MCP List Resources: profile (user=${userId})`, async () => {
              const rows = await getUserContextSections(createAdminClient(), userId);
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
            });
          },
        }),
        {
          title: "Meto profile section",
          description: "Read raw text from one Meto context section.",
          mimeType: "text/plain",
        },
        async (uri, variables) => {
          return measureLatency(`MCP Read Resource: ${uri.href}`, async () => {
            const section = String(variables.section ?? "").trim().toLowerCase();
            if (!section) {
              throw new Error("Section is required in profile://{section}.");
            }

            if (section === "handoff") {
              const rows = await getUserContextSections(createAdminClient(), userId) as ContextSectionRow[];
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
          });
        }
      );

      /**
       * RESOURCE: profile://project/{slug}
       * Project-scoped knowledge graph for developer workspace.
       * profile://project/{slug}/today — today's context bundle.
       */
      server.registerResource(
        "meto-project",
        new ResourceTemplate("profile://project/{+slug}", {
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
       * TOOL: upsert_meto_profile_sections
       * Input schema: { sections: Record<string, string> }
       *
       * Bypasses the LLM and applies deterministic, exact text edits to sections.
       */
      server.registerTool(
        "upsert_meto_profile_sections",
        {
          title: "Upsert Meto profile sections",
          description:
            "Directly overwrite specific profile sections with exact text, bypassing the LLM. Use this when you have deterministic, structured changes to apply.",
          inputSchema: {
            sections: z.record(z.string()).describe("Map of section keys to exact markdown content"),
          },
        },
        async ({ sections }) => {
          const cacheKey = `upsert:${userId}:${JSON.stringify(sections)}`;
          const cached = checkIdempotency(cacheKey);
          if (cached) {
            console.log(`[IDEMPOTENCY HIT] Returning cached upsert result for user=${userId}`);
            return cached;
          }

          const admin = createAdminClient();
          const validUpdates: Record<string, string> = {};
          
          for (const [k, v] of Object.entries(sections)) {
             validUpdates[k] = String(v);
          }
          
          if (Object.keys(validUpdates).length === 0) {
            throw new Error("No sections provided to upsert.");
          }

          await mergeProfileSectionUpdates(admin, userId, validUpdates);
          triggerBackgroundProfileProcessing(userId, "Explicit section upsert via MCP tool", validUpdates);

          const banner = formatMetoSyncBanner({
            action: "Profile Sections Upserted",
            detail: `Updated: ${Object.keys(validUpdates).join(", ")}`,
            scope: "Global Profile",
            sections: Object.keys(validUpdates),
          });

          const result = {
            content: [
              {
                type: "text" as const,
                text: banner,
              },
            ] as [{ type: "text"; text: string }],
          };

          setIdempotency(cacheKey, result);
          return result;
        }
      );

      /**
       * TOOL: update_meto_profile
       * Input schema: { new_fact: string, project_slug?: string }
       *
       * 1) Records project event if project_slug is provided
       * 2) Merges fact into profile sections using LLM helper
       * 3) Persists merged updates to `context_sections` & triggers background processing
       * 4) Returns formatted visual confirmation banner
       */
      server.registerTool(
        "update_meto_profile",
        {
          title: "Update Meto profile & project memory",
          description:
            "Automatically call this tool whenever the user establishes an architectural decision (ADR), adopts a new dependency or framework, refactors stack conventions, or asks to remember something. Keeps Meto in sync in the background.",
          inputSchema: {
            new_fact: z.string().min(1).describe("The fact, stack change, or architectural decision to record"),
            project_slug: z
              .string()
              .optional()
              .describe("Optional project slug if the decision applies to a specific repository or project"),
          },
        },
        async ({ new_fact, project_slug }) => {
          const trimmedFact = new_fact.trim();
          const cleanProject = project_slug?.trim().toLowerCase();
          const cacheKey = `update:${userId}:${cleanProject || "global"}:${trimmedFact.toLowerCase()}`;
          const cached = checkIdempotency(cacheKey);
          if (cached) {
            console.log(`[IDEMPOTENCY HIT] Returning cached update result for user=${userId}`);
            return cached;
          }

          const admin = createAdminClient();
          let projectFound = false;
          let projectName = "";

          if (cleanProject) {
            const { data: project } = await admin
              .from("projects")
              .select("id, name, slug")
              .eq("user_id", userId)
              .eq("slug", cleanProject)
              .maybeSingle();

            if (project) {
              projectFound = true;
              projectName = project.name;
              try {
                await recordProjectEvent(admin, userId, project.id, {
                  event_type: "decision",
                  title: trimmedFact.slice(0, 100),
                  content: trimmedFact,
                  metadata: { source: "mcp", project_slug: cleanProject },
                });
              } catch (eventErr) {
                console.error("Failed to record project decision event:", eventErr);
              }
            }
          }

          const { sections } =
            await mergeFactIntoProfileWithLlm(userId, trimmedFact);

          const banner = formatMetoSyncBanner({
            action: projectFound ? `Decision Logged (${projectName})` : "Global Profile Updated",
            detail: trimmedFact,
            scope: projectFound ? `${projectName} (${cleanProject})` : "Global Profile",
            sections,
          });

          const result = {
            content: [
              {
                type: "text" as const,
                text: banner,
              },
            ] as [{ type: "text"; text: string }],
          };

          setIdempotency(cacheKey, result);
          return result;
        }
      );

      /**
       * TOOL: recall_meto_context
       * Input schema: { query: string, project_slug?: string }
       *
       * Searches past decisions, vetted libraries, and developer preferences
       * to contribute high-signal context when recommendations are requested.
       */
      server.registerTool(
        "recall_meto_context",
        {
          title: "Recall Meto developer context & past decisions",
          description:
            "Search the user's Meto memory for past architectural decisions, vetted tools/libraries, and working preferences related to a topic. Call this when the developer asks for suggestions, library recommendations, or architectural patterns to check if they have solved this before.",
          inputSchema: {
            query: z
              .string()
              .min(1)
              .describe("Topic or question, e.g. 'authentication', 'charting library', 'database migrations'"),
            project_slug: z
              .string()
              .optional()
              .describe("Optional project slug to prioritize project-specific ADRs and stack conventions"),
          },
        },
        async ({ query, project_slug }) => {
          const result = await searchMetoContext(userId, query, project_slug);

          return {
            content: [
              {
                type: "text" as const,
                text: result.text,
              },
            ] as [{ type: "text"; text: string }],
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
