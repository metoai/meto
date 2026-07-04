import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateText } from "@/lib/llm";
import { mergeProfileSectionUpdates } from "@/lib/profile-sections";
import {
  buildCurrentSectionsMap,
  SECTION_KEYS,
} from "@/lib/meto-prompts";
import { METO_SCOPE_GUARD } from "@/lib/meto-prompts";

const TeachSchema = z.object({
  ai_question: z.string().min(1).max(500),
  ai_response: z.string().min(1).max(2000),
  what_was_wrong: z.string().min(1).max(500),
});

function buildTeachPrompt(
  currentSections: Record<string, string>,
  aiQuestion: string,
  aiResponse: string,
  whatWasWrong: string
): string {
  const sectionBlock = Object.entries(currentSections)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k}: ${v.trim()}`)
    .join("\n");

  const updateKeys = `{\n  ${SECTION_KEYS.map((k) => `"${k}": ""`).join(",\n  ")}\n}`;

  return `${METO_SCOPE_GUARD}

You are Meto's correction engine. A user got a bad AI response because their profile was missing or wrong information.

Current profile:
${sectionBlock}

What the user asked the AI:
"${aiQuestion}"

What the AI responded:
"${aiResponse}"

What was wrong with the response:
"${whatWasWrong}"

Your job:
1. Identify which profile section(s) caused the AI to respond incorrectly
2. Suggest specific updates to those sections that would prevent this in the future
3. Write the updated section content in first person

Return ONLY valid JSON:
{
  "diagnosis": "One sentence: which section was missing/wrong and why the AI got confused.",
  "updates": ${updateKeys}
}

Rules:
- Only include section keys that genuinely need updating
- Write updates that directly address the gap exposed by the bad response
- Be specific — not generic. If the AI didn't know the user's tech stack, update skills with that stack.
- Omit empty strings from updates`;
}

/**
 * POST /api/teach
 * Correction loop: user pastes a bad AI response, Meto diagnoses which
 * profile section caused it and auto-suggests a fix.
 */
export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = TeachSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { ai_question, ai_response, what_was_wrong } = parsed.data;

    const admin = createAdminClient();
    const { data: rows, error } = await admin
      .from("context_sections")
      .select("section_type, title, content")
      .eq("user_id", user.id);

    if (error) throw error;

    const currentSections = buildCurrentSectionsMap(rows ?? []);
    const prompt = buildTeachPrompt(
      currentSections,
      ai_question,
      ai_response,
      what_was_wrong
    );

    const raw = await generateText(prompt, { temperature: 0.2 });
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    const result = JSON.parse(cleaned) as {
      diagnosis?: string;
      updates?: Record<string, string>;
    };

    const updates = Object.fromEntries(
      Object.entries(result.updates ?? {}).filter(
        ([k, v]) =>
          (SECTION_KEYS as readonly string[]).includes(k) &&
          typeof v === "string" &&
          v.trim().length > 0
      )
    );

    // Apply updates if any were found
    let applied = false;
    if (Object.keys(updates).length > 0) {
      await mergeProfileSectionUpdates(admin, user.id, updates);
      applied = true;
    }

    return NextResponse.json({
      diagnosis: result.diagnosis ?? "Could not diagnose the issue.",
      updates,
      applied,
      sections_updated: Object.keys(updates),
    });
  } catch (error) {
    console.error("POST /api/teach error:", error);
    return NextResponse.json(
      { error: "Failed to process correction." },
      { status: 500 }
    );
  }
}
