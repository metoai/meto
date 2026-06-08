"use client";

import { LandingContextScorePanel } from "@/components/landing/landing-context-score-panel";
import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";

export function LandingContextScoreSection() {
  return (
    <LandingSection id="context-score">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 xl:gap-20">
        <div className="landing-stagger-item order-2 lg:order-1">
          <LandingContextScorePanel />
        </div>

        <div
          className="order-1 landing-stagger-item lg:order-2 lg:pl-6"
          style={{ animationDelay: "0.1s" }}
        >
          <LandingSectionIntro
            eyebrow="Context Score"
            title="See how well AI understands you."
            subtitle="A single score for profile completeness — with clear meters on what still needs work. Fix gaps in a short AI chat."
            align="right"
          />
        </div>
      </div>
    </LandingSection>
  );
}
