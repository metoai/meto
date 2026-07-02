import { NextResponse } from "next/server";
import { getSiteUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

type ProfileMcpRow = {
  id: string;
  username: string | null;
  mcp_access_token: string | null;
  mcp_last_used_at: string | null;
  updated_at: string;
};

function generateMcpAccessToken(): string {
  const random = crypto.randomUUID().replace(/-/g, "");
  return `meto_mcp_${random}`;
}

function buildEndpointUrl(username: string): string {
  return `${getSiteUrl()}/api/mcp/${username}`;
}

function buildCursorConfig(endpointUrl: string, token: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        meto: {
          transport: "streamable_http",
          url: endpointUrl,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    },
    null,
    2
  );
}

function buildClaudeDesktopConfig(endpointUrl: string, token: string): string {
  return JSON.stringify(
    {
      mcpServers: {
        meto: {
          command: "npx",
          args: [
            "-y",
            "mcp-remote",
            endpointUrl,
            "--header",
            `Authorization: Bearer ${token}`,
          ],
        },
      },
    },
    null,
    2
  );
}

function buildPayload(profile: ProfileMcpRow) {
  const username = profile.username?.trim().toLowerCase() ?? "";
  const token = profile.mcp_access_token?.trim() ?? "";
  const hasToken = Boolean(token);
  const endpointUrl = username ? buildEndpointUrl(username) : "";

  return {
    username,
    hasToken,
    token: hasToken ? token : null,
    endpointUrl: endpointUrl || null,
    cursorConfig:
      hasToken && endpointUrl ? buildCursorConfig(endpointUrl, token) : null,
    claudeDesktopConfig:
      hasToken && endpointUrl
        ? buildClaudeDesktopConfig(endpointUrl, token)
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

  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, mcp_access_token, mcp_last_used_at, updated_at")
    .eq("id", user.id)
    .single<ProfileMcpRow>();

  if (error) throw error;

  return { supabase, user, profile: data };
}

export async function GET() {
  try {
    const { user, profile } = await loadOwnProfile();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(buildPayload(profile));
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
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!profile.username?.trim()) {
      return NextResponse.json(
        { error: "Set a username before generating MCP access." },
        { status: 400 }
      );
    }

    const token = generateMcpAccessToken();
    const { data, error } = await supabase
      .from("profiles")
      .update({
        mcp_access_token: token,
        mcp_last_used_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("id, username, mcp_access_token, mcp_last_used_at, updated_at")
      .single<ProfileMcpRow>();

    if (error) throw error;

    return NextResponse.json(buildPayload(data));
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
    const { supabase, user } = await loadOwnProfile();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .update({
        mcp_access_token: null,
        mcp_last_used_at: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)
      .select("id, username, mcp_access_token, mcp_last_used_at, updated_at")
      .single<ProfileMcpRow>();

    if (error) throw error;

    return NextResponse.json(buildPayload(data));
  } catch (error) {
    console.error("DELETE mcp-access error:", error);
    return NextResponse.json(
      { error: "Failed to revoke MCP access token." },
      { status: 500 }
    );
  }
}
