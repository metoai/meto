const STORAGE_KEY = "meto_update_history";
const MAX_ENTRIES = 10;

export type UpdateHistoryEntry = {
  id: string;
  timestamp: string;
  message: string;
  sections: string[];
  preview?: Record<string, string>;
};

export function readUpdateHistory(): UpdateHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as UpdateHistoryEntry[];
    if (!Array.isArray(parsed)) return [];
    return parsed.map(({ preview: _preview, message, ...entry }) => ({
      ...entry,
      message: truncateHistoryMessage(message),
    }));
  } catch {
    return [];
  }
}

function truncateHistoryMessage(message: string, max = 160): string {
  const trimmed = message.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max).trimEnd()}…`;
}

export function recordUpdate(entry: Omit<UpdateHistoryEntry, "id" | "timestamp">) {
  if (typeof window === "undefined") return;
  const { preview: _preview, ...lean } = entry;
  const history = readUpdateHistory();
  history.unshift({
    ...lean,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, MAX_ENTRIES)));
}

export function formatUpdateTime(iso: string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
