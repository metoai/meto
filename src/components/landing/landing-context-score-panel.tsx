"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";

const TARGET_SCORE = 72;

const GAPS = [
  { label: "Projects", level: 28 },
  { label: "Goals", level: 15 },
  { label: "Working style", level: 22 },
] as const;

export function LandingContextScorePanel() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.4 });
  const [score, setScore] = useState(0);
  const [barsReady, setBarsReady] = useState(false);

  useEffect(() => {
    if (!inView) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setScore(TARGET_SCORE);
      setBarsReady(true);
      return;
    }

    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      setScore(Math.round(TARGET_SCORE * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setBarsReady(true);
      }
    };

    requestAnimationFrame(tick);
  }, [inView]);

  return (
    <div
      ref={ref}
      className="landing-panel"
    >
      <div className="flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-stretch lg:gap-0 lg:p-0">
        <div className="flex flex-col justify-between landing-panel-stage lg:w-[38%] lg:border-r lg:border-[var(--landing-panel-border)] lg:p-8">
          <p className="landing-panel-label">Context score</p>

          <div className="my-6 lg:my-8">
            <p className="font-mono-brand text-[4.5rem] font-semibold tabular-nums leading-none tracking-tight text-[var(--text)] sm:text-[5.5rem]">
              {score}
            </p>
            <p className="mt-2 text-[14px] text-[var(--text-secondary)]">
              out of 100
            </p>
          </div>

          <div className="h-1 overflow-hidden rounded-full bg-[var(--surface)]">
            <div
              className="h-full rounded-full bg-[var(--primary)] transition-[width] duration-700 ease-out"
              style={{ width: barsReady ? `${TARGET_SCORE}%` : `${score}%` }}
            />
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-between lg:p-8">
          <div>
            <p className="landing-panel-label mb-5">Thin sections</p>
            <ul className="space-y-4">
              {GAPS.map((gap) => (
                <li key={gap.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[13px] font-medium text-[var(--text)]">
                      {gap.label}
                    </span>
                    <span className="font-mono-brand text-[12px] tabular-nums text-[var(--muted)]">
                      {barsReady ? gap.level : 0}%
                    </span>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-[var(--surface)]">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]/35 transition-[width] duration-700 ease-out"
                      style={{ width: barsReady ? `${gap.level}%` : "0%" }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-8 flex items-center gap-1.5 text-[13px] font-medium text-[var(--primary)] lg:mt-10">
            Fix with AI
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.75} />
          </p>
        </div>
      </div>
    </div>
  );
}
