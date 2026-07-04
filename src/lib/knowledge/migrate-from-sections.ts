import type { SupabaseClient } from "@supabase/supabase-js";
import { upsertKnowledgeFromSectionRow } from "@/lib/knowledge/persist";

type SectionRow = {
  id: string;
  section_type: string;
  title: string;
  content: string;
};

export type SectionMigrationResult = {
  created: number;
  updated: number;
  skipped: number;
  total: number;
};

/** Idempotent backfill: each context_section → one knowledge_object. */
export async function migrateSectionsToKnowledge(
  supabase: SupabaseClient,
  userId: string
): Promise<SectionMigrationResult> {
  const { data: sections, error } = await supabase
    .from("context_sections")
    .select("id, section_type, title, content")
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error) throw error;

  const rows = (sections ?? []) as SectionRow[];
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const section of rows) {
    if (!section.content?.trim()) {
      skipped += 1;
      continue;
    }

    const result = await upsertKnowledgeFromSectionRow(
      supabase,
      userId,
      section
    );

    if (result.action === "created") created += 1;
    else updated += 1;
  }

  return {
    created,
    updated,
    skipped,
    total: rows.length,
  };
}
