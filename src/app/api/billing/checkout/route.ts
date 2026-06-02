import { NextResponse } from "next/server";
import { syncBillingState, setPlanFromPolar } from "@/lib/billing-profile";
import { getPolar, getPolarProProductId, getSiteOrigin } from "@/lib/polar";
import { createClient } from "@/lib/supabase/server";

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

    const billing = await syncBillingState(user.id);

    const checkout = await polar.checkouts.create({
      products: [productId],
      externalCustomerId: user.id,
      customerEmail: user.email ?? undefined,
      metadata: {
        meto_user_id: user.id,
      },
      successUrl: `${origin}/dashboard?upgraded=1`,
      returnUrl: `${origin}/pricing?canceled=1`,
      allowDiscountCodes: true,
    });

    if (checkout.customerId) {
      await setPlanFromPolar(user.id, {
        plan: billing.plan,
        polarCustomerId: checkout.customerId,
      });
    }

    if (!checkout.url) {
      return NextResponse.json(
        { error: "Failed to start checkout." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: checkout.url });
  } catch (error) {
    console.error("Polar checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to start checkout.",
      },
      { status: 500 }
    );
  }
}
