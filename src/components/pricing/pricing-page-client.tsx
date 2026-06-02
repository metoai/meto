"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { openProCheckout } from "@/lib/billing-client";
import { PRO_AI_CALL_LIMIT, TRIAL_DAYS } from "@/lib/ai-usage-limits";
import {
  clearPricingPlanChoice,
  setPricingPlanChoice,
  type PricingPlanChoice,
} from "@/lib/pricing-intent";
import { createClient } from "@/lib/supabase/client";

const FREE_FEATURES = [
  "Manual profile editing",
  "Context score & gaps",
  "Workspace copy",
  "Public profile",
];

const PRO_FEATURES = [
  "AI gap fixes & updates",
  "LLM compile for every AI",
  "Brain dump onboarding",
  `${PRO_AI_CALL_LIMIT} AI actions / month`,
];

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

function CheckIcon({ primary = false }: { primary?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${primary ? "text-[var(--primary)]" : "text-[var(--muted)]"}`}
      aria-hidden
    >
      <path
        d="M3.5 8.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanCard({
  name,
  price,
  period,
  tagline,
  features,
  featured,
  loading,
  onChoose,
}: {
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  featured?: boolean;
  loading: boolean;
  onChoose: () => void;
}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={onChoose}
      className={`group flex h-full w-full flex-col rounded-2xl border p-5 text-left transition-[border-color,box-shadow,transform] duration-150 disabled:opacity-60 sm:p-6 ${
        featured
          ? "border-[var(--primary)] bg-white shadow-[0_0_0_1px_rgba(15,110,86,0.08)] hover:shadow-[0_8px_30px_rgba(15,110,86,0.08)]"
          : "border-[var(--border)] bg-white hover:border-[var(--border-hover)] hover:bg-[var(--surface)]"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p
            className={`text-[11px] font-medium uppercase tracking-[0.07em] ${
              featured ? "text-[var(--primary)]" : "text-[var(--muted)]"
            }`}
          >
            {name}
          </p>
          <div className="mt-1.5 flex items-baseline gap-1">
            <span className="text-[32px] font-semibold leading-none tracking-[-0.5px] text-[var(--text)] sm:text-[36px]">
              {price}
            </span>
            <span className="text-sm text-[var(--text-secondary)]">{period}</span>
          </div>
        </div>
        {featured ? (
          <span className="rounded-full bg-[var(--primary-light)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.05em] text-[var(--primary)]">
            Pro
          </span>
        ) : null}
      </div>

      <p className="mb-4 text-sm leading-snug text-[var(--text-secondary)]">
        {tagline}
      </p>

      <ul className="mb-5 flex-1 space-y-2">
        {features.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2 text-[13px] leading-snug text-[var(--text)]"
          >
            <CheckIcon primary={featured} />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <span
        className={`flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium transition-[background] duration-150 ${
          featured
            ? "bg-[var(--primary)] text-white group-hover:bg-[var(--primary-hover)]"
            : "border border-[var(--border)] text-[var(--text)] group-hover:border-[var(--border-hover)] group-hover:bg-[var(--surface)]"
        }`}
      >
        {loading ? "Continuing…" : "Choose plan"}
      </span>
    </button>
  );
}

export function PricingPageClient() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<PricingPlanChoice | null>(null);

  async function choosePlan(plan: PricingPlanChoice) {
    setLoadingPlan(plan);
    setPricingPlanChoice(plan);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      if (plan === "pro") {
        try {
          await openProCheckout();
        } catch {
          setLoadingPlan(null);
        }
        return;
      }
      clearPricingPlanChoice();
      router.push("/dashboard");
      router.refresh();
      return;
    }

    router.push(`/auth/signup?plan=${plan}`);
  }

  return (
    <div className="flex h-[100dvh] flex-col overflow-hidden bg-white text-[var(--text)]">
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
          <PlanCard
            name="Free"
            price="$0"
            period="forever"
            tagline="Edit manually after your trial. No AI actions."
            features={FREE_FEATURES}
            loading={loadingPlan === "free"}
            onChoose={() => void choosePlan("free")}
          />
          <PlanCard
            name="Pro"
            price="$10"
            period="/ mo"
            tagline={`${TRIAL_DAYS}-day trial first, then subscribe when you're ready.`}
            features={PRO_FEATURES}
            featured
            loading={loadingPlan === "pro"}
            onChoose={() => void choosePlan("pro")}
          />
        </div>
      </main>
    </div>
  );
}
