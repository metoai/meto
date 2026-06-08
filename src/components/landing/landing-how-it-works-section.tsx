"use client";

import { LandingHowItWorksDemo } from "@/components/landing/landing-how-it-works-demo";
import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";

export function LandingHowItWorksSection() {
  return (
    <LandingSection id="how-it-works">
      <LandingSectionIntro
        eyebrow="How it works"
        title="Chat. Build. Share."
        subtitle="Three steps to a portable understanding of who you are."
        align="center"
        className="mb-10 sm:mb-12"
      />

      <div className="landing-stagger-item lg:mx-auto lg:max-w-[96%]">
        <LandingHowItWorksDemo />
      </div>
    </LandingSection>
  );
}
