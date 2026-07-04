import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateText } from "@/lib/llm";
import { compileLocally } from "@/lib/compile-local";
import { METO_SCOPE_GUARD } from "@/lib/meto-prompts";

const SimulateSchema = z.object({
  question: z.string().min(1).max(500),
});

function buildSimulateWithContextPrompt(
  compiledContext: string,
  question: string
): string {
  return `${METO_SCOPE_GUARD}

You are an AI assistant. The user has provided their personal context below.
Read it carefully before answering their question.

USER CONTEXT:
---
${compiledContext}
---

Now answer this question from the user, using the context above to personalize your response:
"${question}"

Be specific and reference things from their context where relevant. Keep your answer concise (2-4 sentences).`;
}

function buildSimulateWithoutContextPrompt(question: string): string {
  return `You are an AI assistant talking to a new user for the first time. You know nothing about them.

Answer this question generically, as you would for any random person:
"${question}"

Keep your answer concise (2-4 sentences). You have no user context.`;
}

/**
 * POST /api/simulate
 * Simulates how an AI answers a question with vs without the user's profile context.
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
    const parsed = SimulateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { question } = parsed.data;

    // Load user's sections and compile context
    const admin = createAdminClient();
    const { data: sections, error } = await admin
      .from("context_sections")
      .select("section_type, title, content, display_order")
      .eq("user_id", user.id)
      .order("display_order", { ascending: true });

    if (error) throw error;

    if (!sections?.length) {
      return NextResponse.json(
        { error: "No profile sections found. Build your profile first." },
        { status: 400 }
      );
    }

    const compiledContext = compileLocally("universal", sections);

    // Run both LLM calls in parallel
    const [withContext, withoutContext] = await Promise.all([
      generateText(buildSimulateWithContextPrompt(compiledContext, question), {
        temperature: 0.4,
      }),
      generateText(buildSimulateWithoutContextPrompt(question), {
        temperature: 0.4,
      }),
    ]);

    return NextResponse.json({
      question,
      with_context: withContext.trim(),
      without_context: withoutContext.trim(),
      context_used: compiledContext,
    });
  } catch (error) {
    console.error("POST /api/simulate error:", error);
    return NextResponse.json(
      { error: "Simulation failed. Please try again." },
      { status: 500 }
    );
  }
}
