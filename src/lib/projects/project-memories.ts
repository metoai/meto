import type { SupabaseClient } from "@supabase/supabase-js";
import type { MemorySource, MemoryType } from "@/lib/knowledge/types";
import type { ProjectMemoryRole } from "@/lib/projects/types";
import type { ScanMemoryDraft } from "@/lib/projects/repo-scanner";
import { slugifyProjectName } from "@/lib/projects/types";

export async function recordProjectEvent(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  event: {
    event_type:
      | "decision"
      | "change"
      | "scan"
      | "rule"
      | "focus"
      | "import"
      | "memory";
    title: string;
    content?: string;
    metadata?: Record<string, unknown>;
  }
) {
  const { error } = await supabase.from("project_events").insert({
    project_id: projectId,
    user_id: userId,
    event_type: event.event_type,
    title: event.title,
    content: event.content ?? "",
    metadata: event.metadata ?? {},
  });
  if (error) throw error;
}

export async function upsertProjectMemoryByRole(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  draft: {
    role: ProjectMemoryRole;
    title: string;
    content: string;
    type: MemoryType;
    source: MemorySource;
    projectSlug: string;
  }
) {
  const { data: existing } = await supabase
    .from("knowledge_objects")
    .select("id")
    .eq("user_id", userId)
    .eq("type", draft.type)
    .eq("title", draft.title)
    .maybeSingle();

  let memoryId = existing?.id;

  const payload = {
    type: draft.type,
    title: draft.title,
    content: draft.content,
    source: draft.source,
    created_by: "ai" as const,
    importance: draft.role === "architecture" ? 5 : 4,
    confidence: 0.92,
    metadata: {
      auto_project: true,
      project_slug: draft.projectSlug,
      role: draft.role,
    },
    updated_at: new Date().toISOString(),
  };

  if (memoryId) {
    const { error } = await supabase
      .from("knowledge_objects")
      .update(payload)
      .eq("id", memoryId)
      .eq("user_id", userId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("knowledge_objects")
      .insert({ ...payload, user_id: userId })
      .select("id")
      .single();
    if (error) throw error;
    memoryId = data.id;
  }

  const { error: linkError } = await supabase.from("project_memories").upsert(
    {
      project_id: projectId,
      memory_id: memoryId,
      user_id: userId,
      role: draft.role,
    },
    { onConflict: "project_id,memory_id" }
  );
  if (linkError) throw linkError;

  return memoryId;
}

export async function applyScanMemoriesToProject(
  supabase: SupabaseClient,
  userId: string,
  projectId: string,
  projectSlug: string,
  memories: ScanMemoryDraft[],
  source: MemorySource = "migration"
) {
  for (const memory of memories) {
    await upsertProjectMemoryByRole(supabase, userId, projectId, {
      role: memory.role,
      title: memory.title,
      content: memory.content,
      type: memory.type,
      source,
      projectSlug,
    });
  }

  await recordProjectEvent(supabase, userId, projectId, {
    event_type: "scan",
    title: "Repository scanned",
    content: `Discovered ${memories.length} knowledge areas from manifests.`,
    metadata: { roles: memories.map((m) => m.role) },
  });
}

export async function loadProjectMemoriesGrouped(
  supabase: SupabaseClient,
  userId: string,
  projectId: string
) {
  const { data: links, error: linksError } = await supabase
    .from("project_memories")
    .select("memory_id, role")
    .eq("project_id", projectId)
    .eq("user_id", userId);

  if (linksError) throw linksError;
  if (!links?.length) return {} as Record<ProjectMemoryRole, unknown[]>;

  const memoryIds = links.map((l) => l.memory_id);
  const { data: memories, error: memError } = await supabase
    .from("knowledge_objects")
    .select("id, type, title, content, updated_at, created_at")
    .eq("user_id", userId)
    .in("id", memoryIds);

  if (memError) throw memError;

  const byId = new Map((memories ?? []).map((m) => [m.id, m]));
  const grouped: Record<string, unknown[]> = {};

  for (const link of links) {
    const memory = byId.get(link.memory_id);
    if (!memory) continue;
    if (!grouped[link.role]) grouped[link.role] = [];
    grouped[link.role].push(memory);
  }

  return grouped;
}

export function defaultProjectSlug(name: string) {
  return slugifyProjectName(name) || "project";
}
