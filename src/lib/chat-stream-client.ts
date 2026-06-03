export type SseHandlers = {
  onToken?: (token: string, full: string) => void;
  onEvent?: (event: Record<string, unknown>) => void;
  onError?: (message: string) => void;
};

export function isEventStreamResponse(res: Response) {
  return (res.headers.get("content-type") ?? "").includes("text/event-stream");
}

/** Payload events carry chat data; the stream ends with a bare `{ done: true }`. */
export function isSsePayloadEvent(event: Record<string, unknown>) {
  if (typeof event.error === "string" || typeof event.token === "string") {
    return false;
  }
  return (
    "message" in event ||
    "reply" in event ||
    "collected" in event ||
    "updates" in event ||
    "profile_ready" in event ||
    ("done" in event && Object.keys(event).length > 1)
  );
}

/** Read SSE events from a fetch Response body. */
export async function consumeSseStream(
  res: Response,
  handlers: SseHandlers
): Promise<Record<string, unknown> | null> {
  if (!res.body) {
    throw new Error("Empty stream response.");
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let lastPayload: Record<string, unknown> | null = null;
  let fullText = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";

    for (const part of parts) {
      const line = part.trim();
      if (!line.startsWith("data:")) continue;
      const payload = line.slice(5).trim();
      if (!payload) continue;

      const event = JSON.parse(payload) as Record<string, unknown>;

      if (typeof event.error === "string") {
        handlers.onError?.(event.error);
        throw new Error(event.error);
      }

      if (typeof event.token === "string") {
        fullText += event.token;
        handlers.onToken?.(event.token, fullText);
      }

      if (isSsePayloadEvent(event)) {
        lastPayload = event;
      }

      handlers.onEvent?.(event);
    }
  }

  return lastPayload;
}

export async function postChatStream(
  url: string,
  body: Record<string, unknown>,
  handlers: SseHandlers
) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, stream: true }),
  });

  if (!isEventStreamResponse(res)) {
    const data = (await res.json()) as Record<string, unknown>;
    if (!res.ok) {
      const err = new Error(
        typeof data.error === "string" ? data.error : "request_failed"
      );
      Object.assign(err, { data, status: res.status });
      throw err;
    }
    handlers.onEvent?.(data);
    return { stream: false as const, data, res };
  }

  if (!res.ok) {
    throw new Error("Stream request failed.");
  }

  const last = await consumeSseStream(res, handlers);
  return { stream: true as const, data: last, res };
}
