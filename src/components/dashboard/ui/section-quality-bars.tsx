"use client";

import type { SectionQualityScore } from "@/lib/section-quality";
import { qualityBarColor } from "@/lib/section-quality";
import { DashboardCard, SectionLabel } from "@/components/dashboard/ui/dashboard-card";

type SectionQualityBarsProps = {
  scores: SectionQualityScore[];
  insight: string;
  compact?: boolean;
};

export function SectionQualityBars({
  scores,
  insight,
  compact = false,
}: SectionQualityBarsProps) {
  const visibleScores = compact ? scores.slice(0, 5) : scores;

  return (
    <DashboardCard hover={false} className={compact ? "p-4" : ""}>
      <SectionLabel>How well AI understands each part of you</SectionLabel>
      <div className={compact ? "mt-3 space-y-2.5" : "mt-4 space-y-3"}>
        {visibleScores.map((item) => (
          <div key={item.sectionType} className="flex items-center gap-3">
            <span
              className={`shrink-0 truncate text-[#1A1A18] ${
                compact ? "w-[100px] text-xs" : "w-[120px] text-sm"
              }`}
            >
              {item.title}
            </span>
            <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-[#F7F7F5]">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-in-out"
                style={{
                  width: `${item.score}%`,
                  backgroundColor: qualityBarColor(item.score),
                }}
              />
            </div>
            <span
              className={`w-8 shrink-0 text-right tabular-nums ${
                compact ? "text-xs" : "text-sm"
              }`}
              style={{ color: qualityBarColor(item.score) }}
            >
              {item.score}
            </span>
          </div>
        ))}
      </div>
      {!compact ? (
        <p className="mt-4 text-sm leading-relaxed text-[#6B6B63]">{insight}</p>
      ) : null}
    </DashboardCard>
  );
}
