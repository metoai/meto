import { NextResponse } from "next/server";
import { migrateSectionsToKnowledge } from "@/lib/knowledge/migrate-from-sections";
import { isKnowledgeFlagEnabled } from "@/lib/knowledge/feature-flags";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    if (!isKnowledgeFlagEnabled("layerEnabled")) {
      return NextResponse.json(
        { error: "Knowledge layer is disabled. Set KNOWLEDGE_LAYER_ENABLED=true." },
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

    const result = await migrateSectionsToKnowledge(supabase, user.id);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Knowledge migrate error:", error);
    return NextResponse.json(
      { error: "Failed to migrate sections to knowledge objects." },
      { status: 500 }
    );
  }
}
