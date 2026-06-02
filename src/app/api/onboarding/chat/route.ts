import { NextResponse } from "next/server";
import {
  CHAT_SYSTEM_PROMPT,
  friendlyGeminiError,
  generateWithGemini,
} from "@/lib/gemini";
import { assertAiAccess, recordAiUsage } from "@/lib/ai-usage";
import { upgradeRequiredResponse } from "@/lib/billing-errors";
import { getEntitlementsForUser } from "@/lib/billing-profile";
import { createClient } from "@/lib/supabase/server";

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entitlements = await getEntitlementsForUser(user.id);
    if (!entitlements.canRedoOnboardingAi) {
      return upgradeRequiredResponse("onboarding_ai");
    }

    const aiAccess = await assertAiAccess(user.id, "onboarding_ai");
    if (!aiAccess.ok) return aiAccess.response;

    const { messages } = (await request.json()) as { messages: ChatMessage[] };

    if (!messages?.length) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 }
      );
    }

    const conversation = messages
      .map((m) => `${m.role === "user" ? "User" : "Meto"}: ${m.content}`)
      .join("\n");

    const reply = (
      await generateWithGemini(`${CHAT_SYSTEM_PROMPT}\n\n${conversation}`, {
        temperature: 0.7,
      })
    ).trim();
    const done = reply.includes("PROFILE_READY");
    const cleanReply = reply.replace("PROFILE_READY", "").trim();

    await recordAiUsage(user.id);

    return NextResponse.json({
      reply: cleanReply || "I think I have enough! Let me build your profile.",
      done,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: friendlyGeminiError(error) },
      { status: 500 }
    );
  }
}
