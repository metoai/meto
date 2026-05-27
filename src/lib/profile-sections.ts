import type { SupabaseClient } from "@supabase/supabase-js";
import { PROFILE_SECTIONS } from "@/lib/meto-prompts";

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
