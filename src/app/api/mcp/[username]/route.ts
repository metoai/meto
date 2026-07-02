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
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * MCP route runs on Node.js runtime (required for mcp-handler/sdk internals).
 */
export const runtime = "nodejs";

type RouteContext = {
  params: { username: string };
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
): Promise<string[]> {
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
  return Object.keys(updates);
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
            return {
              contents: [
                {
                  uri: uri.href,
                  mimeType: "text/plain",
                  text: buildHandoffBundleText(username, rows),
                },
              ],
            };
          }

          const admin = createAdminClient();
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
          const updatedSections = await mergeFactIntoProfileWithLlm(userId, new_fact);
          await rebuildCompiledContextCache(userId);

          return {
            content: [
              {
                type: "text",
                text: `Profile updated successfully. Merged fact into sections: ${updatedSections.join(", ")}.`,
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
      // Important: this must match where this route lives in your app.
      // Since this file is at /api/mcp/[username], the base path is /api/mcp/${username}.
      basePath: `/api/mcp/${username}`,
      // Streamable HTTP is enabled by default; SSE is also available in mcp-handler.
      // Add REDIS_URL if you want resumable SSE behavior across instances.
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
    const auth = await authenticateMcpRequest(request, params.username);
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
