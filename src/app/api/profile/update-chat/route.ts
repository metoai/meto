import { NextResponse } from "next/server";
import { compileLocally } from "@/lib/compile-local";
import {
  friendlyGeminiError,
  generateWithGemini,
} from "@/lib/gemini";
import {
  buildUpdateContextPrompt,
  sectionsToMap,
} from "@/lib/meto-prompts";
import { mergeProfileSectionUpdates } from "@/lib/profile-sections";
import { createClient } from "@/lib/supabase/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

type UpdateChatResult = {
  reply: string;
  done: boolean;
  updates: Record<string, string>;
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

    if (body.apply && body.updates) {
      await mergeProfileSectionUpdates(supabase, user.id, body.updates);

      const { data: sections } = await supabase
        .from("context_sections")
        .select("section_type, title, content")
        .eq("user_id", user.id)
        .order("display_order", { ascending: true });

      if (sections?.length) {
        const compiled = compileLocally("universal", sections);
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

    const { data: sections, error: sectionsError } = await supabase
      .from("context_sections")
      .select("section_type, content")
      .eq("user_id", user.id);

    if (sectionsError) throw sectionsError;

    const currentSections = sectionsToMap(sections ?? []);
    const conversation = messages
      .map((m) => `${m.role === "user" ? "User" : "Meto"}: ${m.content}`)
      .join("\n");

    const raw = await generateWithGemini(
      buildUpdateContextPrompt(currentSections, conversation),
      { temperature: 0.5 }
    );

    const result = parseUpdateChatResponse(raw);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update chat error:", error);
    return NextResponse.json(
      { error: friendlyGeminiError(error) },
      { status: 500 }
    );
  }
}
