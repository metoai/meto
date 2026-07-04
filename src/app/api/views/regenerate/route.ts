import { NextResponse } from "next/server";
import { isKnowledgeFlagEnabled } from "@/lib/knowledge/feature-flags";
import { regenerateViews } from "@/lib/views/regenerate";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    if (!isKnowledgeFlagEnabled("layerEnabled")) {
      return NextResponse.json(
        { error: "Knowledge layer is disabled." },
        { status: 403 }
      );
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json().catch(() => ({}))) as {
      scope?: "sections" | "compile" | "mcp_handoff" | "all";
    };

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    const result = await regenerateViews(
      supabase,
      user.id,
      profile?.username ?? null,
      body.scope ?? "all"
    );

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Regenerate views error:", error);
    return NextResponse.json(
      { error: "Failed to regenerate views." },
      { status: 500 }
    );
  }
}
