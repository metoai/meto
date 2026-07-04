import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeContentScore } from "@/lib/context-score";
import { headlineForScore } from "@/lib/section-quality";

const STALE_DAYS = 30;

type PulseSection = {
  section_type: string;
  content: string;
  updated_at: string | null;
};

function buildWeeklyPulseEmail(
  name: string,
  score: number,
  prevScore: number | null,
  staleSections: string[],
  topGap: string | null
): string {
  const scoreDelta =
    prevScore !== null ? score - prevScore : null;
  const deltaStr =
    scoreDelta !== null
      ? scoreDelta > 0
        ? `↑ +${scoreDelta} pts`
        : scoreDelta < 0
          ? `↓ ${scoreDelta} pts`
          : "no change"
      : null;

  const { headline } = headlineForScore(score, topGap ? 1 : 0);

  const staleBlock =
    staleSections.length > 0
      ? `<li>⏰ <strong>Stale sections</strong>: ${staleSections.join(", ")} haven't been updated in ${STALE_DAYS}+ days.</li>`
      : "";

  const gapBlock = topGap
    ? `<li>🔍 <strong>Top gap</strong>: ${topGap}</li>`
    : "";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 40px 20px; }
    .card { background: #fff; border-radius: 12px; max-width: 520px; margin: 0 auto; padding: 32px; border: 1px solid #e5e5e5; }
    .score { font-size: 48px; font-weight: 700; color: #FF4D00; line-height: 1; }
    .delta { font-size: 14px; color: #737373; margin-top: 4px; }
    h2 { color: #0A0A0A; font-size: 18px; margin: 24px 0 8px; }
    ul { color: #525252; padding-left: 20px; line-height: 1.8; }
    .cta { display: inline-block; margin-top: 24px; background: #FF4D00; color: #fff; text-decoration: none; border-radius: 8px; padding: 12px 24px; font-weight: 600; }
    .footer { margin-top: 32px; font-size: 12px; color: #a3a3a3; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <p style="color:#737373;font-size:13px;margin:0 0 16px">Your weekly Meto profile pulse</p>
    <div class="score">${score}</div>
    ${deltaStr ? `<div class="delta">${deltaStr} from last week</div>` : ""}
    <h2>${headline}</h2>
    <p style="color:#525252;margin-top:0">Hey ${name}, here's what Meto noticed this week:</p>
    <ul>
      ${staleBlock}
      ${gapBlock}
      ${staleSections.length === 0 && !topGap ? "<li>✅ Your profile looks fresh and complete. Keep it up!</li>" : ""}
    </ul>
    <a href="https://www.metoai.site/dashboard" class="cta">Open Dashboard →</a>
    <div class="footer">
      Meto · <a href="https://www.metoai.site/settings" style="color:#a3a3a3">Unsubscribe</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * GET /api/cron/weekly-pulse
 * Sends weekly profile health digest to all opted-in users.
 * Secured by CRON_SECRET or Vercel cron authorization.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured. Add it to send emails." },
      { status: 503 }
    );
  }

  const admin = createAdminClient();

  // Load all users who want weekly emails (add pulse_emails_enabled column, default true)
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, display_name, username")
    .eq("pulse_emails_enabled", true)
    .not("username", "is", null)
    .limit(200); // Safety cap per cron run

  if (error) {
    console.error("weekly-pulse: failed to load profiles", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sent = 0;
  let skipped = 0;

  for (const profile of profiles ?? []) {
    try {
      // Get user email from auth
      const { data: authUser } = await admin.auth.admin.getUserById(profile.id);
      const email = authUser?.user?.email;
      if (!email) { skipped++; continue; }

      // Load sections for scoring
      const { data: sections } = await admin
        .from("context_sections")
        .select("section_type, title, content, updated_at")
        .eq("user_id", profile.id);

      if (!sections?.length) { skipped++; continue; }

      const score = computeContentScore(
        sections.map((s) => ({
          section_type: s.section_type,
          title: s.title ?? "",
          content: s.content ?? "",
          updated_at: s.updated_at,
        }))
      );

      // Find stale sections (not updated in STALE_DAYS)
      const staleThreshold = Date.now() - STALE_DAYS * 24 * 60 * 60 * 1000;
      const staleSections = (sections as PulseSection[])
        .filter(
          (s) =>
            s.content?.trim() &&
            s.updated_at &&
            new Date(s.updated_at).getTime() < staleThreshold
        )
        .map((s) => s.section_type.replace("_", " "));

      const name = profile.display_name ?? profile.username ?? "there";
      const html = buildWeeklyPulseEmail(name, score, null, staleSections, null);

      // Send via Resend
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "Meto <hello@metoai.site>",
          to: email,
          subject: `Your Meto profile score: ${score}/100`,
          html,
        }),
      });

      sent++;
    } catch (err) {
      console.error(`weekly-pulse: failed for user ${profile.id}`, err);
      skipped++;
    }
  }

  return NextResponse.json({ ok: true, sent, skipped });
}
