"use client";

import { useMemo } from "react";
import { SuccessToast } from "@/components/dashboard-shell";
import { PageHeader } from "@/components/dashboard/ui/dashboard-card";
import { SectionQualityBars } from "@/components/dashboard/ui/section-quality-bars";
import { SignalHero } from "@/components/dashboard/ui/signal-hero";
import { WorkspaceQuickAccess } from "@/components/dashboard/ui/workspace-quick-access";
import { PlanUsageCard } from "@/components/billing/plan-usage-card";
import { PortalPageShell } from "@/components/portal/portal-page-shell";
import { usePortalData } from "@/components/portal/portal-data-context";
import { useContextScore } from "@/hooks/use-context-score";
import { buildContextText } from "@/lib/context-templates";
import {
  computeSectionQualityScores,
  generateQualityInsight,
} from "@/lib/section-quality";
import type { CompileFormat } from "@/lib/types";

export function DashboardPageClient() {
  const { loaded, profile, sections, displayName, dataVersion, setProfile } =
    usePortalData();
  const { score, loading, celebrating, scoreDelta } =
    useContextScore(dataVersion);

  const contextSections = useMemo(
    () =>
      sections.map((s) => ({
        section_type: s.section_type,
        title: s.title,
        content: s.content,
      })),
    [sections]
  );

  const allTypes = useMemo(
    () => sections.map((s) => s.section_type),
    [sections]
  );

  const contextPreview = useMemo(() => {
    if (!contextSections.length) return "";
    return buildContextText(
      contextSections,
      allTypes,
      "universal",
      profile?.username || "you",
      displayName
    );
  }, [contextSections, allTypes, profile?.username, displayName]);

  const qualityScores = useMemo(
    () => computeSectionQualityScores(sections, score?.gaps ?? []),
    [sections, score?.gaps]
  );

  const qualityInsight = useMemo(
    () => generateQualityInsight(qualityScores, score?.gaps ?? []),
    [qualityScores, score?.gaps]
  );

  async function handleCopy(format: CompileFormat) {
    const text = buildContextText(
      contextSections,
      allTypes,
      format,
      profile?.username || "you",
      displayName
    );
    await navigator.clipboard.writeText(text);
  }

  return (
    <>
      <SuccessToast />
      <PortalPageShell>
          <PageHeader
            title="Dashboard"
            subtitle="How well AI understands you — and what to improve next."
          />

          {loaded && !loading && score ? (
            <div className="space-y-4">
              <SignalHero
                score={score}
                sections={sections}
                celebrating={celebrating}
                scoreDelta={scoreDelta}
              />

              <PlanUsageCard compact showCompareLink={false} />

              <div className="grid gap-4 lg:grid-cols-2">
                <SectionQualityBars
                  scores={qualityScores}
                  insight={qualityInsight}
                  compact
                />

                <WorkspaceQuickAccess
                  contextPreview={contextPreview}
                  onCopy={handleCopy}
                  username={profile?.username ?? null}
                  compact
                  onUsernameClaimed={(username) =>
                    setProfile(
                      profile
                        ? {
                            ...profile,
                            username,
                          }
                        : null
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="skeleton h-40 rounded-xl" />
              <div className="skeleton h-32 rounded-xl" />
            </div>
          )}
      </PortalPageShell>
    </>
  );
}
