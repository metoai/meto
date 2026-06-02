import { NextResponse } from "next/server";
import { compileLocally } from "@/lib/compile-local";
import {
  friendlyGeminiError,
  generateWithGemini,
} from "@/lib/gemini";
import {
  buildCurrentSectionsMap,
  buildGapFixAllUpdatePrompt,
  buildGapFixUpdatePrompt,
  GAP_FIX_INIT_USER_LINE,
  buildRippleSectionReviewPrompt,
  buildUpdateApplyReviewPrompt,
  buildUpdateContextPrompt,
  getMissingRippleSections,
} from "@/lib/meto-prompts";
import { assertAiAccess, recordAiUsage } from "@/lib/ai-usage";
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

function safeParseUpdateChatResponse(text: string): UpdateChatResult | null {
  try {
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
  } catch {
    return null;
  }
}

async function reviewRippleSections(
  currentSections: Record<string, string>,
  updates: Record<string, string>,
  conversation: string
): Promise<Record<string, string>> {
  const missing = getMissingRippleSections(updates);
  if (missing.length === 0) return updates;

  try {
    const rippleRaw = await generateWithGemini(
      buildRippleSectionReviewPrompt(
        currentSections,
        updates,
        conversation,
        missing
      ),
      { temperature: 0.3 }
    );
    const ripple = safeParseUpdateChatResponse(rippleRaw);
    if (ripple?.updates && Object.keys(ripple.updates).length > 0) {
      return { ...updates, ...ripple.updates };
    }
  } catch (error) {
    console.error("Ripple review failed:", error);
  }

  return updates;
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

    const aiAccess = await assertAiAccess(user.id, "quick_update");
    if (!aiAccess.ok) return aiAccess.response;

    const body = (await request.json()) as {
      messages?: ChatMessage[];
      apply?: boolean;
      updates?: Record<string, string>;
      gapFix?: {
        sectionType?: string;
        insight?: string;
        mode?: "single" | "all";
        allGaps?: { sectionType: string; insight: string; title?: string }[];
        focusIndex?: number;
      };
      gapFixInit?: boolean;
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
      const proposed = normalizeUpdates(body.updates);
      if (Object.keys(proposed).length === 0) {
        return NextResponse.json(
          { error: "No updates to save." },
          { status: 400 }
        );
      }

      const messages = body.messages ?? [];
      const conversation = messages
        .map((m) => `${m.role === "user" ? "User" : "Meto"}: ${m.content}`)
        .join("\n");

      let finalUpdates = proposed;

      try {
        const reviewRaw = await generateWithGemini(
          buildUpdateApplyReviewPrompt(
            currentSections,
            proposed,
            conversation,
            customSections
          ),
          { temperature: 0.3 }
        );
        const reviewed = safeParseUpdateChatResponse(reviewRaw);
        if (reviewed?.updates && Object.keys(reviewed.updates).length > 0) {
          finalUpdates = reviewed.updates;
        }
      } catch (error) {
        console.error("Apply review failed, saving proposed updates:", error);
      }

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

      await recordAiUsage(user.id);

      return NextResponse.json({
        success: true,
        savedSections: Object.keys(finalUpdates),
      });
    }

    const gapSectionType = body.gapFix?.sectionType?.trim();
    const gapInsight = body.gapFix?.insight?.trim() ?? "";
    const gapMode = body.gapFix?.mode ?? "single";
    const allGaps = body.gapFix?.allGaps ?? [];
    const focusIndex = body.gapFix?.focusIndex ?? 0;
    const useGapFixAll =
      gapMode === "all" && allGaps.length > 0 && gapSectionType;

    if (body.gapFixInit && gapSectionType) {
      const raw = await generateWithGemini(
        useGapFixAll
          ? buildGapFixAllUpdatePrompt(
              currentSections,
              GAP_FIX_INIT_USER_LINE,
              allGaps,
              focusIndex
            )
          : buildGapFixUpdatePrompt(
              currentSections,
              GAP_FIX_INIT_USER_LINE,
              gapSectionType,
              gapInsight,
              customSections
            ),
        { temperature: 0.25 }
      );

      const parsed =
        safeParseUpdateChatResponse(raw) ??
        ({
          reply: "What's the one thing AI should always get right about you?",
          done: false,
          updates: {},
        } satisfies UpdateChatResult);

      await recordAiUsage(user.id);

      return NextResponse.json(parsed);
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

    const useGapFixPrompt = Boolean(gapSectionType);

    const raw = await generateWithGemini(
      useGapFixAll
        ? buildGapFixAllUpdatePrompt(
            currentSections,
            conversation,
            allGaps,
            focusIndex
          )
        : useGapFixPrompt
          ? buildGapFixUpdatePrompt(
              currentSections,
              conversation,
              gapSectionType!,
              gapInsight,
              customSections
            )
          : buildUpdateContextPrompt(
              currentSections,
              conversation,
              customSections
            ),
      { temperature: useGapFixPrompt || useGapFixAll ? 0.25 : 0.5 }
    );

    const result =
      safeParseUpdateChatResponse(raw) ??
      ({
        reply: "Got it — tell me a bit more so I can update the right sections.",
        done: false,
        updates: {},
      } satisfies UpdateChatResult);

    if (result.done && Object.keys(result.updates).length > 0) {
      result.updates = await reviewRippleSections(
        currentSections,
        result.updates,
        conversation
      );
    }

    await recordAiUsage(user.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Update chat error:", error);
    return NextResponse.json(
      { error: friendlyGeminiError(error) },
      { status: 500 }
    );
  }
}
