"use client";

import { useEffect, useState } from "react";
import { GitCommit } from "lucide-react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { useInView } from "@/hooks/use-in-view";

const UPDATES = [
  "Codebase index refreshed",
  "Architectural rules extracted",
  "Context score +12",
] as const;

export function LandingKeepUpdatedPanel() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.35 });
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVisibleCount(UPDATES.length);
      return;
    }

    const timers = UPDATES.map((_, index) =>
      window.setTimeout(() => setVisibleCount(index + 1), 500 + index * 400)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [inView]);

  return (
    <div
      ref={ref}
      className="landing-panel"
    >
      <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-[var(--landing-panel-border)]">
        <div className="landing-panel-stage space-y-4 p-6 sm:p-7">
          <p className="landing-panel-label mb-2">Integration Event</p>

          <div className="flex gap-3">
            <div className="flex mt-1 h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--text)] text-[var(--bg)]">
              <GitCommit className="h-3 w-3" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-[var(--text)]">feat: switch to turbopack</p>
              <p className="mt-0.5 text-[12px] text-[var(--muted)]">GitHub repo • 2m ago</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3 border-t border-[var(--landing-panel-border)] pt-4">
            <MetoMarkBadge size="sm" />
            <div className="min-w-0">
              <p className="mb-1 text-[11px] font-medium text-[var(--text)]">Meto Background Sync</p>
              <p className="text-[13px] leading-[1.6] text-[var(--text-secondary)]">
                Tech stack updated automatically. New build system preferences recorded.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--landing-panel-border)] p-6 sm:p-7 lg:border-t-0">
          <p className="landing-panel-label mb-5">What changed</p>

          <ul className="relative space-y-0">
            <div
              className="absolute bottom-2 left-[5px] top-2 w-px bg-[var(--border)]"
              aria-hidden
            />
            {UPDATES.map((label, index) => {
              const visible = index < visibleCount;

              return (
                <li
                  key={label}
                  className="relative flex items-center gap-3 py-2.5 transition-[opacity,transform] duration-500"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateX(0)" : "translateX(-6px)",
                  }}
                >
                  <span
                    className={`relative z-10 h-2.5 w-2.5 shrink-0 rounded-full border-2 transition-colors duration-500 ${
                      visible
                        ? "border-[var(--primary)] bg-[var(--primary)]"
                        : "border-[var(--border)] bg-[var(--landing-panel-base)]"
                    }`}
                  />
                  <span
                    className={`text-[13px] transition-colors duration-500 ${
                      visible ? "text-[var(--text)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ul>

          <p className="mt-5 text-[12px] text-[var(--muted)]">
            Powered by direct MCP and Git integrations.
          </p>
        </div>
      </div>
    </div>
  );
}
