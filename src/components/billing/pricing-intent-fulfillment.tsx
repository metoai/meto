"use client";

import { usePricingIntentCheckout } from "@/hooks/use-pricing-intent-checkout";

/** Runs once on any authenticated page to finish Pro checkout after signup. */
export function PricingIntentFulfillment() {
  usePricingIntentCheckout();
  return null;
}
