import { NextResponse } from "next/server";
import { buildCurrentSectionsMap } from "@/lib/meto-prompts";
import {
  dualWriteSectionUpdates,
  extractMemoriesWithLlm,
  persistExtractedLinks,
  persistExtractedMemories,
  shadowExtractFromUpdates,
} from "@/lib/knowledge/extract";
import { isKnowledgeFlagEnabled } from "@/lib/knowledge/feature-flags";
import { createClient } from "@/lib/supabase/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
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

    const body = (await request.json()) as {
      messages?: ChatMessage[];
      updates?: Record<string, string>;
      useLlm?: boolean;
      persist?: boolean;
      source?: "quick_update" | "mcp" | "onboarding" | "landing";
    };

    const { data: sections, error: sectionsError } = await supabase
      .from("context_sections")
      .select("section_type, title, content")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });

    if (sectionsError) throw sectionsError;

    const currentSections = buildCurrentSectionsMap(sections ?? []);
    const source = body.source ?? "quick_update";

    let memories;
    let links: Awaited<ReturnType<typeof extractMemoriesWithLlm>>["links"] =
      [];

    if (body.useLlm && body.messages?.length) {
      const conversation = body.messages
        .map((m) => `${m.role === "user" ? "User" : "Meto"}: ${m.content}`)
        .join("\n");
      const extracted = await extractMemoriesWithLlm(
        currentSections,
        conversation
      );
      memories = extracted.memories;
      links = extracted.links;
    } else if (body.updates && Object.keys(body.updates).length > 0) {
      memories = shadowExtractFromUpdates(body.updates, source);
    } else if (body.messages?.length) {
      const conversation = body.messages
        .map((m) => `${m.role === "user" ? "User" : "Meto"}: ${m.content}`)
        .join("\n");
      const extracted = await extractMemoriesWithLlm(
        currentSections,
        conversation
      );
      memories = extracted.memories;
      links = extracted.links;
    } else {
      return NextResponse.json(
        { error: "Provide messages or updates to extract from." },
        { status: 400 }
      );
    }

    let persistedIds: string[] = [];

    if (body.persist && isKnowledgeFlagEnabled("writeEnabled")) {
      if (body.updates && Object.keys(body.updates).length > 0) {
        persistedIds = await dualWriteSectionUpdates(
          supabase,
          user.id,
          body.updates,
          source
        );
      } else {
        const inserted = await persistExtractedMemories(
          supabase,
          user.id,
          memories
        );
        const titleToId = new Map(
          inserted.map((row) => [row.title.toLowerCase(), row.id])
        );
        await persistExtractedLinks(supabase, user.id, links, titleToId);
        persistedIds = inserted.map((row) => row.id);
      }
    }

    return NextResponse.json({
      memories,
      links,
      persisted: body.persist && isKnowledgeFlagEnabled("writeEnabled"),
      persistedIds,
    });
  } catch (error) {
    console.error("Knowledge extract error:", error);
    return NextResponse.json(
      { error: "Failed to extract knowledge memories." },
      { status: 500 }
    );
  }
}
