import type { ContextScoreGap } from "@/lib/context-score";
import { friendlySectionTitle } from "@/lib/section-display";

export const CONTEXT_SCORE_BEFORE_KEY = "meto-context-score-before";
export const CONTEXT_SCORE_CELEBRATE_KEY = "meto-context-score-celebrate";
export const CONTEXT_SCORE_GAPS_KEY = "meto-context-score-gaps";
export const CONTEXT_SCORE_GAPS_ALL_KEY = "meto-context-score-gaps-all";
export const CONTEXT_SCORE_GAP_MODE_KEY = "meto-context-score-gap-mode";

export type GapFixQueueItem = {
  sectionType: string;
  insight: string;
  title: string;
};

export type GapFixMode = "single" | "all";

export type GapFixIntent = {
  mode: GapFixMode;
  sectionType: string;
  insight: string;
  title: string;
  queue: GapFixQueueItem[];
  queueIndex: number;
  totalCount: number;
};

function readJson<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function gapsToQueue(gaps: ContextScoreGap[]): GapFixQueueItem[] {
  return gaps.map((gap) => ({
    sectionType: gap.section_type,
    insight: gap.insight,
    title: gap.title || friendlySectionTitle(gap.section_type),
  }));
}

export function storeGapFixSession(
  queue: GapFixQueueItem[],
  mode: GapFixMode,
  currentScore: number
) {
  writeJson(CONTEXT_SCORE_GAPS_KEY, queue);
  writeJson(CONTEXT_SCORE_GAPS_ALL_KEY, queue);
  sessionStorage.setItem(CONTEXT_SCORE_GAP_MODE_KEY, mode);
  storeScoreBeforeFix(currentScore);
}

export function readAllGapFixItems(): GapFixQueueItem[] {
  return (
    readJson<GapFixQueueItem[]>(CONTEXT_SCORE_GAPS_ALL_KEY) ??
    readGapFixSession()?.queue ??
    []
  );
}

export function readGapFixSession(): {
  queue: GapFixQueueItem[];
  mode: GapFixMode;
} | null {
  const queue = readJson<GapFixQueueItem[]>(CONTEXT_SCORE_GAPS_KEY);
  if (!queue?.length) return null;
  const mode =
    (sessionStorage.getItem(CONTEXT_SCORE_GAP_MODE_KEY) as GapFixMode) ||
    "single";
  return { queue, mode };
}

export function advanceGapFixSession(): GapFixQueueItem | null {
  const session = readGapFixSession();
  if (!session || session.queue.length <= 1) {
    clearGapFixSession();
    return null;
  }
  const [, ...rest] = session.queue;
  writeJson(CONTEXT_SCORE_GAPS_KEY, rest);
  return rest[0] ?? null;
}

export function clearGapFixSession() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CONTEXT_SCORE_GAPS_KEY);
  sessionStorage.removeItem(CONTEXT_SCORE_GAPS_ALL_KEY);
  sessionStorage.removeItem(CONTEXT_SCORE_GAP_MODE_KEY);
  clearAppliedGapSections();
}

export function remainingGapCount(): number {
  const session = readGapFixSession();
  return session?.queue.length ?? 0;
}

export function buildGapFixUpdateUrl(sectionType: string, insight: string) {
  const params = new URLSearchParams({
    section: sectionType,
    from: "context-score",
    mode: "single",
  });
  if (insight.trim()) {
    params.set("insight", insight.trim());
  }
  return `/dashboard/update?${params.toString()}`;
}

export function buildGapFixAllUpdateUrl() {
  return "/dashboard/update?from=context-score&mode=all";
}

export function buildGapFixProfileUrl(sectionType: string) {
  return `/dashboard/profile?section=${encodeURIComponent(sectionType)}&from=context-score`;
}

export function storeScoreBeforeFix(score: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CONTEXT_SCORE_BEFORE_KEY, String(score));
}

export function readScoreBeforeFix(): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CONTEXT_SCORE_BEFORE_KEY);
  if (!raw) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function clearScoreBeforeFix() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CONTEXT_SCORE_BEFORE_KEY);
}

export const CONTEXT_SCORE_APPLIED_KEY = "meto-context-score-applied-sections";

export function markGapSectionApplied(sectionType: string) {
  const current = readJson<string[]>(CONTEXT_SCORE_APPLIED_KEY) ?? [];
  if (current.includes(sectionType)) return;
  writeJson(CONTEXT_SCORE_APPLIED_KEY, [...current, sectionType]);
}

export function readAppliedGapSections(): string[] {
  return readJson<string[]>(CONTEXT_SCORE_APPLIED_KEY) ?? [];
}

function clearAppliedGapSections() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CONTEXT_SCORE_APPLIED_KEY);
}

export function readFixedSectionsFromSession(): string[] {
  return readAppliedGapSections();
}

export function markCelebratePending(fixedSections?: string[]) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CONTEXT_SCORE_CELEBRATE_KEY, "1");
  if (fixedSections?.length) {
    writeJson(CONTEXT_SCORE_FIXED_SECTIONS_KEY, fixedSections);
  }
}

export const CONTEXT_SCORE_FIXED_SECTIONS_KEY =
  "meto-context-score-fixed-sections";

export function readFixedSectionsForScore(): string[] {
  return readJson<string[]>(CONTEXT_SCORE_FIXED_SECTIONS_KEY) ?? [];
}

export function clearFixedSectionsForScore() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CONTEXT_SCORE_FIXED_SECTIONS_KEY);
}

export function readCelebratePending(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(CONTEXT_SCORE_CELEBRATE_KEY) === "1";
}

export function clearCelebratePending() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CONTEXT_SCORE_CELEBRATE_KEY);
}

export function buildGapFixIntentFromSession(
  sectionType: string,
  insight: string
): GapFixIntent | null {
  const session = readGapFixSession();
  if (!session) return null;

  const index = session.queue.findIndex(
    (item) => item.sectionType === sectionType
  );
  if (index < 0) return null;

  return {
    mode: session.mode,
    sectionType,
    insight,
    title: session.queue[index].title,
    queue: session.queue,
    queueIndex: index,
    totalCount: readAllGapFixItems().length || session.queue.length,
  };
}
