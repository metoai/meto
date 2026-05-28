import type { SupabaseClient } from "@supabase/supabase-js";
import {
  findSectionRowForUpdate,
  PROFILE_SECTIONS,
} from "@/lib/meto-prompts";

export async function mergeProfileSectionUpdates(
  supabase: SupabaseClient,
  userId: string,
  updates: Record<string, string>
) {
  const entries = Object.entries(updates).filter(([, content]) => content?.trim());
  if (entries.length === 0) {
    throw new Error("No updates to apply.");
  }

  const { data: existing, error: fetchError } = await supabase
    .from("context_sections")
    .select("id, section_type, title, display_order")
    .eq("user_id", userId);

  if (fetchError) throw fetchError;

  const rows = existing ?? [];
  let nextOrder =
    rows.reduce((max, row) => Math.max(max, row.display_order ?? 0), -1) + 1;

  for (const [sectionType, content] of entries) {
    const trimmed = content.trim();
    const row = findSectionRowForUpdate(sectionType, rows);

    if (row) {
      const { error } = await supabase
        .from("context_sections")
        .update({
          content: trimmed,
          updated_at: new Date().toISOString(),
        })
        .eq("id", row.id)
        .eq("user_id", userId);

      if (error) throw error;
    } else {
      const meta = PROFILE_SECTIONS.find((s) => s.type === sectionType);
      if (!meta) continue;

      const { error } = await supabase.from("context_sections").insert({
        user_id: userId,
        section_type: sectionType,
        title: meta.title,
        content: trimmed,
        display_order: nextOrder++,
      });

      if (error) throw error;
    }
  }
}

export async function saveProfileSections(
  supabase: SupabaseClient,
  userId: string,
  sections: Record<string, string>
) {
  const rows = PROFILE_SECTIONS.map((section, index) => ({
    user_id: userId,
    section_type: section.type,
    title: section.title,
    content: sections[section.type] ?? "",
    display_order: index,
  })).filter((row) => row.content.trim().length > 0);

  if (rows.length === 0) {
    throw new Error("No profile content could be extracted.");
  }

  const { error } = await supabase.from("context_sections").insert(rows);

  if (error) {
    throw error;
  }
}

export async function userHasSections(
  supabase: SupabaseClient,
  userId: string
) {
  const { count, error } = await supabase
    .from("context_sections")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}
