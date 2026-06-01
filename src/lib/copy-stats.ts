const STORAGE_KEY = "meto_copy_stats";

type CopyStats = {
  totalCount: number;
  weekCount: number;
  weekStart: string;
  lastCopiedAt: string | null;
};

function weekStartKey() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().slice(0, 10);
}

function readStats(): CopyStats {
  if (typeof window === "undefined") {
    return { totalCount: 0, weekCount: 0, weekStart: weekStartKey(), lastCopiedAt: null };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { totalCount: 0, weekCount: 0, weekStart: weekStartKey(), lastCopiedAt: null };
    }
    return JSON.parse(raw) as CopyStats;
  } catch {
    return { totalCount: 0, weekCount: 0, weekStart: weekStartKey(), lastCopiedAt: null };
  }
}

function writeStats(stats: CopyStats) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
}

export function recordCopy(): CopyStats {
  const currentWeek = weekStartKey();
  const stats = readStats();
  const weekCount =
    stats.weekStart === currentWeek ? stats.weekCount + 1 : 1;

  const next: CopyStats = {
    totalCount: stats.totalCount + 1,
    weekCount,
    weekStart: currentWeek,
    lastCopiedAt: new Date().toISOString(),
  };
  writeStats(next);
  return next;
}

export function getCopyStats(): CopyStats {
  const stats = readStats();
  const currentWeek = weekStartKey();
  if (stats.weekStart !== currentWeek) {
    return { ...stats, weekCount: 0, weekStart: currentWeek };
  }
  return stats;
}

export function formatLastCopied(iso: string | null): string {
  if (!iso) return "Never";
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "yesterday";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
