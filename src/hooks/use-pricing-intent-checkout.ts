"use client";

import { useEffect } from "react";
import { openProCheckout } from "@/lib/billing-client";
import {
  clearPricingPlanChoice,
  getPricingPlanChoice,
} from "@/lib/pricing-intent";

/** After OAuth signup, fulfill a stored Pro plan choice with Polar checkout. */
export function usePricingIntentCheckout() {
  useEffect(() => {
    if (getPricingPlanChoice() !== "pro") return;

    void openProCheckout()
      .then(() => {
        clearPricingPlanChoice();
      })
      .catch(() => {
        /* keep intent so user can retry from dashboard */
      });
  }, []);
}
