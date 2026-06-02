export const PRICING_PLAN_KEY = "meto_pricing_plan";

export type PricingPlanChoice = "free" | "pro";

export function setPricingPlanChoice(plan: PricingPlanChoice) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PRICING_PLAN_KEY, plan);
}

export function getPricingPlanChoice(): PricingPlanChoice | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(PRICING_PLAN_KEY);
  return value === "free" || value === "pro" ? value : null;
}

export function clearPricingPlanChoice() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PRICING_PLAN_KEY);
}

export function parsePricingPlanChoice(
  value: string | null | undefined
): PricingPlanChoice | null {
  return value === "free" || value === "pro" ? value : null;
}
