"use client";

import { LandingProblemFeed } from "@/components/landing/landing-problem-feed";
import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";

export function LandingProblemSection() {
  return (
    <LandingSection id="problem">
      <LandingSectionIntro
        eyebrow="The problem"
        title="Every new AI starts from zero."
        align="left"
        className="mb-12 sm:mb-14"
      />

      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 xl:gap-20">
        <LandingProblemFeed />

        <div className="landing-stagger-item lg:pl-4" style={{ animationDelay: "0.12s" }}>
          <div className="landing-panel border-l-2 border-l-[var(--primary)] p-6 sm:p-7">
            <p className="landing-panel-label">What breaks</p>

            <h3 className="mt-5 text-balance text-[1.375rem] font-semibold leading-[1.15] tracking-[-0.025em] text-[var(--text)] sm:text-2xl">
              Your context doesn&apos;t travel with you.
            </h3>
            <p className="mt-3 text-[14px] leading-[1.65] text-[var(--text-secondary)] sm:text-[15px]">
              Every chat starts blank. You rewrite the same bio, restate how you work,
              and give slightly different answers each time — because nothing carries
              over between tools or sessions.
            </p>
          </div>
        </div>
      </div>
    </LandingSection>
  );
}
