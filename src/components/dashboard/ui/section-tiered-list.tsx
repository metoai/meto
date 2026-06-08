"use client";

import Link from "next/link";
import { UpgradeLockedLink } from "@/components/billing/upgrade-locked-link";
import { Pencil } from "lucide-react";
import type { ContextScoreGap } from "@/lib/context-score";
import type { ContextSection } from "@/lib/types";
import {
  getSectionStatus,
  statusBorderColor,
  statusRecencyLabel,
  statusSortPriority,
  truncateContent,
} from "@/lib/section-status";
import { friendlySectionTitle } from "@/lib/section-display";
import {
  SectionStatusBadge,
  VisibilityBadge,
} from "@/components/dashboard/ui/section-status-badge";
import {
  buildGapFixUpdateUrl,
  buildGapFixProfileUrl,
  storeGapFixSession,
  storeScoreBeforeFix,
  gapsToQueue,
} from "@/lib/context-score-actions";
import { DashboardCard } from "@/components/dashboard/ui/dashboard-card";

type SectionTieredListProps = {
  sections: ContextSection[];
  gaps?: ContextScoreGap[];
  currentScore?: number;
  showFixCallouts?: boolean;
  editHref?: (sectionType: string) => string;
  preview?: boolean;
};

export function SectionTieredList({
  sections,
  gaps = [],
  currentScore = 0,
  showFixCallouts = true,
  editHref = (type) => `/dashboard/profile?section=${type}`,
  preview: previewMode = false,
}: SectionTieredListProps) {
  const gapByType = new Map(gaps.map((g) => [g.section_type, g]));

  const sorted = [...sections].sort((a, b) => {
    const statusA = getSectionStatus(a);
    const statusB = getSectionStatus(b);
    const priorityDiff = statusSortPriority(statusA) - statusSortPriority(statusB);
    if (priorityDiff !== 0) return priorityDiff;
    return a.display_order - b.display_order;
  });

  function handleFixClick() {
    storeScoreBeforeFix(currentScore);
    storeGapFixSession(gapsToQueue(gaps), "single", currentScore);
  }

  return (
    <div className="space-y-2">
      {sorted.map((section) => {
        const status = getSectionStatus(section);
        const gap = gapByType.get(section.section_type);
        const title = friendlySectionTitle(section.section_type, section.title);
        const contentPreview = truncateContent(section.content);

        return (
          <DashboardCard
            key={section.id}
            as="article"
            hover={!previewMode}
            className="!p-0 overflow-hidden"
          >
            <div
              className="flex items-stretch"
              style={{ borderLeft: `3px solid ${statusBorderColor(status)}` }}
            >
              <div className="min-w-0 flex-1 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm text-[var(--text)]">{title}</h3>
                  <SectionStatusBadge status={status} />
                  <VisibilityBadge isPublic={section.is_public} />
                </div>

                <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {contentPreview || (
                    <span className="text-[var(--placeholder)]">No content yet</span>
                  )}
                </p>

                <p className="mt-2 text-xs text-[var(--muted)]">
                  {statusRecencyLabel(status, section.updated_at)}
                </p>

                {showFixCallouts && gap ? (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 rounded-lg bg-[#FFFBEB] px-3 py-2">
                    <span className="text-xs leading-relaxed text-[#92400E]">
                      ⚠ {gap.insight}
                    </span>
                    {previewMode ? (
                      <span className="shrink-0 text-xs text-[var(--primary)]">
                        Fix with AI →
                      </span>
                    ) : (
                      <UpgradeLockedLink
                        feature="gap_fix"
                        href={buildGapFixUpdateUrl(gap.section_type, gap.insight)}
                        onClick={() => handleFixClick()}
                        className="shrink-0 text-xs text-[var(--primary)] transition-colors duration-150 hover:text-[var(--primary-hover)]"
                      >
                        Fix with AI →
                      </UpgradeLockedLink>
                    )}
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center px-4">
                {previewMode ? (
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)]"
                    aria-hidden
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  </span>
                ) : (
                  <Link
                    href={editHref(section.section_type)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition-all duration-150 hover:bg-[var(--surface)] hover:text-[var(--text)]"
                    aria-label={`Edit ${title}`}
                  >
                    <Pencil className="h-4 w-4" strokeWidth={1.75} />
                  </Link>
                )}
              </div>
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
}

export { buildGapFixProfileUrl };
