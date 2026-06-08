import { NextResponse } from "next/server";
import { assertAiAccess, recordAiUsage } from "@/lib/ai-usage";
import { getEntitlementsForUser } from "@/lib/billing-profile";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  applyResolvedSections,
  analyzeContextScore,
  analyzeContextScoreLocally,
  type ContextScoreResult,
} from "@/lib/context-score";
import { friendlyGeminiError } from "@/lib/gemini";
import {
  getLatestSectionUpdate,
  isAnalysisCacheValid,
} from "@/lib/profile-cache";
import { createClient } from "@/lib/supabase/server";

async function getSavedScore(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("context_scores")
    .select("score, headline, summary, gaps, analyzed_at, resolved_sections")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    if (error.code === "42P01") return null;
    throw error;
  }

  if (!data) return null;

  return {
    score: data.score,
    headline: data.headline,
    summary: data.summary,
    gaps: Array.isArray(data.gaps) ? data.gaps : [],
    analyzed_at: data.analyzed_at,
    resolved_sections: Array.isArray(data.resolved_sections)
      ? (data.resolved_sections as string[])
      : [],
  } satisfies ContextScoreResult & { resolved_sections: string[] };
}

async function saveScore(
  userId: string,
  result: ContextScoreResult,
  resolvedSections: string[] = []
) {
  const supabase = createClient();
  const { error } = await supabase.from("context_scores").upsert(
    {
      user_id: userId,
      score: result.score,
      headline: result.headline,
      summary: result.summary,
      gaps: result.gaps,
      analyzed_at: result.analyzed_at,
      resolved_sections: resolvedSections,
    },
    { onConflict: "user_id" }
  );

  if (error && error.code !== "42P01") {
    throw error;
  }
}

function formatSavedScore(
  saved: NonNullable<Awaited<ReturnType<typeof getSavedScore>>>,
  sections: Awaited<ReturnType<typeof loadSections>>
) {
  const { resolved_sections, ...scoreRow } = saved;
  const applied = applyResolvedSections(
    {
      score: scoreRow.score,
      headline: scoreRow.headline,
      summary: scoreRow.summary,
      gaps: scoreRow.gaps,
      analyzed_at: scoreRow.analyzed_at,
    },
    resolved_sections,
    sections
  );
  return applied.result;
}

async function loadSections(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("context_sections")
    .select("section_type, title, content, updated_at")
    .eq("user_id", userId)
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function GET() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sections = await loadSections(user.id);
    if (!sections.length) {
      return NextResponse.json({ score: null, cached: false });
    }

    const saved = await getSavedScore(user.id);
    const latestUpdate = await getLatestSectionUpdate(user.id);
    const cached = saved
      ? isAnalysisCacheValid(saved.analyzed_at, latestUpdate)
      : false;

    return NextResponse.json({
      score: saved ? formatSavedScore(saved, sections) : null,
      cached,
      stale: Boolean(saved && !cached),
    });
  } catch (error) {
    console.error("GET context-score error:", error);
    return NextResponse.json(
      { error: "Failed to load context score." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const limited = await enforceRateLimit(
      request,
      "context-score",
      20,
      60 * 60 * 1000,
      user.id
    );
    if (limited) return limited;

    const { force = false, fixedSections = [] } = (await request
      .json()
      .catch(() => ({}))) as {
      force?: boolean;
      fixedSections?: string[];
    };

    const sections = await loadSections(user.id);
    if (!sections.length) {
      return NextResponse.json(
        { error: "No sections to analyze." },
        { status: 400 }
      );
    }

    if (!force) {
      const saved = await getSavedScore(user.id);
      const latestUpdate = await getLatestSectionUpdate(user.id);

      if (saved && isAnalysisCacheValid(saved.analyzed_at, latestUpdate)) {
        return NextResponse.json({
          score: formatSavedScore(saved, sections),
          cached: true,
        });
      }
    }

    const saved = await getSavedScore(user.id);
    let resolvedSections = saved?.resolved_sections ?? [];

    if (fixedSections.length) {
      resolvedSections = Array.from(
        new Set([...resolvedSections, ...fixedSections])
      );
    }

    const entitlements = await getEntitlementsForUser(user.id);
    let result;

    if (entitlements.canUseLlmScore) {
      const aiAccess = await assertAiAccess(user.id, "llm_score");
      if (!aiAccess.ok) return aiAccess.response;
      result = await analyzeContextScore(sections);
      await recordAiUsage(user.id, 1, aiAccess.row);
    } else {
      result = analyzeContextScoreLocally(sections);
    }

    const applied = applyResolvedSections(
      result,
      resolvedSections,
      sections
    );

    await saveScore(user.id, applied.result, applied.resolvedSections);

    return NextResponse.json({ score: applied.result, cached: false });
  } catch (error) {
    console.error("POST context-score error:", error);
    return NextResponse.json(
      { error: friendlyGeminiError(error) },
      { status: 500 }
    );
  }
}
