import type { BillingFeature } from "@/lib/entitlements";
import { isUpgradeRequiredResponse } from "@/lib/billing-errors";

export async function startProCheckout(): Promise<string> {
  const res = await fetch("/api/billing/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interval: "month" }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error ?? "Could not start checkout.");
  }

  if (!data.url) {
    throw new Error("Checkout URL missing.");
  }

  return data.url as string;
}

export function redirectToCheckout(url: string) {
  window.location.href = url;
}

export async function openProCheckout() {
  const url = await startProCheckout();
  redirectToCheckout(url);
}

export function parseUpgradeError(
  data: unknown
): BillingFeature | null {
  if (isUpgradeRequiredResponse(data)) {
    return data.feature;
  }
  return null;
}
