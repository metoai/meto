"use client";

import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { UpgradeLockedLink } from "@/components/billing/upgrade-locked-link";
import { DashboardCard } from "@/components/dashboard/ui/dashboard-card";
import { scoreColor } from "@/hooks/use-context-score";
import {
  buildGapFixAllUpdateUrl,
  buildGapFixProfileUrl,
  buildGapFixUpdateUrl,
} from "@/lib/context-score-actions";
import type { ContextScoreGap, ContextScoreResult } from "@/lib/context-score";
import {
  estimateGapImpact,
  gapImpactLevel,
  type GapImpact,
} from "@/lib/section-quality";

export const IMPACT_LABELS: Record<GapImpact, { label: string; color: string }> = {
  high: { label: "High impact", color: "#DC2626" },
  medium: { label: "Medium impact", color: "#B45309" },
  low: { label: "Low impact", color: "#9B9B93" },
};

type FixesProgressStripProps = {
  score: ContextScoreResult;
  highCount: number;
  onFixAllStart: () => void;
  preview?: boolean;
};

export function FixesProgressStrip({
  score,
  highCount,
  onFixAllStart,
  preview = false,
}: FixesProgressStripProps) {
  const color = scoreColor(score.score);
  const gapCount = score.gaps.length;
  const estimatedTarget = Math.min(99, score.score + gapCount * 12);

  const fixAllClassName =
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm text-white transition-colors duration-150 hover:bg-[var(--primary-hover)] lg:self-center";

  return (
    <DashboardCard hover={false} className="!p-4 md:!p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-4">
          <div
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: `${color}12` }}
          >
            <span
              className="text-xl font-semibold tabular-nums leading-none"
              style={{ color }}
            >
              {score.score}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm leading-snug text-[var(--text)]">{score.headline}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              {gapCount} gap{gapCount === 1 ? "" : "s"} left
              {gapCount > 0 ? ` · fixing all → ~${estimatedTarget}%` : ""}
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:px-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] text-[var(--muted)]">
            <span>Context score</span>
            <span className="tabular-nums">{score.score}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{ width: `${score.score}%`, backgroundColor: color }}
            />
          </div>
        </div>

        {highCount > 0 ? (
          preview ? (
            <span className={fixAllClassName}>
              <Zap className="h-4 w-4" />
              Fix all high-impact ({highCount})
            </span>
          ) : (
            <UpgradeLockedLink
              feature="gap_fix"
              href={buildGapFixAllUpdateUrl()}
              onClick={onFixAllStart}
              className={fixAllClassName}
            >
              <Zap className="h-4 w-4" />
              Fix all high-impact ({highCount})
            </UpgradeLockedLink>
          )
        ) : null}
      </div>
    </DashboardCard>
  );
}

type GapCardProps = {
  gap: ContextScoreGap;
  index: number;
  currentScore: number;
  totalGaps: number;
  onFixStart: () => void;
  preview?: boolean;
};

export function GapCard({
  gap,
  index,
  currentScore,
  totalGaps,
  onFixStart,
  preview = false,
}: GapCardProps) {
  const impact = gapImpactLevel(index);
  const pts = estimateGapImpact(index, totalGaps, currentScore);
  const style = IMPACT_LABELS[impact];

  const fixAiClassName =
    "inline-flex items-center justify-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs text-white transition-colors duration-150 hover:bg-[var(--primary-hover)]";
  const editClassName =
    "inline-flex items-center justify-center rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]";

  return (
    <DashboardCard as="article" hover={!preview} className="!p-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-[var(--text)]">{gap.title}</span>
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{ backgroundColor: `${style.color}15`, color: style.color }}
            >
              {style.label}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
            {gap.insight}
          </p>
          <p className="mt-2 text-xs text-[var(--primary)]">
            Fixing this → +{pts} pts
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2 xl:flex-col xl:items-stretch">
          {preview ? (
            <span className={fixAiClassName}>
              Fix with AI
              <ArrowRight className="h-3 w-3" />
            </span>
          ) : (
            <UpgradeLockedLink
              feature="gap_fix"
              href={buildGapFixUpdateUrl(gap.section_type, gap.insight)}
              onClick={onFixStart}
              className={fixAiClassName}
            >
              Fix with AI
              <ArrowRight className="h-3 w-3" />
            </UpgradeLockedLink>
          )}
          {preview ? (
            <span className={editClassName}>Edit manually</span>
          ) : (
            <Link
              href={buildGapFixProfileUrl(gap.section_type)}
              onClick={onFixStart}
              className={editClassName}
            >
              Edit manually
            </Link>
          )}
        </div>
      </div>
    </DashboardCard>
  );
}
