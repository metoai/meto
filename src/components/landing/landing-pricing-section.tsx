"use client";

import { PricingPlanCard } from "@/components/pricing/pricing-plan-card";
import { PRICING_PLANS } from "@/components/pricing/pricing-plan-data";
import { LandingSection, LandingSectionIntro } from "@/components/landing/landing-section";
import { usePricingPlanChoice } from "@/hooks/use-pricing-plan-choice";

export function LandingPricingSection() {
  const { loadingPlan, choosePlan } = usePricingPlanChoice();

  return (
    <LandingSection id="pricing">
      <LandingSectionIntro
        eyebrow="Infrastructure Pricing"
        title="Foundational access is free."
        subtitle="Build your core identity for free. Upgrade to Pro for automated context syncing, API access, and advanced memory retention."
        align="center"
        className="mb-14 sm:mb-16"
      />

      <div className="landing-stagger-item mx-auto grid max-w-[640px] gap-3 sm:grid-cols-2 sm:gap-4">
        <PricingPlanCard
          {...PRICING_PLANS.free}
          features={PRICING_PLANS.free.features}
          loading={loadingPlan === "free"}
          onChoose={() => void choosePlan("free")}
        />
        <PricingPlanCard
          {...PRICING_PLANS.pro}
          features={PRICING_PLANS.pro.features}
          featured
          loading={loadingPlan === "pro"}
          onChoose={() => void choosePlan("pro")}
        />
      </div>
    </LandingSection>
  );
}
