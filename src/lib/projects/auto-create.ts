import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemorySource } from "@/lib/knowledge/types";
import { upsertProjectMemoryByRole } from "@/lib/projects/project-memories";
import {
  slugifyProjectName,
  type ProjectMemoryRole,
} from "@/lib/projects/types";

export type ProjectDraft = {
  name: string;
  description: string;
};

const INVALID_PROJECT_NAMES = new Set([
  "a",
  "an",
  "app",
  "it",
  "my",
  "new",
  "project",
  "repo",
  "something",
  "that",
  "the",
  "this",
  "work",
]);

const STACK_FACT_PATTERN =
  /\b([A-Za-z][A-Za-z0-9]{1,30})\s+(?:now uses|uses|switched to|migrated to|stack(?:\s+is)?[:\s]+)\s+(.+)/i;

const FACT_PROJECT_PATTERNS = [
  /\b(?:working on|building|started|launching|new (?:project|repo)(?:\s+is)?[:\s]+)\s*([A-Za-z][A-Za-z0-9][A-Za-z0-9\s&.-]{0,40})/i,
  /\bfor\s+([A-Za-z][A-Za-z0-9]{1,30})\b/i,
];

function cleanProjectName(raw: string): string {
  return raw
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/['"]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[.,;:!?]+$/, "");
}

export function isValidProjectName(name: string): boolean {
  const cleaned = cleanProjectName(name);
  if (cleaned.length < 2 || cleaned.length > 48) return false;
  const slug = slugifyProjectName(cleaned);
  if (!slug || slug.length < 2) return false;
  if (INVALID_PROJECT_NAMES.has(cleaned.toLowerCase())) return false;
  if (INVALID_PROJECT_NAMES.has(slug)) return false;
  return true;
}

/** Parse numbered / bulleted lines from the profile `projects` section. */
export function parseProjectEntries(text: string): ProjectDraft[] {
  const entries = new Map<string, ProjectDraft>();

  for (const line of text.split(/\n+/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3) continue;

    const stripped = trimmed
      .replace(/^\d+[\).\]]\s*/, "")
      .replace(/^[•\-*]\s+/, "")
      .trim();

    const dashMatch = stripped.match(/^([^—–:]+?)\s*[—–:-]\s*(.+)$/);
    if (dashMatch) {
      const name = cleanProjectName(dashMatch[1]);
      if (isValidProjectName(name)) {
        entries.set(slugifyProjectName(name), {
          name,
          description: dashMatch[2].trim(),
        });
      }
      continue;
    }

    const parenMatch = stripped.match(/^([^(]+?)\s*\([^)]+\)\s*(.*)$/);
    if (parenMatch) {
      const name = cleanProjectName(parenMatch[1]);
      const rest = parenMatch[2].replace(/^[—–:-]\s*/, "").trim();
      if (isValidProjectName(name)) {
        entries.set(slugifyProjectName(name), {
          name,
          description: rest || stripped,
        });
      }
      continue;
    }

    if (stripped.length <= 64 && !stripped.includes(". ")) {
      const name = cleanProjectName(stripped);
      if (isValidProjectName(name)) {
        entries.set(slugifyProjectName(name), { name, description: "" });
      }
    }
  }

  return [...entries.values()];
}

export function extractProjectsFromFact(fact: string): ProjectDraft[] {
  const entries = new Map<string, ProjectDraft>();
  const trimmed = fact.trim();
  if (!trimmed) return [];

  for (const pattern of FACT_PROJECT_PATTERNS) {
    const match = trimmed.match(pattern);
    if (!match?.[1]) continue;
    const name = cleanProjectName(match[1]);
    if (!isValidProjectName(name)) continue;
    entries.set(slugifyProjectName(name), {
      name,
      description: trimmed,
    });
  }

  const stackMatch = trimmed.match(STACK_FACT_PATTERN);
  if (stackMatch?.[1]) {
    const name = cleanProjectName(stackMatch[1]);
    if (isValidProjectName(name)) {
      const slug = slugifyProjectName(name);
      const existing = entries.get(slug);
      entries.set(slug, {
        name,
        description: existing?.description || stackMatch[2].trim(),
      });
    }
  }

  return [...entries.values()];
}

export async function isDeveloperWorkspaceUser(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("workspace_mode")
    .eq("id", userId)
    .single();

  if (error) return false;
  return data?.workspace_mode === "developer";
}

