const MAX_CHAT_MESSAGES = 50;
const MAX_MESSAGE_LENGTH = 8000;
const MAX_BODY_BYTES = 200_000;

export type ChatMessage = { role: "user" | "assistant"; content: string };

export function parseJsonBody<T>(raw: string): T | null {
  if (raw.length > MAX_BODY_BYTES) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function validateChatMessages(
  messages: unknown
): { ok: true; messages: ChatMessage[] } | { ok: false; error: string } {
  if (!Array.isArray(messages) || messages.length === 0) {
    return { ok: false, error: "Messages are required." };
  }

  if (messages.length > MAX_CHAT_MESSAGES) {
    return { ok: false, error: "Too many messages." };
  }

  const parsed: ChatMessage[] = [];

  for (const message of messages) {
    if (
      typeof message !== "object" ||
      message === null ||
      !("role" in message) ||
      !("content" in message)
    ) {
      return { ok: false, error: "Invalid message." };
    }

    const { role, content } = message as { role: unknown; content: unknown };

    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string" ||
      content.length > MAX_MESSAGE_LENGTH
    ) {
      return { ok: false, error: "Invalid message." };
    }

    parsed.push({ role, content });
  }

  return { ok: true, messages: parsed };
}
