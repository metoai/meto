import { NextResponse } from "next/server";
import { isKnowledgeFlagEnabled } from "@/lib/knowledge/feature-flags";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

    const [memoriesResult, linksResult] = await Promise.all([
      supabase
        .from("knowledge_objects")
        .select("id, type, title, status, importance, updated_at")
        .eq("user_id", user.id)
        .eq("status", "active"),
      supabase
        .from("knowledge_links")
        .select("id, from_memory_id, to_memory_id, relation_type, strength")
        .eq("user_id", user.id),
    ]);

    if (memoriesResult.error) throw memoriesResult.error;
    if (linksResult.error) throw linksResult.error;

    return NextResponse.json({
      nodes: memoriesResult.data ?? [],
      edges: linksResult.data ?? [],
      stats: {
        memoryCount: memoriesResult.data?.length ?? 0,
        linkCount: linksResult.data?.length ?? 0,
      },
    });
  } catch (error) {
    console.error("Knowledge graph error:", error);
    return NextResponse.json(
      { error: "Failed to load knowledge graph." },
      { status: 500 }
    );
  }
}
