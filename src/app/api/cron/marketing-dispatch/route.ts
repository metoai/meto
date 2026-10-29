import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendDeveloperMarketingEmail,
  sendGeneralAiMarketingEmail,
  syncContactToResend,
  UserCategory,
} from "@/lib/marketing";

export const maxDuration = 60;

/**
 * Automated Category-by-Category Marketing Email Dispatcher
 *
 * Can be triggered via CRON or Admin POST:
 * POST /api/cron/marketing-dispatch
 * Body: { category: "developers" | "general_ai", dryRun?: boolean, limit?: number }
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const category = (body.category as UserCategory) || "developers";
  const dryRun = Boolean(body.dryRun);
  const limit = Math.min(Number(body.limit) || 50, 100);

  const admin = createAdminClient();

  // Query users who have opted into emails
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, username, display_name")
    .eq("pulse_emails_enabled", true)
    .limit(limit);

  if (error || !profiles) {
    console.error("marketing-dispatch: profile query error", error);
    return NextResponse.json({ error: "Failed to fetch recipients" }, { status: 500 });
  }

  let dispatched = 0;
  let skipped = 0;
  const results: Array<{ email: string; success: boolean; id?: string }> = [];

  for (const profile of profiles) {
    try {
      const { data: authUser } = await admin.auth.admin.getUserById(profile.id);
      const email = authUser?.user?.email;

      if (!email) {
        skipped++;
        continue;
      }

      const name =
        profile.display_name ||
        (authUser?.user?.user_metadata?.full_name as string | undefined) ||
        profile.username ||
        email.split("@")[0];

      // Auto-sync contact into Resend segment
      void syncContactToResend({
        email,
        firstName: name,
        category,
      });

      if (dryRun) {
        dispatched++;
        results.push({ email, success: true, id: "dry-run" });
        continue;
      }

      let sendResult;
      if (category === "developers") {
        sendResult = await sendDeveloperMarketingEmail({ to: email, name });
      } else {
        sendResult = await sendGeneralAiMarketingEmail({ to: email, name });
      }

      if (sendResult.success) {
        dispatched++;
        results.push({ email, success: true, id: sendResult.id });
      } else {
        skipped++;
        results.push({ email, success: false });
      }
    } catch (err) {
      console.error(`marketing-dispatch: error for user ${profile.id}`, err);
      skipped++;
    }
  }

  return NextResponse.json({
    ok: true,
    category,
    dryRun,
    dispatched,
    skipped,
    results,
  });
}
