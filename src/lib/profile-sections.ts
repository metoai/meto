import type { SupabaseClient } from "@supabase/supabase-js";
import {
  customSectionTitleFromKey,
  isCustomSectionUpdateKey,
} from "@/lib/document-import";
import {
  findSectionRowForUpdate,
  PROFILE_SECTIONS,
  SECTION_KEYS,
} from "@/lib/meto-prompts";
import { getEntitlementsForUser } from "@/lib/billing-profile";

function isDbCustomSection(sectionType: string) {
  return (
    sectionType === "custom" ||
    !SECTION_KEYS.includes(sectionType as (typeof SECTION_KEYS)[number])
  );
}

function findCustomSectionByTitle(
  title: string,
  rows: { id: string; section_type: string; title: string }[]
) {
  const normalized = title.trim().toLowerCase();
  return rows.find(
    (row) =>
      isDbCustomSection(row.section_type) &&
      row.title?.trim().toLowerCase() === normalized
  );
}

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

  const entitlements = await getEntitlementsForUser(userId);
  let customCount = rows.filter((row) => isDbCustomSection(row.section_type))
    .length;

  for (const [sectionType, content] of entries) {
    const trimmed = content.trim();

    if (isCustomSectionUpdateKey(sectionType)) {
      const title = customSectionTitleFromKey(sectionType);
      if (!title) continue;

      const row = findCustomSectionByTitle(title, rows);

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
        if (customCount >= entitlements.maxCustomSections) {
          throw new Error(
            `Custom section limit reached — could not create "${title}". Upgrade or remove a custom section.`
          );
        }

        const { data: inserted, error } = await supabase
          .from("context_sections")
          .insert({
            user_id: userId,
            section_type: "custom",
            title,
            content: trimmed,
            display_order: nextOrder++,
          })
          .select("id, section_type, title, display_order")
          .single();

        if (error) throw error;
        if (inserted) {
          rows.push(inserted);
          customCount += 1;
        }
      }
      continue;
    }

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

      const { data: inserted, error } = await supabase
        .from("context_sections")
        .insert({
          user_id: userId,
          section_type: sectionType,
          title: meta.title,
          content: trimmed,
          display_order: nextOrder++,
        })
        .select("id, section_type, title, display_order")
        .single();

      if (error) throw error;
      if (inserted) rows.push(inserted);
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
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  return (count ?? 0) > 0;
}
