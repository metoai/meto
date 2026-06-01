"use client";

import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
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
          className="flex items-center gap-2.5 rounded-xl bg-[#E8F5F0] px-4 py-3"
          role="status"
        >
          <TrendingUp className="h-4 w-4 shrink-0 text-[#0F6E56]" />
          <p className="text-sm text-[#0F6E56]">
            Up {scoreDelta} point{scoreDelta === 1 ? "" : "s"} — now {score.score}%
          </p>
        </div>
      ) : null}

      <DashboardCard hover={false} className="overflow-hidden !p-0">
        <div className="p-5 md:p-6">
          <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr] lg:items-end">
            <div>
              {/* Score + sparkline row */}
              <div className="flex items-end gap-5 md:gap-8">
                <div className="shrink-0">
                  <p className="text-xs text-[#9B9B93]">Context score</p>
                  <div className="mt-1 flex items-baseline gap-0.5">
                    <span
                      className="text-[52px] font-semibold tabular-nums leading-none tracking-tight md:text-[56px]"
                      style={{ color }}
                    >
                      {score.score}
                    </span>
                    <span className="text-xl text-[#D4D4D0]">%</span>
                  </div>
                  <div
                    className={`mt-2 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] tabular-nums ${
                      delta >= 0
                        ? "bg-[#E8F5F0] text-[#0F6E56]"
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

                <div className="min-w-0 flex-1 pb-1">
                  <ScoreSparkline
                    currentScore={score.score}
                    height={52}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-[#9B9B93]">
                <span>
                  {filledCount}/{CORE_SECTION_TYPES.length} sections complete
                </span>
                {gapCount > 0 ? (
                  <span style={{ color }}>
                    • {gapCount} gap{gapCount === 1 ? "" : "s"}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-black/[0.06] bg-[#FAFAF8] p-3.5">
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9B9B93]">
                How Meto sees you
              </p>
              <p className="mt-2 text-sm leading-relaxed text-[#1A1A18]">
                {profileSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom progress track */}
        <div className="h-[3px] bg-[#F5F5F3]">
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${score.score}%`, backgroundColor: color }}
          />
        </div>
      </DashboardCard>

      {score.score < 50 && gapCount > 0 ? (
        <div className="flex flex-col gap-3 rounded-xl border border-black/[0.06] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-[#6B6B63]">
            <span className="text-[#1A1A18]">
              {gapCount} fix{gapCount === 1 ? "" : "es"}
            </span>{" "}
            could bring you to ~{estimatedTarget}%
          </p>
          <Link
            href={buildGapFixAllUpdateUrl()}
            onClick={handleFixAll}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-[#0F6E56] transition-colors duration-150 hover:text-[#1D9E75]"
          >
            Fix all with AI
            <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