export async function ensureProject(
  supabase: SupabaseClient,
  userId: string,
  input: ProjectDraft
): Promise<{ id: string; slug: string; created: boolean } | null> {
  const name = cleanProjectName(input.name);
  if (!isValidProjectName(name)) return null;

  const slug = slugifyProjectName(name);
  const description = input.description.trim();

  const { data: existing, error: loadError } = await supabase
    .from("projects")
    .select("id, slug, name, description")
    .eq("user_id", userId)
    .eq("slug", slug)
    .maybeSingle();

  if (loadError) throw loadError;

  if (existing) {
    if (description && description !== existing.description) {
      const { error: updateError } = await supabase
        .from("projects")
        .update({
          description,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .eq("user_id", userId);

      if (updateError) throw updateError;
    }

    return { id: existing.id, slug: existing.slug, created: false };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert({
      user_id: userId,
      name,
      slug,
      description,
    })
    .select("id, slug")
    .single();

  if (error) throw error;
  return { id: data.id, slug: data.slug, created: true };
}

async function upsertProjectMemory(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  draft: ProjectDraft,
  role: ProjectMemoryRole,
  source: MemorySource,
  contentOverride?: string
) {
  const title =
    role === "stack"
      ? `${draft.name} stack`
      : role === "context"
        ? draft.name
        : `${draft.name} ${role}`;

  const content =
    contentOverride?.trim() ||
    draft.description.trim() ||
    `${draft.name} project context.`;

  const memoryType =
    role === "stack" ? "technology" : role === "issues" ? "task" : "project";

  await upsertProjectMemoryByRole(supabase, userId, projectId, {
    role,
    title,
    content,
    type: memoryType,
    source,
    projectSlug: slugifyProjectName(draft.name),
  });
}

function collectProjectDrafts(
  updates: Record<string, string>,
  fact?: string
): ProjectDraft[] {
  const bySlug = new Map<string, ProjectDraft>();

  if (updates.projects?.trim()) {
    for (const entry of parseProjectEntries(updates.projects)) {
      bySlug.set(slugifyProjectName(entry.name), entry);
    }
  }

  if (fact?.trim()) {
    for (const entry of extractProjectsFromFact(fact)) {
      const slug = slugifyProjectName(entry.name);
      const existing = bySlug.get(slug);
      bySlug.set(slug, {
        name: entry.name,
        description: entry.description || existing?.description || "",
      });
    }
  }

  return [...bySlug.values()];
}

function stackUpdateFromFact(fact: string): { name: string; stack: string } | null {
  const match = fact.trim().match(STACK_FACT_PATTERN);
  if (!match?.[1] || !match[2]) return null;
  const name = cleanProjectName(match[1]);
  if (!isValidProjectName(name)) return null;
  return { name, stack: match[2].trim() };
}

export type AutoCreateProjectsResult = {
  projectIds: string[];
  createdCount: number;
};

/**
 * Developer workspace only: parse project names from section updates / MCP facts,
 * upsert `projects` rows, and link scoped memories via `project_memories`.
 */
export async function autoCreateProjectsFromDeveloperUpdate(
  supabase: SupabaseClient,
  userId: string,
  options: {
    updates: Record<string, string>;
    fact?: string;
    source: MemorySource;
  }
): Promise<AutoCreateProjectsResult> {
  const isDev = await isDeveloperWorkspaceUser(supabase, userId);
  if (!isDev) {
    return { projectIds: [], createdCount: 0 };
  }

  const drafts = collectProjectDrafts(options.updates, options.fact);
  if (drafts.length === 0) {
    return { projectIds: [], createdCount: 0 };
  }

  const projectIds: string[] = [];
  let createdCount = 0;

  for (const draft of drafts) {
    const ensured = await ensureProject(supabase, userId, draft);
    if (!ensured) continue;

    projectIds.push(ensured.id);
    if (ensured.created) createdCount++;

    await upsertProjectMemory(
      supabase,
      userId,
      ensured.id,
      draft,
      "context",
      options.source
    );
  }

  const stackFact = options.fact ? stackUpdateFromFact(options.fact) : null;
  if (stackFact) {
    const ensured = await ensureProject(supabase, userId, {
      name: stackFact.name,
      description: stackFact.stack,
    });
    if (ensured) {
      if (!projectIds.includes(ensured.id)) {
        projectIds.push(ensured.id);
        if (ensured.created) createdCount++;
      }
      await upsertProjectMemory(
        supabase,
        userId,
        ensured.id,
        { name: stackFact.name, description: stackFact.stack },
        "stack",
        options.source,
        stackFact.stack
      );
    }
  }

  return { projectIds, createdCount };
}
