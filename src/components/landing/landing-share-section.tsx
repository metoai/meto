"use client";

import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";
import { LandingSharePanel } from "@/components/landing/landing-share-panel";

export function LandingShareSection() {
  return (
    <LandingSection id="share">
      <LandingSectionIntro
        eyebrow="Share"
        title="Use your understanding everywhere."
        subtitle="One profile link — paste it into ChatGPT, Claude, agents, collaborators, or anywhere you work with AI."
        align="center"
        className="mb-10 sm:mb-12"
      />

      <div className="landing-stagger-item mx-auto max-w-2xl">
        <LandingSharePanel />
      </div>
    </LandingSection>
  );
}
