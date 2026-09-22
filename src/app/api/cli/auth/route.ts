import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSiteUrl } from "@/lib/site";

function generateDeviceCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(crypto.randomInt(chars.length));
    part2 += chars.charAt(crypto.randomInt(chars.length));
  }
  return `METO-${part1}-${part2}`;
}

export async function POST() {
  try {
    const admin = createAdminClient();
    const deviceCode = generateDeviceCode();
    const siteUrl = getSiteUrl();

    const { error } = await admin.from("cli_auth_sessions").insert({
      device_code: deviceCode,
      status: "pending",
    });

    if (error) {
      console.error("Failed to create CLI auth session:", error);
      return NextResponse.json({ error: "Failed to initialize device auth session." }, { status: 500 });
    }

    return NextResponse.json({
      device_code: deviceCode,
      user_code: deviceCode,
      verification_uri: `${siteUrl}/cli-auth?code=${deviceCode}`,
      expires_in: 600,
      interval: 2,
    });
  } catch (err) {
    console.error("CLI Auth session init error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code")?.trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: "Missing device code parameter." }, { status: 400 });
    }

    const admin = createAdminClient();
    const { data: session, error } = await admin
      .from("cli_auth_sessions")
      .select("id, status, token, username, expires_at")
      .eq("device_code", code)
      .maybeSingle();

    if (error || !session) {
      return NextResponse.json({ error: "Invalid device session." }, { status: 404 });
    }

    const isExpired = new Date(session.expires_at).getTime() < Date.now();
    if (isExpired && session.status === "pending") {
      await admin
        .from("cli_auth_sessions")
        .update({ status: "expired" })
        .eq("id", session.id);
      return NextResponse.json({ status: "expired" });
    }

    if (session.status === "approved") {
      // Mark as consumed for one-time retrieval
      await admin
        .from("cli_auth_sessions")
        .update({ status: "consumed" })
        .eq("id", session.id);

      return NextResponse.json({
        status: "approved",
        token: session.token,
        username: session.username,
      });
    }

    return NextResponse.json({ status: session.status });
  } catch (err) {
    console.error("CLI Auth poll error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
