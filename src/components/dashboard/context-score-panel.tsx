"use client";

import Link from "next/link";
import { UpgradeLockedLink } from "@/components/billing/upgrade-locked-link";
import { ArrowRight, Loader2, Sparkles, TrendingUp, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ContextScoreResult } from "@/lib/context-score";
import {
  buildGapFixAllUpdateUrl,
  buildGapFixProfileUrl,
  buildGapFixUpdateUrl,
  clearCelebratePending,
  clearFixedSectionsForScore,
  clearScoreBeforeFix,
  gapsToQueue,
  readCelebratePending,
  readFixedSectionsForScore,
  readScoreBeforeFix,
  storeGapFixSession,
  storeScoreBeforeFix,
} from "@/lib/context-score-actions";
import { FIXES_NAV } from "@/components/portal/portal-nav";

type ContextScorePanelProps = {
  dataVersion?: number;
  compact?: boolean;
  className?: string;
};

function scoreColor(score: number) {
  if (score >= 75) return "#0F6E56";
  if (score >= 45) return "#B45309";
  return "#DC2626";
}

export function ContextScorePanel({
  dataVersion = 0,
  compact = false,
  className = "",
}: ContextScorePanelProps) {
  const [score, setScore] = useState<ContextScoreResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [scoreDelta, setScoreDelta] = useState(0);
  const previousScoreRef = useRef<number | null>(null);
  const loadInFlightRef = useRef(false);
  const lastLoadedVersionRef = useRef(-1);
  const lastAnalyzeAtRef = useRef(0);

  const maybeCelebrate = useCallback((nextScore: number) => {
    const beforeFix = readScoreBeforeFix();
    const previous = beforeFix ?? previousScoreRef.current;

    if (previous !== null && nextScore > previous) {
      setScoreDelta(nextScore - previous);
      setCelebrating(true);
      clearScoreBeforeFix();
      window.setTimeout(() => setCelebrating(false), 7000);
    }

    previousScoreRef.current = nextScore;
  }, []);

  const scoreRef = useRef<ContextScoreResult | null>(null);
  scoreRef.current = score;

  const loadScore = useCallback(async () => {
    if (loadInFlightRef.current) return;

    const forceCelebrate = readCelebratePending();
    const recentlyAnalyzed = Date.now() - lastAnalyzeAtRef.current < 4000;

    if (
      recentlyAnalyzed &&
      scoreRef.current &&
      !forceCelebrate &&
      lastLoadedVersionRef.current === dataVersion
    ) {
      return;
    }

    loadInFlightRef.current = true;
    setError(null);
    setAnalyzing(true);

    const isInitial = scoreRef.current === null;
    if (isInitial) setLoading(true);

    try {
      const getRes = await fetch("/api/profile/context-score");
      const getData = await getRes.json();

      if (!getRes.ok) {
        throw new Error(getData.error ?? "Failed to load context score.");
      }

      const shouldAnalyze =
        forceCelebrate ||
        !getData.score ||
        !getData.cached ||
        Boolean(getData.stale);

      if (!shouldAnalyze && getData.score) {
        setScore(getData.score);
        maybeCelebrate(getData.score.score);
        lastLoadedVersionRef.current = dataVersion;
        return;
      }

      const postRes = await fetch("/api/profile/context-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          force: forceCelebrate || Boolean(getData.stale) || !getData.score,
          fixedSections: forceCelebrate ? readFixedSectionsForScore() : [],
        }),
      });
      const postData = await postRes.json();

      if (!postRes.ok) {
        throw new Error(postData.error ?? "Failed to analyze profile.");
      }

      const next = postData.score ?? null;
      setScore(next);
      if (next) {
        maybeCelebrate(next.score);
        lastAnalyzeAtRef.current = Date.now();
        lastLoadedVersionRef.current = dataVersion;
        clearCelebratePending();
        clearFixedSectionsForScore();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load context score."
      );
    } finally {
      loadInFlightRef.current = false;
      setLoading(false);
      setAnalyzing(false);
    }
  }, [dataVersion, maybeCelebrate]);

  useEffect(() => {
    void loadScore();
  }, [dataVersion, loadScore]);

  function handleFixStart(currentScore: number, gaps: ContextScoreResult["gaps"]) {
    storeScoreBeforeFix(currentScore);
    storeGapFixSession(gapsToQueue(gaps), "single", currentScore);
  }

  function handleFixAllStart(currentScore: number, gaps: ContextScoreResult["gaps"]) {
    storeScoreBeforeFix(currentScore);
    storeGapFixSession(gapsToQueue(gaps), "all", currentScore);
  }

  if (loading) {
    return (
      <div
        className={`rounded-xl border border-[#E8E8E4] bg-[#F7F7F5] p-4 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-40 rounded" />
            <div className="skeleton h-3 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !score) {
    return null;
  }

  const color = scoreColor(score.score);

  if (compact) {
    const gapCount = score.gaps.length;
    return (
      <div
        className={`rounded-xl border border-[#E8E8E4] bg-white px-5 py-4 ${className}`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0F6E56]" />
              <span className="text-xs font-medium uppercase tracking-[0.06em] text-[#9B9B93]">
                Context score
              </span>
            </div>
            <p
              className="mt-2 text-4xl font-semibold tabular-nums tracking-tight"
              style={{ color }}
            >
              {score.score}
              <span className="text-lg font-medium text-[#9B9B93]">%</span>
            </p>
            <p className="mt-1 max-w-xs text-xs leading-relaxed text-[#6B6B63]">
              {score.headline}
            </p>
          </div>
          {gapCount > 0 ? (
            <Link
              href={FIXES_NAV.href}
              className="shrink-0 rounded-lg border border-[#0F6E56] px-3 py-1.5 text-xs font-medium text-[#0F6E56] transition-colors hover:bg-[#F0FAF7]"
            >
              {gapCount} fix{gapCount === 1 ? "" : "es"} →
            </Link>
          ) : (
            <span className="shrink-0 rounded-lg bg-[#F0FAF7] px-3 py-1.5 text-xs font-medium text-[#0F6E56]">
              All clear
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-[#E8E8E4] bg-[#F7F7F5] p-5 ${className}`}
    >
      {celebrating ? (
        <div
          className="mb-4 flex items-start gap-3 rounded-lg border border-[#C0E0D8] bg-[#E8F5F0] px-4 py-3"
          role="status"
        >
          <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[#0F6E56]" />
          <div>
            <p className="text-sm font-medium text-[#0F6E56]">
              Context score up {scoreDelta} point{scoreDelta === 1 ? "" : "s"} —
              now {score.score}%
            </p>
            <p className="mt-0.5 text-xs text-[#6B6B63]">
              AI understands you better. Keep going — every section you sharpen
              makes every tool smarter about you.
            </p>
          </div>
        </div>
      ) : null}

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#E8E8E4] bg-white text-base font-semibold tabular-nums"
            style={{ color }}
          >
            {score.score}
          </div>
          <div>
            <p className="text-[13px] font-medium text-[#1A1A18]">
              {score.headline}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-[#6B6B63]">
              {score.summary}
            </p>
            {score.used_fallback ? (
              <p className="mt-2 text-[11px] text-[#9B9B93]">
                Estimated score (Free). Upgrade for LLM analysis.
              </p>
            ) : null}
          </div>
        </div>
        {analyzing ? (
          <Loader2
            className="h-4 w-4 shrink-0 animate-spin text-[#9B9B93]"
            aria-hidden
          />
        ) : null}
      </div>

      {score.gaps.length > 1 ? (
        <div className="mb-4">
          <UpgradeLockedLink
            feature="gap_fix"
            href={buildGapFixAllUpdateUrl()}
            onClick={() => handleFixAllStart(score.score, score.gaps)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F6E56] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#1D9E75] sm:w-auto"
          >
            <Zap className="h-4 w-4" />
            Fix all with AI
            <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
              {score.gaps.length} gaps
            </span>
          </UpgradeLockedLink>
          <p className="mt-2 text-[11px] text-[#9B9B93]">
            One quick run — Meto walks through each gap step by step.
          </p>
        </div>
      ) : null}

      {score.gaps.length ? (
        <div className="space-y-2.5">
          {score.gaps.map((gap) => (
            <div
              key={gap.section_type}
              className="rounded-lg border border-[#E8E8E4] bg-white px-3.5 py-3"
            >
              <p className="text-xs leading-relaxed text-[#6B6B63]">
                {gap.insight}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <UpgradeLockedLink
                  feature="gap_fix"
                  href={buildGapFixUpdateUrl(gap.section_type, gap.insight)}
                  onClick={() => handleFixStart(score.score, score.gaps)}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#0F6E56] bg-white px-3 py-1.5 text-xs font-medium text-[#0F6E56] transition-colors hover:bg-[#F0FAF7]"
                >
                  Fix with AI
                  <ArrowRight className="h-3 w-3" />
                </UpgradeLockedLink>
                <Link
                  href={buildGapFixProfileUrl(gap.section_type)}
                  onClick={() => handleFixStart(score.score, score.gaps)}
                  className="inline-flex items-center rounded-lg border border-[#E8E8E4] bg-white px-3 py-1.5 text-xs font-medium text-[#6B6B63] transition-colors hover:border-[#C0C0B8] hover:text-[#1A1A18]"
                >
                  Edit manually
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
