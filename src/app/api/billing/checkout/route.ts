import { NextResponse } from "next/server";
import { catchApiError } from "@/lib/api-error";
import { syncBillingState, setPlanFromPolar } from "@/lib/billing-profile";
import { getPolar, getPolarProProductId, getSiteOrigin } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";

function checkoutErrorDetails(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes("POLAR_ACCESS_TOKEN")) {
    return "POLAR_ACCESS_TOKEN is missing or invalid for this environment.";
  }
  if (message.includes("POLAR_PRO_PRODUCT_ID")) {
    return "POLAR_PRO_PRODUCT_ID is missing for this environment.";
  }
  if (message.includes("401")) {
    return "Polar authentication failed. Check token/server (sandbox vs production).";
  }
  if (message.includes("404")) {
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
