"use client";

import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { DashboardCard } from "@/components/dashboard/ui/dashboard-card";
import { ScoreSparkline } from "@/components/dashboard/ui/score-sparkline";
import { scoreColor } from "@/hooks/use-context-score";
import { weekDelta, getSparklineData } from "@/lib/score-history";
import {
  buildGapFixAllUpdateUrl,
  storeGapFixSession,
  storeScoreBeforeFix,
  gapsToQueue,
} from "@/lib/context-score-actions";
import type { ContextScoreResult } from "@/lib/context-score";
import { CORE_SECTION_TYPES } from "@/lib/meto-prompts";
import { buildProfileSummary } from "@/lib/profile-summary";
import type { ContextSection } from "@/lib/types";

type SignalHeroProps = {
  score: ContextScoreResult;
  sections: ContextSection[];
  celebrating?: boolean;
  scoreDelta?: number;
};

export function SignalHero({
  score,
  sections,
  celebrating,
  scoreDelta = 0,
}: SignalHeroProps) {
  const color = scoreColor(score.score);
  const delta = weekDelta(getSparklineData(score.score));
  const gapCount = score.gaps.length;

  const filledCount = CORE_SECTION_TYPES.filter((type) =>
    sections.some(
      (s) => s.section_type === type && s.content?.trim().length > 0
    )
  ).length;

  const estimatedTarget = Math.min(99, score.score + gapCount * 12);
  const profileSummary = buildProfileSummary(sections);

  function handleFixAll() {
    storeScoreBeforeFix(score.score);
    storeGapFixSession(gapsToQueue(score.gaps), "all", score.score);
  }

  return (
    <div className="space-y-3">
      {celebrating ? (
        <div
          className="flex items-center gap-2.5 rounded-xl bg-[var(--primary-light)] px-4 py-3"
          role="status"
        >
          <TrendingUp className="h-4 w-4 shrink-0 text-[var(--primary)]" />
          <p className="text-sm text-[var(--primary)]">
            Up {scoreDelta} point{scoreDelta === 1 ? "" : "s"} — now {score.score}%
          </p>
        </div>
      ) : null}

      <DashboardCard hover={false} className="overflow-hidden !p-0">
        <div className="p-4 md:p-5">
          <div className="border-b border-[var(--border-subtle)] pb-5">
            <div className="flex gap-3.5 md:gap-4">
              <div className="shrink-0 pt-0.5">
                <MetoMarkBadge size="md" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--primary)]">
                    Meto knows about you
                  </p>
                  <span className="hidden h-1 w-1 rounded-full bg-[var(--accent-border)] sm:inline-block" />
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    Ready for any AI
                  </p>
                </div>
                <p className="mt-2.5 text-[15px] font-medium leading-[1.55] tracking-[-0.01em] text-[var(--text)] md:text-base">
                  {profileSummary}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-[11px] text-[var(--text-secondary)]">
                {filledCount}/{CORE_SECTION_TYPES.length} sections in your profile
              </p>
              {gapCount > 0 ? (
                <p className="text-[11px]">
                  <span className="text-[var(--text-secondary)]">·</span>{" "}
                  <span className="font-medium" style={{ color }}>
                    {gapCount} gap{gapCount === 1 ? "" : "s"} to close
                  </span>
                </p>
              ) : (
                <p className="text-[11px] text-[var(--primary)]">· Profile complete</p>
              )}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="landing-panel-label">Context score</p>
              <div className="mt-2 flex items-end gap-0.5">
                <span
                  className="font-mono-brand text-[44px] font-semibold tabular-nums leading-none tracking-[-0.03em] md:text-[52px]"
                  style={{ color }}
                >
                  {score.score}
                </span>
                <span className="mb-1.5 text-[15px] text-[var(--muted)]">%</span>
              </div>
            </div>

            <div
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] tabular-nums ${
                delta >= 0
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "bg-[#FEE2E2] text-[#DC2626]"
              }`}
            >
              {delta >= 0 ? (
                <TrendingUp className="h-3 w-3" strokeWidth={2} />
              ) : (
                <TrendingDown className="h-3 w-3" strokeWidth={2} />
              )}
              {delta >= 0 ? "+" : ""}
              {delta} this week
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl">
            <div className="px-1 pb-1 pt-2 md:px-2">
              <p className="landing-panel-label mb-3 px-1">Last 7 days</p>
              <div className="h-[112px] md:h-[120px]">
                <ScoreSparkline
                  variant="hero"
                  currentScore={score.score}
                  height={120}
                  className="h-full w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </DashboardCard>

      {score.score < 50 && gapCount > 0 ? (
        <DashboardCard hover={false} className="!py-3.5 sm:!px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="text-[var(--text)]">
                {gapCount} fix{gapCount === 1 ? "" : "es"}
              </span>{" "}
              could bring you to ~{estimatedTarget}%
            </p>
            <Link
              href={buildGapFixAllUpdateUrl()}
              onClick={handleFixAll}
              className="inline-flex shrink-0 items-center gap-1.5 text-sm text-[var(--primary)] transition-colors duration-150 hover:text-[var(--primary-hover)]"
            >
              Fix all with AI
              <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Link>
          </div>
        </DashboardCard>
      ) : null}
    </div>
  );
}
