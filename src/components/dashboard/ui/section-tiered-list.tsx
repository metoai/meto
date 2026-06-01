"use client";

import Link from "next/link";
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
};

export function SectionTieredList({
  sections,
  gaps = [],
  currentScore = 0,
  showFixCallouts = true,
  editHref = (type) => `/dashboard/profile?section=${type}`,
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
        const preview = truncateContent(section.content);

        return (
          <DashboardCard
            key={section.id}
            as="article"
            className="!p-0 overflow-hidden"
          >
            <div
              className="flex items-stretch"
              style={{ borderLeft: `3px solid ${statusBorderColor(status)}` }}
            >
              <div className="min-w-0 flex-1 px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm text-[#1A1A18]">{title}</h3>
                  <SectionStatusBadge status={status} />
                  <VisibilityBadge isPublic={section.is_public} />
                </div>

                <p className="mt-1.5 text-sm leading-relaxed text-[#6B6B63]">
                  {preview || (
                    <span className="text-[#C0C0B8]">No content yet</span>
                  )}
                </p>

                <p className="mt-2 text-xs text-[#9B9B93]">
                  {statusRecencyLabel(status, section.updated_at)}
                </p>

                {showFixCallouts && gap ? (
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 rounded-lg bg-[#FFFBEB] px-3 py-2">
                    <span className="text-xs leading-relaxed text-[#92400E]">
                      ⚠ {gap.insight}
                    </span>
                    <Link
                      href={buildGapFixUpdateUrl(gap.section_type, gap.insight)}
                      onClick={() => handleFixClick()}
                      className="shrink-0 text-xs text-[#0F6E56] transition-colors duration-150 hover:text-[#1D9E75]"
                    >
                      Fix with AI →
                    </Link>
                  </div>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center px-4">
                <Link
                  href={editHref(section.section_type)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9B9B93] transition-all duration-150 hover:bg-[#F7F7F5] hover:text-[#1A1A18]"
                  aria-label={`Edit ${title}`}
                >
                  <Pencil className="h-4 w-4" strokeWidth={1.75} />
                </Link>
              </div>
            </div>
          </DashboardCard>
        );
      })}
    </div>
  );
}

export { buildGapFixProfileUrl };
