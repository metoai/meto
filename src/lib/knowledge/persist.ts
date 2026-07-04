import type { SupabaseClient } from "@supabase/supabase-js";
import {
  memoryTypeForSection,
  migrationMetadata,
} from "@/lib/knowledge/section-mapping";
import type {
  MemorySource,
  NewKnowledgeObject,
} from "@/lib/knowledge/types";
import { customSectionTitleFromKey, isCustomSectionUpdateKey } from "@/lib/document-import";
import { PROFILE_SECTIONS } from "@/lib/meto-prompts";

type SectionRow = {
  id: string;
  section_type: string;
  title: string;
  content: string;
};

function titleForSectionUpdate(sectionKey: string): string {
  if (isCustomSectionUpdateKey(sectionKey)) {
    return customSectionTitleFromKey(sectionKey) ?? "Custom section";
  }
  const meta = PROFILE_SECTIONS.find((s) => s.type === sectionKey);
  return meta?.title ?? sectionKey;
}

function metadataForSectionUpdate(sectionKey: string) {
  return {
    section_key: sectionKey,
    synced_from: "section_update",
  };
}

export async function findMigrationMemoryForSection(
  supabase: SupabaseClient,
  userId: string,
  sectionId: string
) {
  const { data, error } = await supabase
    .from("knowledge_objects")
    .select("id")
    .eq("user_id", userId)
    .eq("source", "migration")
    .contains("metadata", { migration_section_id: sectionId })
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function upsertKnowledgeFromSectionRow(
  supabase: SupabaseClient,
  userId: string,
  section: SectionRow
) {
  const existing = await findMigrationMemoryForSection(
    supabase,
    userId,
    section.id
  );

  const memoryFields: NewKnowledgeObject = {
    type: memoryTypeForSection(section.section_type),
    title: section.title?.trim() || titleForSectionUpdate(section.section_type),
    content: section.content.trim(),
    source: "migration",
    created_by: "system",
    importance: 3,
    confidence: 1,
    metadata: migrationMetadata(section),
  };

  if (existing?.id) {
    const { data, error } = await supabase
      .from("knowledge_objects")
      .update({
        ...memoryFields,
        updated_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .eq("user_id", userId)
      .select("id")
      .single();

    if (error) throw error;
    return { action: "updated" as const, id: data.id };
  }

  const { data, error } = await supabase
    .from("knowledge_objects")
    .insert({
      ...memoryFields,
      user_id: userId,
    })
    .select("id")
    .single();

  if (error) throw error;
  return { action: "created" as const, id: data.id };
}

export async function syncKnowledgeFromSectionUpdates(
  supabase: SupabaseClient,
  userId: string,
  updates: Record<string, string>,
  source: MemorySource
) {
  const { data: sections, error } = await supabase
    .from("context_sections")
    .select("id, section_type, title, content")
    .eq("user_id", userId);

  if (error) throw error;

  const rows = (sections ?? []) as SectionRow[];
  const synced: string[] = [];

  for (const [sectionKey, content] of Object.entries(updates)) {
    const trimmed = content.trim();
    if (!trimmed) continue;

    const row = rows.find((r) => {
      if (isCustomSectionUpdateKey(sectionKey)) {
        const title = customSectionTitleFromKey(sectionKey);
        return (
          r.section_type === "custom" &&
          title &&
          r.title?.trim().toLowerCase() === title.toLowerCase()
        );
      }
      return r.section_type === sectionKey;
    });

    const memoryPayload: NewKnowledgeObject & { user_id: string } = {
      user_id: userId,
      type: memoryTypeForSection(
        isCustomSectionUpdateKey(sectionKey) ? "custom" : sectionKey
      ),
      title: titleForSectionUpdate(sectionKey),
      content: trimmed,
      source,
      created_by: "ai",
      importance: 3,
      confidence: 0.85,
      metadata: {
        ...metadataForSectionUpdate(sectionKey),
        ...(row ? { migration_section_id: row.id } : {}),
      },
    };

    if (row) {
      const existing = await findMigrationMemoryForSection(
        supabase,
        userId,
        row.id
      );

      if (existing?.id) {
        const { error: updateError } = await supabase
          .from("knowledge_objects")
          .update({
            ...memoryPayload,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id)
          .eq("user_id", userId);

        if (updateError) throw updateError;
        synced.push(existing.id);
        continue;
      }
    }

    const { data: inserted, error: insertError } = await supabase
      .from("knowledge_objects")
      .insert(memoryPayload)
      .select("id")
      .single();

    if (insertError) throw insertError;
    synced.push(inserted.id);
  }

  return synced;
}

export function memoriesFromSectionUpdates(
  updates: Record<string, string>,
  source: MemorySource
): NewKnowledgeObject[] {
  return Object.entries(updates)
    .filter(([, content]) => content.trim())
    .map(([sectionKey, content]) => ({
      type: memoryTypeForSection(
        isCustomSectionUpdateKey(sectionKey) ? "custom" : sectionKey
      ),
      title: titleForSectionUpdate(sectionKey),
      content: content.trim(),
      source,
      created_by: "ai" as const,
      importance: 3 as const,
      confidence: 0.85,
      metadata: metadataForSectionUpdate(sectionKey),
    }));
}
