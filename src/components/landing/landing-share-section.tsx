"use client";

import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";
import { LandingSharePanel } from "@/components/landing/landing-share-panel";

export function LandingShareSection() {
  return (
    <LandingSection id="integrations">
      <span id="share" className="absolute -top-20" aria-hidden="true" />
      <LandingSectionIntro
        eyebrow="Universal Model Context Protocol"
        title="Connect in 10 seconds. Native to your tools."
        subtitle="No manual copy-pasting. Meto runs as an open MCP server for Claude, Cursor, and modern AI agents — keeping your identity continuously in sync."
        align="center"
        className="mb-12 sm:mb-14"
      />

      <div className="landing-stagger-item mx-auto max-w-3xl">
        <LandingSharePanel />
      </div>
    </LandingSection>
  );
}
