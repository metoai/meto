import { applyResolvedSections, type ContextScoreResult } from "@/lib/context-score";
import { getEntitlementsForUser } from "@/lib/billing-profile";
import type { Entitlements } from "@/lib/entitlements";
import { isAnalysisCacheValid } from "@/lib/profile-cache";
import { SECTION_SELECT } from "@/lib/section-fields";
import type { ContextSection, UserProfile } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";

export type PortalBootstrapData = {
  profile: UserProfile | null;
  email: string;
  sections: ContextSection[];
  entitlements: Entitlements;
  issueCount: number;
  contextScore: ContextScoreResult | null;
  contextScoreCached: boolean;
  contextScoreStale: boolean;
};

function latestSectionUpdate(sections: Pick<ContextSection, "updated_at">[]) {
  let latest: Date | null = null;

  for (const section of sections) {
    if (!section.updated_at) continue;
    const updatedAt = new Date(section.updated_at);
    if (!latest || updatedAt > latest) {
      latest = updatedAt;
    }
  }

  return latest;
}

/** Shared portal payload for server render and /api/profile/bootstrap. */
export async function loadPortalBootstrap(
  userId: string,
  email: string
): Promise<PortalBootstrapData> {
  const supabase = createClient();

  const [profileResult, sectionsResult, scoreResult, entitlements] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("id, username, display_name, created_at, updated_at")
        .eq("id", userId)
        .single(),
      supabase
        .from("context_sections")
        .select(SECTION_SELECT)
        .eq("user_id", userId)
        .order("display_order", { ascending: true }),
      supabase
        .from("context_scores")
        .select("score, headline, summary, gaps, analyzed_at, resolved_sections")
        .eq("user_id", userId)
        .maybeSingle(),
      getEntitlementsForUser(userId),
    ]);

  if (profileResult.error) throw profileResult.error;
  if (sectionsResult.error) throw sectionsResult.error;
  if (scoreResult.error && scoreResult.error.code !== "42P01") {
    throw scoreResult.error;
  }

  const sections = (sectionsResult.data ?? []) as ContextSection[];
  const gaps = scoreResult.data?.gaps;
  const latestUpdate = latestSectionUpdate(sections);

  let contextScore: ContextScoreResult | null = null;
  let contextScoreCached = false;
  let contextScoreStale = false;

  if (scoreResult.data && sections.length > 0) {
    const resolved = Array.isArray(scoreResult.data.resolved_sections)
      ? (scoreResult.data.resolved_sections as string[])
      : [];

    const applied = applyResolvedSections(
      {
        score: scoreResult.data.score,
        headline: scoreResult.data.headline,
        summary: scoreResult.data.summary,
        gaps: Array.isArray(gaps) ? gaps : [],
        analyzed_at: scoreResult.data.analyzed_at,
      },
      resolved,
      sections.map((section) => ({
        section_type: section.section_type,
        title: section.title,
        content: section.content,
      }))
    );

    contextScore = applied.result;
    contextScoreCached = isAnalysisCacheValid(
      scoreResult.data.analyzed_at,
      latestUpdate
    );
    contextScoreStale = !contextScoreCached;
  }

  return {
    profile: profileResult.data as UserProfile,
    email,
    sections,
    entitlements,
    issueCount: contextScore?.gaps.length ?? 0,
    contextScore,
    contextScoreCached,
    contextScoreStale,
  };
}
