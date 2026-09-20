"use client";

import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";
import { LandingSharePanel } from "@/components/landing/landing-share-panel";

export function LandingShareSection() {
  return (
    <LandingSection id="integrations">
      <span id="share" className="absolute -top-20" aria-hidden="true" />
      <LandingSectionIntro
        eyebrow="Universal Access"
        title="Deploy your context everywhere."
        subtitle="One secure profile. Sync automatically via MCP (for developers), or inject your context into Claude and ChatGPT with one click."
        align="center"
        className="mb-14 sm:mb-16"
      />

      <div className="landing-stagger-item mx-auto max-w-2xl">
        <LandingSharePanel />
      </div>
    </LandingSection>
  );
}
