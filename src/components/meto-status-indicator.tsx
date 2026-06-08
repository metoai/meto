"use client";

import { useProgressiveStatus } from "@/hooks/use-progressive-status";

type MetoStatusIndicatorProps = {
  labels: string[];
  intervalMs?: number;
  className?: string;
  size?: "sm" | "md";
};

export function MetoStatusIndicator({
  labels,
  intervalMs = 2400,
  className = "",
  size = "md",
}: MetoStatusIndicatorProps) {
  const label = useProgressiveStatus(labels, intervalMs);

  if (!label) return null;

  const textClass =
    size === "sm"
      ? "text-xs text-[var(--primary)]"
      : "text-sm text-[var(--muted)]";

  return (
    <p
      className={`meto-status-indicator ${textClass} ${className}`.trim()}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <span key={label} className="meto-status-label">
        {label}
      </span>
      <span className="meto-status-ellipsis" aria-hidden="true" />
    </p>
  );
}
