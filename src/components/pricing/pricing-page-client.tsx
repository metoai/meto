"use client";

import Link from "next/link";
import { PricingPlanCard } from "@/components/pricing/pricing-plan-card";
import { PRICING_PLANS } from "@/components/pricing/pricing-plan-data";
import { usePricingPlanChoice } from "@/hooks/use-pricing-plan-choice";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
      <path
        d="M15 18l-6-6 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PricingPageClient() {
  const { loadingPlan, choosePlan } = usePricingPlanChoice();

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-[var(--card)] text-[var(--text)]">
      <header className="shrink-0 px-4 pt-5 sm:px-8">
        <Link
          href="/"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--text-secondary)] transition-[border-color,background,color] duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
          aria-label="Back to home"
        >
          <BackIcon />
        </Link>
      </header>

      <main className="flex min-h-0 flex-1 items-center justify-center px-4 pb-8 sm:px-8">
        <div className="landing-animate-in grid w-full max-w-[640px] gap-3 sm:grid-cols-2 sm:gap-4">
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
      </main>
    </div>
  );
}
