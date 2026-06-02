import { NextResponse } from "next/server";
import {
  generateWithGemini,
  parseJsonFromGemini,
} from "@/lib/gemini";
import {
  EMPTY_COLLECTED,
  LANDING_OPENING,
  mergeCollected,
  type CollectedProfile,
  type LandingChatMessage,
} from "@/lib/landing-chat";
import { METO_SCOPE_GUARD } from "@/lib/meto-prompts";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

type ChatMessage = LandingChatMessage;

const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 2000;
const MAX_BODY_BYTES = 100_000;
const RATE_LIMIT = 30;
const RATE_WINDOW_MS = 60 * 60 * 1000;

type LandingChatResult = {
  message: string;
  profile_ready: boolean;
  collected: CollectedProfile;
};

const LANDING_CHAT_SYSTEM_PROMPT = `${METO_SCOPE_GUARD}

You are Meto's onboarding assistant on the landing page. Learn about this person through conversation so we can save their AI context profile.

Rules:
- Be warm, curious, conversational — like a smart friend, not a form
- Ask ONE follow-up question at a time, never multiple
- Each reply MUST acknowledge what they just said in a few words, then ask your next question
- Build on their last message — never repeat a question they already answered
- If they go off-topic (coding help, general questions): do NOT help. Redirect with one profile question
- Keep responses short — 1–2 sentences max
- Topics to cover: who they are, what they do, what they're building, their goals
- After 3–4 user messages with enough detail, set profile_ready: true
- When profile_ready is true: wrap up warmly in one sentence; do NOT ask them to sign up (UI handles that)

Profile fields to fill in "collected" (first person, as the user):
- about: identity beyond job title — name, background, lens if mentioned
- work: role, company, what they do day to day
- projects: what they're building or shipping
- goals: what they're working toward

Respond ONLY with valid JSON:
{
  "message": "your conversational response here",
  "profile_ready": false,
  "collected": {
    "about": "... or null",
    "work": "... or null",
    "projects": "... or null",
    "goals": "... or null"
  }
}

Always merge new facts into collected — never drop fields you already know. Use null only for topics not yet covered.`;

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

function countFilled(collected: CollectedProfile) {
  return Object.values(collected).filter((v) => v?.trim()).length;
}

function countUserTurns(messages: ChatMessage[]) {
  return messages.filter((m) => m.role === "user").length;
}

function formatCollectedBlock(collected: CollectedProfile) {
  const lines = (
    ["about", "work", "projects", "goals"] as const
  ).map((key) => `${key}: ${collected[key]?.trim() || "(not yet)"}`);
  return lines.join("\n");
}

function buildConversation(messages: ChatMessage[]) {
  const lines: string[] = [`Meto: ${LANDING_OPENING}`];
  for (const message of messages) {
    lines.push(
      message.role === "user"
        ? `User: ${message.content}`
        : `Meto: ${message.content}`
    );
  }
  return lines.join("\n");
}

function shouldMarkReady(
  userTurns: number,
  collected: CollectedProfile,
  modelReady: boolean
) {
  if (modelReady) return true;
  const filled = countFilled(collected);
  if (userTurns >= 4 && filled >= 2) return true;
  if (userTurns >= 3 && filled >= 3) return true;
  return false;
}

function parseLandingChatResponse(
  text: string,
  priorCollected: CollectedProfile,
  userTurns: number
): LandingChatResult {
  const parsed = parseJsonFromGemini(text) as Record<string, unknown>;
  const message =
    typeof parsed.message === "string" && parsed.message.trim()
      ? parsed.message.trim()
      : "Tell me more — what are you currently working on?";

  const collected = mergeCollected(
    priorCollected,
    normalizeCollected(parsed.collected)
  );
  const profile_ready = shouldMarkReady(
    userTurns,
    collected,
    Boolean(parsed.profile_ready)
  );

  return { message, profile_ready, collected };
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`landing-chat:${ip}`, RATE_LIMIT, RATE_WINDOW_MS);
    if (!rate.ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfterSec) },
        }
      );
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Request too large." }, { status: 413 });
    }

    let body: {
      messages?: ChatMessage[];
      sessionId?: string;
      collected?: CollectedProfile;
    };

    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const messages = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 }
      );
    }

    if (messages.length > MAX_MESSAGES) {
      return NextResponse.json({ error: "Too many messages." }, { status: 400 });
    }

    for (const message of messages) {
      if (
        (message.role !== "user" && message.role !== "assistant") ||
        typeof message.content !== "string" ||
        message.content.length > MAX_MESSAGE_LENGTH
      ) {
        return NextResponse.json({ error: "Invalid message." }, { status: 400 });
      }
    }

    const priorCollected = normalizeCollected(body.collected ?? EMPTY_COLLECTED);
    const userTurns = countUserTurns(messages);
    const conversation = buildConversation(messages);

    const text = await generateWithGemini(
      `${LANDING_CHAT_SYSTEM_PROMPT}

Profile collected so far:
${formatCollectedBlock(priorCollected)}

User messages so far: ${userTurns}

Conversation:
${conversation}

Respond with JSON only.`,
      { temperature: 0.65 }
    );

    try {
      return NextResponse.json(
        parseLandingChatResponse(text, priorCollected, userTurns)
      );
    } catch (parseError) {
      console.error("Landing chat parse error:", parseError);
      return NextResponse.json({
        message: "Tell me more — what are you currently working on?",
        profile_ready: shouldMarkReady(userTurns, priorCollected, false),
        collected: priorCollected,
      });
    }
  } catch (error) {
    console.error("Landing chat error:", error);

    return NextResponse.json({
      message: "Tell me more — what are you currently working on?",
      profile_ready: false,
      collected: EMPTY_COLLECTED,
    });
  }
}
