import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

/** Optional cron: expire trials where trial_ends_at has passed. Also runs on each entitlements fetch. */
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const now = new Date().toISOString();

  const { data, error } = await admin
    .from("profiles")
    .update({ plan: "free", updated_at: now })
    .eq("plan", "trial")
    .lte("trial_ends_at", now)
    .is("polar_subscription_id", null)
    .select("id");

  if (error) {
    console.error("Trial expiry cron error:", error);
    return NextResponse.json({ error: "Cron failed." }, { status: 500 });
  }

  return NextResponse.json({ expired: data?.length ?? 0 });
}
