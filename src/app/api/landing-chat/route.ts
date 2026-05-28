import { NextResponse } from "next/server";
import {
  friendlyGeminiError,
  generateWithGemini,
  parseJsonFromGemini,
} from "@/lib/gemini";

type ChatMessage = { role: "user" | "assistant"; content: string };

type CollectedProfile = {
  about: string | null;
  work: string | null;
  projects: string | null;
  goals: string | null;
};

type LandingChatResult = {
  message: string;
  profile_ready: boolean;
  collected: CollectedProfile;
};

const LANDING_CHAT_SYSTEM_PROMPT = `You are Meto's onboarding assistant. Your job is to learn about this person naturally through conversation so you can build their AI context profile.

Rules:
- Be warm, curious, conversational — like a smart friend, not a form
- Ask ONE follow-up question at a time, never multiple
- Each question should dig deeper into what they just said
- After 3-4 exchanges you have enough — set profile_ready: true
- When profile_ready is true, keep your message conversational; do NOT ask them to save or sign up in the message text (the UI handles that)
- Never use corporate language
- Keep responses short — 1-2 sentences max
- Topics to naturally cover across the conversation: what they do, what they're building/working on, their work style, their goals
- After enough info is collected, set profile_ready: true in your response

Respond ONLY with valid JSON:
{
  "message": "your conversational response here",
  "profile_ready": false,
  "collected": {
    "about": "...",
    "work": "...",
    "projects": "...",
    "goals": "..."
  }
}

collected fields: fill in what you know so far in first person (as the user), null for anything not yet covered.`;

const EMPTY_COLLECTED: CollectedProfile = {
  about: null,
  work: null,
  projects: null,
  goals: null,
};

function normalizeCollected(raw: unknown): CollectedProfile {
  if (!raw || typeof raw !== "object") {
    return EMPTY_COLLECTED;
  }

  const data = raw as Record<string, unknown>;
  const pick = (key: keyof CollectedProfile) => {
    const value = data[key];
    return typeof value === "string" && value.trim() ? value.trim() : null;
  };

  return {
    about: pick("about"),
    work: pick("work"),
    projects: pick("projects"),
    goals: pick("goals"),
  };
}

function parseLandingChatResponse(text: string): LandingChatResult {
  const parsed = parseJsonFromGemini(text) as Record<string, unknown>;
  const message =
    typeof parsed.message === "string" && parsed.message.trim()
      ? parsed.message.trim()
      : "Tell me more — what are you currently working on?";

  return {
    message,
    profile_ready: Boolean(parsed.profile_ready),
    collected: normalizeCollected(parsed.collected),
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      messages?: ChatMessage[];
      sessionId?: string;
    };

    const messages = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 }
      );
    }

    const conversation = messages
      .map((message) =>
        message.role === "user"
          ? `User: ${message.content}`
          : `Meto: ${message.content}`
      )
      .join("\n");

    const text = await generateWithGemini(
      `${LANDING_CHAT_SYSTEM_PROMPT}\n\nConversation so far:\n${conversation}\n\nRespond with JSON only.`,
      { temperature: 0.7 }
    );

    try {
      return NextResponse.json(parseLandingChatResponse(text));
    } catch (parseError) {
      console.error("Landing chat parse error:", parseError);
      return NextResponse.json({
        message: "Tell me more — what are you currently working on?",
        profile_ready: false,
        collected: EMPTY_COLLECTED,
      });
    }
  } catch (error) {
    console.error("Landing chat error:", error);

    const fallbackMessage =
      error instanceof Error && !friendlyGeminiError(error).includes("saved")
        ? "Tell me more — what are you currently working on?"
        : "Tell me more — what are you currently working on?";

    return NextResponse.json({
      message: fallbackMessage,
      profile_ready: false,
      collected: EMPTY_COLLECTED,
    });
  }
}
