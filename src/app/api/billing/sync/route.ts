import { NextResponse } from "next/server";
import { catchApiError } from "@/lib/api-error";
import { getEntitlementsForUser } from "@/lib/billing-profile";
import { syncBillingFromPolarIfNeeded } from "@/lib/polar-sync";
import { createClient } from "@/lib/supabase/server";

/** After Polar checkout success — sync subscription when webhooks cannot reach localhost. */
export async function POST() {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const synced = await syncBillingFromPolarIfNeeded(user.id);
    const entitlements = await getEntitlementsForUser(user.id);

    return NextResponse.json({ synced, entitlements });
  } catch (error) {
    return catchApiError(error, "Failed to sync billing.");
  }
}
