import { NextResponse } from "next/server";
import { catchApiError } from "@/lib/api-error";
import { syncBillingState, setPlanFromPolar } from "@/lib/billing-profile";
import { getPolar, getPolarProProductId, getSiteOrigin } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

function polarErrorBody(error: unknown): string {
  if (!error || typeof error !== "object") return "";
  const record = error as Record<string, unknown>;
  const body = record.body;
  if (typeof body === "string") return body;
  if (body && typeof body === "object") {
    try {
      return JSON.stringify(body);
    } catch {
      return "";
    }
  }
  return "";
}

function checkoutErrorDetails(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const body = polarErrorBody(error);
  const combined = `${message} ${body}`;

  if (
    combined.includes("POLAR_ACCESS_TOKEN") ||
    combined.includes("invalid_token")
  ) {
    return "Polar access token is invalid or expired. Create a new token at polar.sh → Organization → Settings → Access Tokens, then update POLAR_ACCESS_TOKEN in Vercel and .env.local.";
  }
  if (combined.includes("POLAR_PRO_PRODUCT_ID")) {
    return "POLAR_PRO_PRODUCT_ID is missing for this environment.";
  }
  if (combined.includes("401") || combined.includes("authentication")) {
    return "Polar authentication failed. Ensure POLAR_ACCESS_TOKEN matches POLAR_SERVER (sandbox token for sandbox, production token for production).";
  }
  if (combined.includes("404")) {
    return "Polar product was not found. Check POLAR_PRO_PRODUCT_ID and server mode.";
  }

  return message;
}

export async function POST() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const polar = getPolar();
    const productId = getPolarProProductId();
    const origin = getSiteOrigin();

    let currentPlan: "trial" | "free" | "pro" = "trial";
    try {
      const billing = await syncBillingState(user.id);
      currentPlan = billing.plan;
    } catch (syncError) {
      // Checkout should still proceed if profile billing sync is temporarily unavailable.
      console.warn("Billing sync failed before checkout:", syncError);
    }

    const checkout = await polar.checkouts.create({
      products: [productId],
      externalCustomerId: user.id,
      customerEmail: user.email ?? undefined,
      metadata: {
        meto_user_id: user.id,
      },
      successUrl: `${origin}/billing/success`,
      returnUrl: `${origin}/pricing?canceled=1`,
      allowDiscountCodes: true,
    });

    if (checkout.customerId) {
      try {
        await setPlanFromPolar(user.id, {
          plan: currentPlan,
          polarCustomerId: checkout.customerId,
        });
      } catch (setPlanError) {
        console.warn("Failed to persist Polar customer id:", setPlanError);
      }
    }

    if (!checkout.url) {
      return NextResponse.json(
        { error: "Failed to start checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    const detail = checkoutErrorDetails(error);
    console.error("Checkout route detailed error:", detail);
    if (process.env.NODE_ENV !== "production") {
      return NextResponse.json(
        { error: "Failed to start checkout.", detail },
        { status: 500 }
      );
    }
    return catchApiError(error, "Failed to start checkout.");
  }
}
