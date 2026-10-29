import { NextResponse } from "next/server";
import {
  buildClaudeDesktopMcpJson,
  buildCursorInstallLinks,
  buildCursorMcpJson,
  buildMcpEndpointUrl,
} from "@/lib/mcp-install";
import { getSiteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";
import { generateMcpToken } from "@/lib/mcp-auth";
import { generateDefaultUsername } from "@/lib/username";
import { sendMcpTokenAlertEmail } from "@/lib/email";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProfileMcpRow = {
  id: string;
  username: string | null;
  mcp_access_token: string | null;
  mcp_access_token_hash?: string | null;
  mcp_last_used_at: string | null;
  updated_at: string;
};

function buildPayload(profile: ProfileMcpRow, freshToken?: string) {
  const username = profile.username?.trim().toLowerCase() ?? "";
  const token = freshToken ?? profile.mcp_access_token?.trim() ?? "";
  const hasToken = Boolean(token || profile.mcp_access_token_hash);
  const endpointUrl = username ? buildMcpEndpointUrl(getSiteUrl(), username) : "";
  const install =
    hasToken && endpointUrl
      ? buildCursorInstallLinks(endpointUrl, token)
      : null;

  return {
    username,
    hasToken,
    token: hasToken ? (token || null) : null,
    endpointUrl: endpointUrl || null,
    cursorConfig:
      hasToken && endpointUrl ? buildCursorMcpJson(endpointUrl, token) : null,
    cursorInstallUrl: install?.webInstall ?? null,
    cursorDeeplink: install?.deeplink ?? null,
    claudeDesktopConfig:
      hasToken && endpointUrl
        ? buildClaudeDesktopMcpJson(endpointUrl, token)
        : null,
    lastUsedAt: profile.mcp_last_used_at,
    updatedAt: profile.updated_at,
  };
}

async function loadOwnProfile() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null as null, profile: null as null };
  }

  let { data, error } = await supabase
    .from("profiles")
    .select("id, username, mcp_access_token, mcp_access_token_hash, mcp_last_used_at, updated_at")
    .eq("id", user.id)
    .single<ProfileMcpRow>();

  if (error) {
    const fallback = await supabase
      .from("profiles")
      .select("id, username, mcp_access_token, mcp_last_used_at, updated_at")
      .eq("id", user.id)
      .single<ProfileMcpRow>();
    if (fallback.error) throw fallback.error;
    data = fallback.data;
  }

  // Auto-generate and persist default username if not set yet
  if (data && !data.username?.trim()) {
    const rawName =
      (user.user_metadata?.full_name as string | undefined) ||
      (user.user_metadata?.name as string | undefined) ||
      user.email?.split("@")[0] ||
      "user";
    const defaultUsername = generateDefaultUsername(rawName);

    const { data: updated } = await supabase
      .from("profiles")
      .update({ username: defaultUsername, updated_at: new Date().toISOString() })
      .eq("id", user.id)
      .select("id, username, mcp_access_token, mcp_access_token_hash, mcp_last_used_at, updated_at")
      .single<ProfileMcpRow>();

    if (updated) {
      data = updated;
    }
  }

  return { supabase, user, profile: data };
}

export async function GET() {
  try {
    const { user, profile } = await loadOwnProfile();
    if (!user || !profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(buildPayload(profile), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      },
    });
  } catch (error) {
    console.error("GET mcp-access error:", error);
    return NextResponse.json(
      { error: "Failed to load MCP access settings." },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const { supabase, user, profile } = await loadOwnProfile();
    if (!user || !profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!profile.username?.trim()) {
      return NextResponse.json(
        { error: "Set a username before generating MCP access." },
        { status: 400 }
      );
    }

    const { rawToken, tokenHash } = generateMcpToken();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        mcp_access_token: rawToken,
        mcp_access_token_hash: tokenHash,
        mcp_last_used_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("id, username, mcp_access_token, mcp_access_token_hash, mcp_last_used_at, updated_at")
      .single<ProfileMcpRow>();

    if (error) throw error;

    if (user.email) {
      void sendMcpTokenAlertEmail({
        to: user.email,
        username: profile.username || "developer",
        action: profile.mcp_access_token ? "rotated" : "generated",
      });
    }

    return NextResponse.json(buildPayload(data, rawToken));
  } catch (error) {
    console.error("POST mcp-access error:", error);
    return NextResponse.json(
      { error: "Failed to generate MCP access token." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const { supabase, user, profile } = await loadOwnProfile();
    if (!user || !profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        mcp_access_token: null,
        mcp_access_token_hash: null,
        mcp_last_used_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("id, username, mcp_access_token, mcp_access_token_hash, mcp_last_used_at, updated_at")
      .single<ProfileMcpRow>();

    if (error) throw error;

    if (user.email) {
      void sendMcpTokenAlertEmail({
        to: user.email,
        username: profile.username || "developer",
        action: "revoked",
      });
    }

    return NextResponse.json(buildPayload(data));
  } catch (error) {
    console.error("DELETE mcp-access error:", error);
    return NextResponse.json(
      { error: "Failed to revoke MCP access token." },
      { status: 500 }
    );
  }
}
