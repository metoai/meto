import { NextResponse } from "next/server";
import { compileLocally } from "@/lib/compile-local";
import {
  friendlyGeminiError,
  generateWithGemini,
} from "@/lib/gemini";
import {
  buildCurrentSectionsMap,
  buildRippleSectionReviewPrompt,
  buildUpdateApplyReviewPrompt,
  buildUpdateContextPrompt,
  getMissingRippleSections,
} from "@/lib/meto-prompts";
import { mergeProfileSectionUpdates } from "@/lib/profile-sections";
import { createClient } from "@/lib/supabase/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

type UpdateChatResult = {
  reply: string;
  done: boolean;
  updates: Record<string, string>;
};

type SectionRow = {
  section_type: string;
  title: string;
  content: string;
};

function normalizeUpdates(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== "object") return {};
  const updates: Record<string, string> = {};
  for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof value === "string" && value.trim()) {
      updates[key] = value.trim();
    }
  }
  return updates;
}

function parseUpdateChatResponse(text: string): UpdateChatResult {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned) as {
    reply?: string;
    done?: boolean;
    updates?: unknown;
  };

  return {
    reply: parsed.reply?.trim() || "Got it.",
    done: Boolean(parsed.done),
    updates: normalizeUpdates(parsed.updates),
  };
}

async function reviewRippleSections(
  currentSections: Record<string, string>,
  updates: Record<string, string>,
  conversation: string
): Promise<Record<string, string>> {
  const missing = getMissingRippleSections(updates);
  if (missing.length === 0) return updates;

  const rippleRaw = await generateWithGemini(
    buildRippleSectionReviewPrompt(
      currentSections,
      updates,
      conversation,
      missing
    ),
    { temperature: 0.3 }
  );
  const ripple = parseUpdateChatResponse(rippleRaw);

  return { ...updates, ...ripple.updates };
}

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as {
      messages?: ChatMessage[];
      apply?: boolean;
      updates?: Record<string, string>;
    };

    const { data: allSections, error: allSectionsError } = await supabase
      .from("context_sections")
      .select("section_type, title, content")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });

    if (allSectionsError) throw allSectionsError;

    const sectionRows = (allSections ?? []) as SectionRow[];
    const currentSections = buildCurrentSectionsMap(sectionRows);
    const customSections = sectionRows
      .filter((row) => row.section_type === "custom")
      .map((row) => ({
        title: row.title ?? "Custom section",
        content: row.content ?? "",
      }));

    if (body.apply && body.updates) {
      const messages = body.messages ?? [];
      const conversation = messages
        .map((m) => `${m.role === "user" ? "User" : "Meto"}: ${m.content}`)
        .join("\n");

      const reviewRaw = await generateWithGemini(
        buildUpdateApplyReviewPrompt(
          currentSections,
          body.updates,
          conversation,
          customSections
        ),
        { temperature: 0.3 }
      );
      const reviewed = parseUpdateChatResponse(reviewRaw);
      let finalUpdates =
        Object.keys(reviewed.updates).length > 0
          ? reviewed.updates
          : body.updates;

      finalUpdates = await reviewRippleSections(
        currentSections,
        finalUpdates,
        conversation
      );

      await mergeProfileSectionUpdates(supabase, user.id, finalUpdates);

      const { data: updatedSections } = await supabase
        .from("context_sections")
        .select("section_type, title, content")
        .eq("user_id", user.id)
        .order("display_order", { ascending: true });

      if (updatedSections?.length) {
        const compiled = compileLocally("universal", updatedSections);
        await supabase.from("compiled_profiles").upsert(
          {
            user_id: user.id,
            full_context: compiled,
            format: "universal",
            last_compiled: new Date().toISOString(),
          },
          { onConflict: "user_id,format" }
        );
      }

      return NextResponse.json({ success: true });
    }

    const messages = body.messages ?? [];
    if (!messages.length) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 }
      );
    }

    const conversation = messages
      .map((m) => `${m.role === "user" ? "User" : "Meto"}: ${m.content}`)
      .join("\n");

    const raw = await generateWithGemini(
      buildUpdateContextPrompt(
        currentSections,
        conversation,
        customSections
      ),
      { temperature: 0.5 }
    );

    const result = parseUpdateChatResponse(raw);

    if (result.done && Object.keys(result.updates).length > 0) {
      result.updates = await reviewRippleSections(
        currentSections,
        result.updates,
        conversation
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update chat error:", error);
    return NextResponse.json(
      { error: friendlyGeminiError(error) },
      { status: 500 }
    );
  }
}
