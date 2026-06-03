import type { SectionStatus } from "@/lib/section-status";
import { Eye, EyeOff } from "lucide-react";

const STATUS_STYLES: Record<
  SectionStatus,
  { bg: string; text: string; label: string }
> = {
  fresh: { bg: "var(--primary-light)", text: "var(--primary)", label: "Fresh" },
  stale: { bg: "#FEF3C7", text: "#B45309", label: "Stale" },
  empty: { bg: "#FEE2E2", text: "#DC2626", label: "Empty" },
  incomplete: { bg: "#FEE2E2", text: "#DC2626", label: "Incomplete" },
};

export function SectionStatusBadge({ status }: { status: SectionStatus }) {
  const style = STATUS_STYLES[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      {style.label}
    </span>
  );
}

export function VisibilityBadge({ isPublic }: { isPublic: boolean }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-[var(--surface)] px-2 py-0.5 text-[11px] text-[var(--muted)]">
      {isPublic ? (
        <Eye className="h-3 w-3" strokeWidth={1.75} />
      ) : (
        <EyeOff className="h-3 w-3" strokeWidth={1.75} />
      )}
      {isPublic ? "Public" : "Private"}
    </span>
  );
}
