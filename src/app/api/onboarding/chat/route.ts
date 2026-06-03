import { NextResponse } from "next/server";
import {
  CHAT_SYSTEM_PROMPT,
  friendlyGeminiError,
  generateWithGemini,
  streamWithGemini,
} from "@/lib/gemini";
import { assertAiAccess, recordAiUsage } from "@/lib/ai-usage";
import { parseJsonBody, validateChatMessages } from "@/lib/api-validation";
import { upgradeRequiredResponse } from "@/lib/billing-errors";
import { getEntitlements } from "@/lib/entitlements";
import { enforceRateLimit } from "@/lib/rate-limit";
import { createSseStream, sseResponse } from "@/lib/sse";
import { createClient } from "@/lib/supabase/server";

const RATE_LIMIT = 40;
const RATE_WINDOW_MS = 60 * 60 * 1000;

function buildConversation(messages: { role: string; content: string }[]) {
  return messages
    .map((m) => `${m.role === "user" ? "User" : "Meto"}: ${m.content}`)
    .join("\n");
}

function parseReply(full: string) {
  const done = full.includes("PROFILE_READY");
  const cleanReply = full.replace("PROFILE_READY", "").trim();
  return {
    reply: cleanReply || "I think I have enough! Let me build your profile.",
    done,
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

    const limited = await enforceRateLimit(
      request,
      "onboarding-chat",
      RATE_LIMIT,
      RATE_WINDOW_MS,
      user.id
    );
    if (limited) return limited;

    const rawBody = await request.text();
    const body = parseJsonBody<{ messages?: unknown; stream?: boolean }>(
      rawBody
    );
    if (!body) {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const validated = validateChatMessages(body.messages);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const aiAccess = await assertAiAccess(user.id, "onboarding_ai");
    if (!aiAccess.ok) return aiAccess.response;

    const entitlements = getEntitlements(aiAccess.row, aiAccess.usage);
    if (!entitlements.canRedoOnboardingAi) {
      return upgradeRequiredResponse("onboarding_ai");
    }

    const conversation = buildConversation(validated.messages);
    const prompt = `${CHAT_SYSTEM_PROMPT}\n\n${conversation}`;

    if (body.stream) {
      const stream = createSseStream(async (emit) => {
        let full = "";
        for await (const chunk of streamWithGemini(prompt, {
          temperature: 0.55,
        })) {
          full += chunk;
          emit({ token: chunk });
        }

        const { reply, done } = parseReply(full);
        await recordAiUsage(user.id, 1, aiAccess.row);
        emit({ reply, done, profile_ready: done });
      });

      return sseResponse(stream);
    }

    const reply = (await generateWithGemini(prompt, { temperature: 0.55 })).trim();
    const parsed = parseReply(reply);

    await recordAiUsage(user.id, 1, aiAccess.row);

    return NextResponse.json({
      reply: parsed.reply,
      done: parsed.done,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: friendlyGeminiError(error) },
      { status: 500 }
    );
  }
}
