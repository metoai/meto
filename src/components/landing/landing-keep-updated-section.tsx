"use client";

import { LandingKeepUpdatedPanel } from "@/components/landing/landing-keep-updated-panel";
import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";

export function LandingKeepUpdatedSection() {
  return (
    <LandingSection id="keep-updated">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 xl:gap-20">
        <LandingSectionIntro
          eyebrow="Always current"
          title="Your profile stays alive."
          subtitle="Most tools stop after setup. Tell Meto what changed — your profile and context score update automatically."
          align="left"
          className="landing-stagger-item lg:pr-6"
        />

        <div className="landing-stagger-item" style={{ animationDelay: "0.1s" }}>
          <LandingKeepUpdatedPanel />
        </div>
      </div>
    </LandingSection>
  );
}
