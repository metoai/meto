import { NextResponse } from "next/server";
import {
  EXTRACT_FROM_CHAT_PROMPT,
  friendlyGeminiError,
  generateWithGemini,
  parseJsonFromGemini,
} from "@/lib/gemini";
import { saveProfileSections } from "@/lib/profile-sections";
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

    const text = await generateWithGemini(
      `${EXTRACT_FROM_CHAT_PROMPT}\n\n${conversation}`,
      { temperature: 0.3 }
    );
    const sections = parseJsonFromGemini(text);

    await saveProfileSections(supabase, user.id, sections);

    await supabase.from("onboarding_chats").insert({
      user_id: user.id,
      messages,
      completed: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Finish chat error:", error);
    return NextResponse.json(
      { error: friendlyGeminiError(error) },
      { status: 500 }
    );
  }
}
