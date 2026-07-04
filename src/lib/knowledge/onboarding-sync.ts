import type { SupabaseClient } from "@supabase/supabase-js";
import { syncKnowledgeFromSectionUpdates } from "@/lib/knowledge/persist";
import { isKnowledgeFlagEnabled } from "@/lib/knowledge/feature-flags";
import { migrateSectionsToKnowledge } from "@/lib/knowledge/migrate-from-sections";
import type { MemorySource } from "@/lib/knowledge/types";

export async function syncOnboardingToKnowledge(
  supabase: SupabaseClient,
  userId: string,
  sections: Record<string, string>,
  source: MemorySource
) {
  if (!isKnowledgeFlagEnabled("writeEnabled")) return;

  try {
    await syncKnowledgeFromSectionUpdates(supabase, userId, sections, source);
    if (isKnowledgeFlagEnabled("layerEnabled")) {
      await migrateSectionsToKnowledge(supabase, userId);
    }
  } catch (error) {
    console.error("Onboarding knowledge sync failed:", error);
  }
}
