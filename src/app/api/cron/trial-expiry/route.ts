import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTrialExpiringEmail } from "@/lib/email";

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

  if (data && data.length > 0) {
    for (const row of data) {
      try {
        const { data: authUser } = await admin.auth.admin.getUserById(row.id);
        const email = authUser?.user?.email;
        if (email) {
          const name =
            (authUser?.user?.user_metadata?.full_name as string | undefined) ||
            email.split("@")[0];
          void sendTrialExpiringEmail({ to: email, name, daysLeft: 0 });
        }
      } catch (err) {
        console.error("Failed to notify user of trial expiry:", err);
      }
    }
  }

  return NextResponse.json({ expired: data?.length ?? 0 });
}
