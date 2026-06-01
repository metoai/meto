import { CORE_SECTION_TYPES, PROFILE_SECTIONS } from "@/lib/meto-prompts";
import type { ContextScoreGap } from "@/lib/context-score";
import type { ContextSection } from "@/lib/types";
import { getSectionStatus } from "@/lib/section-status";
import { friendlySectionTitle } from "@/lib/section-display";

export type SectionQualityScore = {
  sectionType: string;
  title: string;
  score: number;
};

/** Weights for overall score — must sum to 100. */
export const SECTION_SCORE_WEIGHTS: Record<string, number> = {
  about: 12,
  work: 14,
  projects: 14,
  skills: 12,
  goals: 14,
  working_style: 18,
  context_for_ai: 16,
};

const THIN_CONTENT_CHARS = 80;

type SectionScoreOptions = {
  hasGap?: boolean;
  stale?: boolean;
  incomplete?: boolean;
};

/** Per-section score 0–100 from content depth. Same scale as the dashboard bars. */
export function scoreSectionContent(
  content: string,
  options: SectionScoreOptions = {}
): number {
  const len = content.trim().length;
  let score: number;

  if (len === 0) score = 0;
  else if (len < 20) score = 12;
  else if (len < 40) score = 28;
  else if (len < 80) score = 48;
  else if (len < 150) score = 62;
  else if (len < 250) score = 76;
  else if (len < 400) score = 88;
  else score = 100;

  if (options.incomplete) score = Math.min(score, 32);
  if (options.stale) score = Math.max(18, score - 12);
  if (options.hasGap) score = Math.min(score, 45);

  return Math.max(0, Math.min(100, Math.round(score)));
}

type SectionLike = {
  section_type: string;
  content: string;
  updated_at?: string;
};

function sectionOptions(
  section: SectionLike | undefined,
  hasGap: boolean
): SectionScoreOptions {
  if (!section) {
    return { hasGap: true, incomplete: true };
  }
  const status = getSectionStatus(section as ContextSection);
  return {
    hasGap,
    stale: status === "stale",
    incomplete: status === "incomplete",
  };
}

export function computeSectionQualityScores(
  sections: SectionLike[],
  gaps: ContextScoreGap[] = []
): SectionQualityScore[] {
  const gapTypes = new Set(gaps.map((g) => g.section_type));
  const byType = new Map(sections.map((s) => [s.section_type, s]));

  return CORE_SECTION_TYPES.map((type) => {
    const section = byType.get(type);
    const content = section?.content?.trim() ?? "";
    const score = scoreSectionContent(
      content,
      sectionOptions(section, gapTypes.has(type))
    );

    return {
      sectionType: type,
      title: friendlySectionTitle(type),
      score,
    };
  });
}

/** Single source of truth for the hero context score — weighted average of all 7 sections. */
export function computeOverallProfileScore(
  sections: SectionLike[],
  gaps: ContextScoreGap[] = []
): number {
  const gapTypes = new Set(gaps.map((g) => g.section_type));
  const byType = new Map(sections.map((s) => [s.section_type, s]));

  let weighted = 0;
  let totalWeight = 0;

  for (const meta of PROFILE_SECTIONS) {
    const weight = SECTION_SCORE_WEIGHTS[meta.type] ?? 10;
    const section = byType.get(meta.type);
    const content = section?.content?.trim() ?? "";
    const score = scoreSectionContent(
      content,
      sectionOptions(section, gapTypes.has(meta.type))
    );
    weighted += score * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;
  return Math.round(weighted / totalWeight);
}

export function headlineForScore(
  score: number,
  gapCount: number
): { headline: string; summary: string } {
  if (score >= 90 && gapCount === 0) {
    return {
      headline: "AI knows you well — profile is in great shape",
      summary: `Your profile is ${score}% understood by AI. You're in great shape.`,
    };
  }
  if (score >= 75) {
    return {
      headline: "AI knows you fairly well — a few gaps remain",
      summary: `Your profile is ${score}% understood by AI.${
        gapCount ? " Strengthen the sections below to improve further." : ""
      }`,
    };
  }
  if (score >= 50) {
    return {
      headline: "AI is missing some of what matters most",
      summary: `Your profile is ${score}% understood by AI. Focus on the weakest sections first.`,
    };
  }
  return {
    headline: "AI is missing the things that matter most",
    summary: `Your profile is ${score}% understood by AI. Add detail to your core sections.`,
  };
}

/** Gaps for sections that are empty or too thin — keeps hero and bars aligned. */
export function gapsFromThinSections(sections: SectionLike[]): ContextScoreGap[] {
  const byType = new Map(sections.map((s) => [s.section_type, s]));
  const gaps: ContextScoreGap[] = [];

  for (const meta of PROFILE_SECTIONS) {
    const content = byType.get(meta.type)?.content?.trim() ?? "";
    if (!content) {
      gaps.push({
        section_type: meta.type,
        title: meta.title,
        insight: `Your ${meta.title.toLowerCase()} section is empty — AI will guess instead of knowing.`,
        fix_label: "Fix this →",
      });
    } else if (content.length < THIN_CONTENT_CHARS) {
      gaps.push({
        section_type: meta.type,
        title: meta.title,
        insight: `Your ${meta.title.toLowerCase()} section is too vague — AI can't tell what you can actually do.`,
        fix_label: "Add more detail →",
      });
    }
  }

  return gaps;
}

export function qualityBarColor(score: number): string {
  if (score >= 70) return "#0F6E56";
  if (score >= 40) return "#B45309";
  return "#DC2626";
}

export function generateQualityInsight(
  scores: SectionQualityScore[],
  gaps: ContextScoreGap[] = []
): string {
  const weakest = [...scores].sort((a, b) => a.score - b.score)[0];
  if (!weakest || weakest.score >= 88) {
    return "Your profile gives AI a solid picture of who you are. Keep sections fresh as things change.";
  }

  const gap = gaps.find((g) => g.section_type === weakest.sectionType);
  if (gap) return gap.insight;

  if (weakest.score === 0) {
    return `Your ${weakest.title.toLowerCase()} section is empty — AI will guess instead of knowing.`;
  }

  return `Your ${weakest.title.toLowerCase()} section is too vague — AI can't tell what you can actually do.`;
}

export function estimateGapImpact(
  gapIndex: number,
  totalGaps: number,
  currentScore: number
): number {
  if (totalGaps === 0) return 0;
  const remaining = 100 - currentScore;
  const weights = [0.45, 0.3, 0.15, 0.1];
  const weight = weights[gapIndex] ?? 0.08;
  return Math.max(4, Math.round(remaining * weight));
}

export type GapImpact = "high" | "medium" | "low";

export function gapImpactLevel(index: number): GapImpact {
  if (index === 0) return "high";
  if (index <= 2) return "medium";
  return "low";
}
