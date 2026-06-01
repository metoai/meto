import { NextResponse } from "next/server";
import {
  generateWithGemini,
  parseJsonFromGemini,
} from "@/lib/gemini";
import { METO_SCOPE_GUARD } from "@/lib/meto-prompts";

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

const LANDING_OPENING =
  "Hey — what do you do and what are you working on right now?";

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

function mergeCollected(
  prior: CollectedProfile,
  incoming: CollectedProfile
): CollectedProfile {
  return {
    about: incoming.about ?? prior.about,
    work: incoming.work ?? prior.work,
    projects: incoming.projects ?? prior.projects,
    goals: incoming.goals ?? prior.goals,
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
    const body = (await request.json()) as {
      messages?: ChatMessage[];
      sessionId?: string;
      collected?: CollectedProfile;
    };

    const messages = body.messages ?? [];

    if (!messages.length) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 }
      );
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
