import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateMcpToken } from "@/lib/mcp-auth";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in first." }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const code = String(body.code ?? "").trim().toUpperCase();

    if (!code) {
      return NextResponse.json({ error: "Missing authorization code." }, { status: 400 });
    }

    const admin = createAdminClient();

    // Verify session code is valid and pending
    const { data: session, error: sessionError } = await admin
      .from("cli_auth_sessions")
      .select("id, status, expires_at")
      .eq("device_code", code)
      .maybeSingle();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Invalid device session." }, { status: 404 });
    }

    if (session.status !== "pending") {
      return NextResponse.json({ error: `Session is already ${session.status}.` }, { status: 400 });
    }

    if (new Date(session.expires_at).getTime() < Date.now()) {
      await admin.from("cli_auth_sessions").update({ status: "expired" }).eq("id", session.id);
      return NextResponse.json({ error: "Session has expired. Please run `npx meto login` again." }, { status: 400 });
    }

    // Get user profile
    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("id, username, mcp_access_token")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    let token = profile.mcp_access_token;
    if (!token) {
      const { rawToken, tokenHash } = generateMcpToken();
      token = rawToken;
      await admin
        .from("profiles")
        .update({
          mcp_access_token: rawToken,
          mcp_access_token_hash: tokenHash,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);
    }

    // Approve the session
    const { error: updateError } = await admin
      .from("cli_auth_sessions")
      .update({
        user_id: user.id,
        token,
        username: profile.username || "developer",
        status: "approved",
      })
      .eq("id", session.id);

    if (updateError) {
      console.error("Failed to approve CLI session:", updateError);
      return NextResponse.json({ error: "Failed to authorize session." }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      username: profile.username || "developer",
      message: "Terminal authorized successfully.",
    });
  } catch (err) {
    console.error("CLI approve error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
