import { NextResponse } from "next/server";
import { applyResolvedSections } from "@/lib/context-score";
import { getEntitlementsForUser } from "@/lib/billing-profile";
import { catchApiError } from "@/lib/api-error";
import { isAnalysisCacheValid, getLatestSectionUpdate } from "@/lib/profile-cache";
import { SECTION_SELECT } from "@/lib/section-fields";
import { createClient } from "@/lib/supabase/server";

/** One request for portal load: profile, sections, entitlements, cached context score. */
export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [profileResult, sectionsResult, scoreResult, entitlements, latestUpdate] =
      await Promise.all([
        supabase
          .from("profiles")
          .select("id, username, display_name, created_at, updated_at")
          .eq("id", user.id)
          .single(),
        supabase
          .from("context_sections")
          .select(SECTION_SELECT)
          .eq("user_id", user.id)
          .order("display_order", { ascending: true }),
        supabase
          .from("context_scores")
          .select(
            "score, headline, summary, gaps, analyzed_at, resolved_sections"
          )
          .eq("user_id", user.id)
          .maybeSingle(),
        getEntitlementsForUser(user.id),
        getLatestSectionUpdate(user.id),
      ]);

    if (profileResult.error) throw profileResult.error;
    if (sectionsResult.error) throw sectionsResult.error;
    if (scoreResult.error && scoreResult.error.code !== "42P01") {
      throw scoreResult.error;
    }

    const sections = sectionsResult.data ?? [];
    const gaps = scoreResult.data?.gaps;
    const issueCount = Array.isArray(gaps) ? gaps.length : 0;

    let contextScore = null;
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
        sections.map((s) => ({
          section_type: s.section_type,
          title: s.title,
          content: s.content,
        })),
        scoreResult.data.score
      );

      contextScore = applied.result;
      contextScoreCached = isAnalysisCacheValid(
        scoreResult.data.analyzed_at,
        latestUpdate
      );
      contextScoreStale = !contextScoreCached;
    }

    return NextResponse.json({
      profile: profileResult.data,
      email: user.email,
      sections,
      entitlements,
      issueCount,
      contextScore,
      contextScoreCached,
      contextScoreStale,
    });
  } catch (error) {
    return catchApiError(error, "Failed to load portal data.");
  }
}
