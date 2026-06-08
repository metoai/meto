import type { ContextSection } from "@/lib/types";

export type SectionStatus = "fresh" | "stale" | "empty" | "incomplete";

const STALE_DAYS = 7;
const INCOMPLETE_MIN = 40;

export function getSectionStatus(section: ContextSection): SectionStatus {
  const content = section.content?.trim() ?? "";
  if (!content) return "empty";
  if (content.length < INCOMPLETE_MIN) return "incomplete";

  const updatedAt = section.updated_at ? new Date(section.updated_at) : null;
  if (updatedAt) {
    const ageMs = Date.now() - updatedAt.getTime();
    const ageDays = ageMs / (1000 * 60 * 60 * 24);
    if (ageDays > STALE_DAYS) return "stale";
  }

  return "fresh";
}

export function statusBorderColor(status: SectionStatus): string {
  switch (status) {
    case "fresh":
      return "var(--primary)";
    case "stale":
      return "#B45309";
    case "empty":
    case "incomplete":
      return "#DC2626";
  }
}

export function statusRecencyLabel(
  status: SectionStatus,
  updatedAt?: string
): string {
  if (status === "empty") return "Not started";
  if (status === "incomplete") return "Needs more detail";

  if (!updatedAt) {
    return status === "stale" ? "Needs refresh" : "Updated recently";
  }

  const date = new Date(updatedAt);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (status === "stale") {
    return `Needs refresh — ${diffDays} days old`;
  }

  if (diffDays === 0) return "Updated today";
  if (diffDays === 1) return "Updated yesterday";
  if (diffDays < 7) return `Updated ${diffDays} days ago`;
  return `Updated ${diffDays} days ago`;
}

export function statusSortPriority(status: SectionStatus): number {
  switch (status) {
    case "empty":
      return 0;
    case "incomplete":
      return 1;
    case "stale":
      return 2;
    case "fresh":
      return 3;
  }
}

export function truncateContent(content: string, maxLength = 80): string {
  const trimmed = content.trim();
  if (!trimmed) return "";
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength).trim()}…`;
}
