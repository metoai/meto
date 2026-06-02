import { NextResponse } from "next/server";
import type { BillingFeature } from "@/lib/entitlements";

export function upgradeRequiredResponse(feature: BillingFeature) {
  return NextResponse.json(
    {
      error: "Upgrade to Meto Pro to use this feature.",
      code: "UPGRADE_REQUIRED",
      feature,
    },
    { status: 402 }
  );
}

export function isUpgradeRequiredResponse(
  data: unknown
): data is { code: "UPGRADE_REQUIRED"; feature: BillingFeature; error?: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { code?: string }).code === "UPGRADE_REQUIRED"
  );
}

export function billingErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === "object" && data !== null && "error" in data) {
    const message = (data as { error?: unknown }).error;
    if (typeof message === "string" && message.trim()) return message;
  }
  return fallback;
}

export function isAiLimitResponse(
  data: unknown
): data is { code: "AI_LIMIT_REACHED"; error: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as { code?: string }).code === "AI_LIMIT_REACHED"
  );
}
