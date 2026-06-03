"use client";

import Link from "next/link";
import { UpgradeLockedLink } from "@/components/billing/upgrade-locked-link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { ArrowRight, TrendingUp, Zap } from "lucide-react";
import { SuccessToast } from "@/components/dashboard-shell";
import { DashboardCard, PageHeader } from "@/components/dashboard/ui/dashboard-card";
import { usePortalData } from "@/components/portal/portal-data-context";
import { useContextScore } from "@/hooks/use-context-score";
import {
  estimateGapImpact,
  gapImpactLevel,
  type GapImpact,
} from "@/lib/section-quality";
import {
  buildGapFixAllUpdateUrl,
  buildGapFixProfileUrl,
  buildGapFixUpdateUrl,
  gapsToQueue,
  storeGapFixSession,
  storeScoreBeforeFix,
} from "@/lib/context-score-actions";
import type { ContextScoreGap, ContextScoreResult } from "@/lib/context-score";
import { PortalPageShell } from "@/components/portal/portal-page-shell";
import { scoreColor } from "@/hooks/use-context-score";

const IMPACT_LABELS: Record<GapImpact, { label: string; color: string }> = {
  high: { label: "High impact", color: "#DC2626" },
  medium: { label: "Medium impact", color: "#B45309" },
  low: { label: "Low impact", color: "#9B9B93" },
};

function FixesProgressStrip({
  score,
  highCount,
  onFixAllStart,
}: {
  score: ContextScoreResult;
  highCount: number;
  onFixAllStart: () => void;
}) {
  const color = scoreColor(score.score);
  const gapCount = score.gaps.length;
  const estimatedTarget = Math.min(99, score.score + gapCount * 12);

  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4 md:p-5">
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
          <UpgradeLockedLink
            feature="gap_fix"
            href={buildGapFixAllUpdateUrl()}
            onClick={onFixAllStart}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm text-white transition-colors duration-150 hover:bg-[var(--primary-hover)] lg:self-center"
          >
            <Zap className="h-4 w-4" />
            Fix all high-impact ({highCount})
          </UpgradeLockedLink>
        ) : null}
      </div>
    </div>
  );
}

function GapCard({
  gap,
  index,
  currentScore,
  totalGaps,
  onFixStart,
}: {
  gap: ContextScoreGap;
  index: number;
  currentScore: number;
  totalGaps: number;
  onFixStart: () => void;
}) {
  const impact = gapImpactLevel(index);
  const pts = estimateGapImpact(index, totalGaps, currentScore);
  const style = IMPACT_LABELS[impact];

  return (
    <DashboardCard as="article" className="!p-4">
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
          <UpgradeLockedLink
            feature="gap_fix"
            href={buildGapFixUpdateUrl(gap.section_type, gap.insight)}
            onClick={onFixStart}
            className="inline-flex items-center justify-center gap-1 rounded-lg bg-[var(--primary)] px-3 py-1.5 text-xs text-white transition-colors duration-150 hover:bg-[var(--primary-hover)]"
          >
            Fix with AI
            <ArrowRight className="h-3 w-3" />
          </UpgradeLockedLink>
          <Link
            href={buildGapFixProfileUrl(gap.section_type)}
            onClick={onFixStart}
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border-subtle)] px-3 py-1.5 text-xs text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]"
          >
            Edit manually
          </Link>
        </div>
      </div>
    </DashboardCard>
  );
}

export function FixesPageClient() {
  const router = useRouter();
  const { loaded, dataVersion } = usePortalData();
  const { score, loading, celebrating, scoreDelta } =
    useContextScore(dataVersion);

  useEffect(() => {
    if (!window.location.search.includes("celebrate=1")) return;
    router.replace("/dashboard/fixes");
  }, [router]);

  const grouped = useMemo(() => {
    if (!score?.gaps.length) return { high: [], medium: [], low: [] };
    const groups: Record<GapImpact, ContextScoreGap[]> = {
      high: [],
      medium: [],
      low: [],
    };
    score.gaps.forEach((gap, index) => {
      groups[gapImpactLevel(index)].push(gap);
    });
    return groups;
  }, [score?.gaps]);

  const highCount = grouped.high.length;

  function handleFixStart() {
    if (!score) return;
    storeScoreBeforeFix(score.score);
    storeGapFixSession(gapsToQueue(score.gaps), "single", score.score);
  }

  function handleFixAllStart() {
    if (!score) return;
    storeScoreBeforeFix(score.score);
    storeGapFixSession(gapsToQueue(score.gaps), "all", score.score);
  }

  return (
    <>
      <SuccessToast />
      <PortalPageShell>
          <PageHeader
            title="Fixes & recommendations"
            subtitle="Close the gaps AI still gets wrong — ordered by impact on your context score."
          />

          {loaded && !loading && score ? (
            <div className="space-y-6">
              {celebrating ? (
                <div
                  className="flex items-start gap-3 rounded-xl border border-[var(--accent-border)] bg-[var(--primary-light)] px-4 py-3"
                  role="status"
                >
                  <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]" />
                  <p className="text-sm text-[var(--primary)]">
                    Context score up {scoreDelta} point{scoreDelta === 1 ? "" : "s"} — now {score.score}%
                  </p>
                </div>
              ) : null}

              {score.gaps.length > 0 ? (
                <FixesProgressStrip
                  score={score}
                  highCount={highCount}
                  onFixAllStart={handleFixAllStart}
                />
              ) : null}

              {score.gaps.length === 0 ? (
                <DashboardCard hover={false}>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[var(--primary-light)]"
                    >
                      <span className="text-xl font-semibold tabular-nums text-[var(--primary)]">
                        {score.score}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text)]">All clear — no gaps detected.</p>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        Your profile gives AI a solid picture. Keep sections fresh as things change.
                      </p>
                    </div>
                  </div>
                </DashboardCard>
              ) : (
                <>
                  {(["high", "medium", "low"] as GapImpact[]).map((level) => {
                    const gaps = grouped[level];
                    if (!gaps.length) return null;
                    return (
                      <div key={level}>
                        <p className="mb-2 text-[13px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
                          {IMPACT_LABELS[level].label}
                        </p>
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                          {gaps.map((gap) => {
                            const index = score.gaps.indexOf(gap);
                            return (
                              <GapCard
                                key={gap.section_type}
                                gap={gap}
                                index={index}
                                currentScore={score.score}
                                totalGaps={score.gaps.length}
                                onFixStart={handleFixStart}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          ) : (
            <div className="skeleton h-48 rounded-xl" />
          )}
      </PortalPageShell>
    </>
  );
}
