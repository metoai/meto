import type { SupabaseClient } from "@supabase/supabase-js";
import { compileLocally } from "@/lib/compile-local";
import { measureLatency } from "@/lib/observability";
import type { CompileFormat } from "@/lib/types";
import { buildContextText, resolveSelectedSectionTypes } from "@/lib/context-templates";
import { getGeneratedView } from "@/lib/views/regenerate";
import { isV2ReadMode } from "@/lib/knowledge/v2-mode";

export type ContextSection = {
  section_type: string;
  title: string;
  content: string;
  updated_at?: string | null;
  display_order?: number;
};

/**
 * Fetch raw context sections for a user, optionally filtered by is_public.
 */
export async function getUserContextSections(
  supabase: SupabaseClient,
  userId: string,
  onlyPublic: boolean = false
): Promise<ContextSection[]> {
  return measureLatency(`getUserContextSections(userId=${userId}, public=${onlyPublic})`, async () => {
    let query = supabase
      .from("context_sections")
      .select("section_type, title, content, updated_at, display_order")
      .eq("user_id", userId);
      
    if (onlyPublic) {
      query = query.eq("is_public", true);
    }
    
    const { data, error } = await query.order("display_order", { ascending: true });
    
    if (error) throw error;
    return data ?? [];
  });
}

/**
 * Retrieve the compiled context for a user in a specific format.
 * Uses `compiled_profiles` cache if available, falling back to on-the-fly compilation.
 */
export async function getCompiledContext(
  supabase: SupabaseClient,
  userId: string,
  format: CompileFormat,
  fallbackSections?: ContextSection[]
): Promise<string> {
  return measureLatency(`getCompiledContext(userId=${userId}, format=${format})`, async () => {
    // 0. Get current version
    const { data: profile } = await supabase
      .from("profiles")
      .select("context_version")
      .eq("id", userId)
      .single();

    const currentVersion = profile?.context_version;

    // 1. Try Cache First
    if (currentVersion) {
      const { data: cached, error } = await supabase
        .from("compiled_profiles")
        .select("full_context")
        .eq("user_id", userId)
        .eq("format", format)
        .eq("context_version", currentVersion)
        .maybeSingle();
        
      if (cached?.full_context) {
        console.log(`[CACHE HIT] compiled_profiles for user=${userId} format=${format} v=${currentVersion}`);
        return cached.full_context;
      }
    }
    
    console.log(`[CACHE MISS] compiled_profiles for user=${userId} format=${format}`);

    // 2. Fallback to inline compilation
    let sections = fallbackSections;
    if (!sections) {
      sections = await getUserContextSections(supabase, userId, false);
    }
    
    const compiled = compileLocally(format, sections);
    
    // Fire-and-forget cache update to heal the cache
    if (sections.length > 0 && currentVersion) {
      supabase.from("compiled_profiles").upsert({
        user_id: userId,
        format,
        full_context: compiled,
        context_version: currentVersion,
        last_compiled: new Date().toISOString()
      }, { onConflict: "user_id,format" }).then(({ error }) => {
        if (error) console.error("[CACHE WARMUP FAILED]", error);
      });
    }

    return compiled;
  });
}
