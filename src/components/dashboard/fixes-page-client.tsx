"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import { TrendingUp } from "lucide-react";
import { SuccessToast } from "@/components/dashboard-shell";
import { DashboardCard, PageHeader } from "@/components/dashboard/ui/dashboard-card";
import {
  FixesProgressStrip,
  GapCard,
  IMPACT_LABELS,
} from "@/components/dashboard/ui/fixes-gap-ui";
import { usePortalData } from "@/components/portal/portal-data-context";
import { isDeveloperWorkspace } from "@/lib/workspace-mode";
import { useContextScore } from "@/hooks/use-context-score";
import type { ContextScoreGap } from "@/lib/context-score";
import { gapImpactLevel, type GapImpact } from "@/lib/section-quality";
import {
  gapsToQueue,
  storeGapFixSession,
  storeScoreBeforeFix,
} from "@/lib/context-score-actions";
import { PortalPageShell } from "@/components/portal/portal-page-shell";

export function FixesPageClient() {
  const router = useRouter();
  const { loaded, profile, dataVersion, contextScore } = usePortalData();
  const { score: fetchedScore, celebrating, scoreDelta } =
    useContextScore(dataVersion);
  const score = fetchedScore ?? contextScore;

  useEffect(() => {
    if (!loaded) return;
    if (isDeveloperWorkspace(profile)) {
      router.replace("/dashboard/projects");
    }
  }, [loaded, profile, router]);

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

          {loaded && score ? (
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
