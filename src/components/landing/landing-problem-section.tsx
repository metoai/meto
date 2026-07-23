"use client";

import { LandingProblemFeed } from "@/components/landing/landing-problem-feed";
import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";

export function LandingProblemSection() {
  return (
    <LandingSection id="problem">
      <LandingSectionIntro
        eyebrow="The Fragmentation Problem"
        title="The AI ecosystem has amnesia."
        align="left"
        className="mb-14 sm:mb-16"
      />

      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 xl:gap-20">
        <LandingProblemFeed />

        <div className="landing-stagger-item lg:pl-4" style={{ animationDelay: "0.12s" }}>
          <div className="landing-panel border-l-2 border-l-[var(--primary)] p-6 sm:p-8">
            <p className="landing-panel-label text-xs uppercase tracking-wider text-[var(--muted)]">The consequence</p>

            <h3 className="mt-5 text-balance text-[1.25rem] font-medium leading-[1.2] tracking-[-0.02em] text-[var(--text)] sm:text-xl">
              Your workflow doesn't travel with you.
            </h3>
            <p className="mt-3 text-[15px] leading-[1.6] text-[var(--muted)] sm:text-[16px]">
              Right now, every AI tool you use operates in a silo. You are forced to re-explain your projects, your codebases, your brand guidelines, and your preferences to ChatGPT, Claude, and Cursor every single time. It breaks your flow and fragments your output.
            </p>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
