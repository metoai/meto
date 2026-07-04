import type { SupabaseClient } from "@supabase/supabase-js";
import { mergeProfileSectionUpdates } from "@/lib/profile-sections";
import type { KnowledgeObject } from "@/lib/knowledge/types";
import { hashContent, memoryVersionFingerprint } from "@/lib/views/hash";
import { generateCompileFromSections } from "@/lib/views/generators/compile";
import { buildMcpHandoffBundle } from "@/lib/views/generators/mcp-handoff";
import {
  generateSectionsFromMemories,
  sectionTitles,
} from "@/lib/views/generators/sections";
import { PROFILE_SECTIONS } from "@/lib/meto-prompts";
import { isKnowledgeFlagEnabled } from "@/lib/knowledge/feature-flags";

export type RegenerateScope = "sections" | "compile" | "mcp_handoff" | "all";

export type RegenerateResult = {
  viewsUpdated: number;
  sectionsSynced: boolean;
  scopes: RegenerateScope[];
};

async function loadActiveMemories(
  supabase: SupabaseClient,
  userId: string
): Promise<KnowledgeObject[]> {
  const { data, error } = await supabase
    .from("knowledge_objects")
    .select(
      "id,user_id,type,title,content,confidence,importance,visibility,source,status,created_by,tags,metadata,created_at,updated_at,last_verified_at"
    )
    .eq("user_id", userId)
    .eq("status", "active")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as KnowledgeObject[];
}

async function upsertGeneratedView(
  supabase: SupabaseClient,
  userId: string,
  viewType: string,
  targetKey: string,
  content: string,
  sourceVersion: string
) {
  const content_hash = hashContent(content);
  const { error } = await supabase.from("generated_views").upsert(
    {
      user_id: userId,
      view_type: viewType,
      target_key: targetKey,
      content,
      content_hash,
      source_memory_version: sourceVersion,
      generated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,view_type,target_key" }
  );
  if (error) throw error;
}

export async function regenerateViews(
  supabase: SupabaseClient,
  userId: string,
  username: string | null,
  scope: RegenerateScope = "all"
): Promise<RegenerateResult> {
  const memories = await loadActiveMemories(supabase, userId);
  const sourceVersion = memoryVersionFingerprint(memories);
  const sectionUpdates = generateSectionsFromMemories(memories);
  const scopes: RegenerateScope[] =
    scope === "all" ? ["sections", "compile", "mcp_handoff"] : [scope];

  let viewsUpdated = 0;

  if (scopes.includes("sections")) {
    for (const [key, content] of Object.entries(sectionUpdates)) {
      await upsertGeneratedView(
        supabase,
        userId,
        "section",
        key,
        content,
        sourceVersion
      );
      viewsUpdated += 1;
    }
  }

  const sectionRows = Object.entries(sectionUpdates).map(([section_type, content]) => {
    const meta = PROFILE_SECTIONS.find((s) => s.type === section_type);
    return {
      section_type,
      title: meta?.title ?? section_type,
      content,
    };
  });

  if (scopes.includes("compile") && sectionRows.length > 0) {
    const universal = generateCompileFromSections("universal", sectionRows);
    await upsertGeneratedView(
      supabase,
      userId,
      "compile",
      "universal",
      universal,
      sourceVersion
    );
    viewsUpdated += 1;

    await supabase.from("compiled_profiles").upsert(
      {
        user_id: userId,
        full_context: universal,
        format: "universal",
        last_compiled: new Date().toISOString(),
      },
      { onConflict: "user_id,format" }
    );
  }

  if (scopes.includes("mcp_handoff") && sectionRows.length > 0) {
    const handoff = buildMcpHandoffBundle(username ?? userId, sectionRows);
    await upsertGeneratedView(
      supabase,
      userId,
      "mcp_handoff",
      "bundle",
      handoff.text,
      sourceVersion
    );
    viewsUpdated += 1;
  }

  let sectionsSynced = false;
  if (
    isKnowledgeFlagEnabled("readEnabled") &&
    Object.keys(sectionUpdates).length > 0
  ) {
    await mergeProfileSectionUpdates(supabase, userId, sectionUpdates);
    sectionsSynced = true;
  }

  return { viewsUpdated, sectionsSynced, scopes };
}

export async function getGeneratedView(
  supabase: SupabaseClient,
  userId: string,
  viewType: string,
  targetKey: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("generated_views")
    .select("content")
    .eq("user_id", userId)
    .eq("view_type", viewType)
    .eq("target_key", targetKey)
    .maybeSingle();

  if (error) throw error;
  return data?.content ?? null;
}

export async function getGeneratedSectionMap(
  supabase: SupabaseClient,
  userId: string
): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("generated_views")
    .select("target_key, content")
    .eq("user_id", userId)
    .eq("view_type", "section");

  if (error) throw error;

  const map: Record<string, string> = {};
  for (const row of data ?? []) {
    map[row.target_key] = row.content;
  }
  return map;
}

export { sectionTitles };
