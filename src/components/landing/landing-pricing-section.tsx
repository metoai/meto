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
        eyebrow="Pricing"
        title="Start free. Upgrade when you need AI."
        subtitle="Every account gets a trial. Pick Free to edit manually, or Pro for AI-powered updates and gap fixes."
        align="center"
        className="mb-10 sm:mb-12"
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
