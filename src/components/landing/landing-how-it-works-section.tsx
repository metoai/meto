"use client";

import { LandingHowItWorksDemo } from "@/components/landing/landing-how-it-works-demo";
import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";

export function LandingHowItWorksSection() {
  return (
    <LandingSection id="how-it-works">
      <LandingSectionIntro
        eyebrow="The Meto Infrastructure"
        title="One persistent identity. Infinite integrations."
        subtitle="Connect your favorite AI assistants and coding tools to a single, portable source of truth."
        align="center"
        className="mb-14 sm:mb-16"
      />

      <div className="landing-stagger-item lg:mx-auto lg:max-w-[96%]">
        <LandingHowItWorksDemo />
      </div>
    </LandingSection>
  );
}
