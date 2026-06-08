"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { openProCheckout } from "@/lib/billing-client";
import {
  clearPricingPlanChoice,
  setPricingPlanChoice,
  type PricingPlanChoice,
} from "@/lib/pricing-intent";
import { createClient } from "@/lib/supabase/client";

export function usePricingPlanChoice() {
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

  return { loadingPlan, choosePlan };
}
