const STORAGE_KEY = "meto_score_history";
const MAX_DAYS = 7;

export type ScoreHistoryPoint = {
  date: string;
  score: number;
};

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function readScoreHistory(): ScoreHistoryPoint[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ScoreHistoryPoint[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function recordScore(score: number): ScoreHistoryPoint[] {
  if (typeof window === "undefined") return [];
  const today = todayKey();
  const history = readScoreHistory().filter((p) => p.date !== today);
  history.push({ date: today, score });
  history.sort((a, b) => a.date.localeCompare(b.date));

  const trimmed = history.slice(-MAX_DAYS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  return trimmed;
}

export function getSparklineData(currentScore: number): number[] {
  const history = readScoreHistory();
  const points: number[] = [];

  for (let i = MAX_DAYS - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = history.find((p) => p.date === key);
    if (found) {
      points.push(found.score);
    } else if (i === 0) {
      points.push(currentScore);
    } else if (points.length > 0) {
      points.push(points[points.length - 1]);
    } else {
      points.push(Math.max(0, currentScore - (MAX_DAYS - i) * 2));
    }
  }

  while (points.length < MAX_DAYS) {
    points.unshift(Math.max(0, (points[0] ?? currentScore) - 1));
  }

  return points.slice(-MAX_DAYS);
}

export function weekDelta(history: number[]): number {
  if (history.length < 2) return 0;
  return history[history.length - 1] - history[0];
}
