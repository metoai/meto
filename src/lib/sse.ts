export function sseResponse(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export function encodeSseEvent(data: Record<string, unknown>) {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export function createSseStream(
  producer: (emit: (data: Record<string, unknown>) => void) => Promise<void>
) {
  const encoder = new TextEncoder();

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(encodeSseEvent(data)));
      };

      try {
        await producer(emit);
        controller.enqueue(encoder.encode(encodeSseEvent({ done: true })));
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Stream failed.";
        controller.enqueue(encoder.encode(encodeSseEvent({ error: message })));
      } finally {
        controller.close();
      }
    },
  });
}
