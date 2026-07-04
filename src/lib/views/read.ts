import type { SupabaseClient } from "@supabase/supabase-js";
import { isV2ReadMode } from "@/lib/knowledge/v2-mode";
import { getGeneratedView } from "@/lib/views/regenerate";
import { buildMcpHandoffBundle } from "@/lib/views/generators/mcp-handoff";

type SectionRow = {
  section_type: string;
  title: string;
  content: string;
  updated_at?: string | null;
};

export async function resolveSectionContent(
  supabase: SupabaseClient,
  userId: string,
  sectionType: string
): Promise<string | null> {
  if (isV2ReadMode()) {
    const generated = await getGeneratedView(
      supabase,
      userId,
      "section",
      sectionType
    );
    if (generated?.trim()) return generated;
  }

  const { data, error } = await supabase
    .from("context_sections")
    .select("content")
    .eq("user_id", userId)
    .eq("section_type", sectionType)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data?.content ?? null;
}

export async function resolveHandoffBundle(
  supabase: SupabaseClient,
  userId: string,
  username: string,
  fallbackRows: SectionRow[]
): Promise<string> {
  if (isV2ReadMode()) {
    const generated = await getGeneratedView(
      supabase,
      userId,
      "mcp_handoff",
      "bundle"
    );
    if (generated?.trim()) return generated;
  }

  return buildMcpHandoffBundle(username, fallbackRows).text;
}
