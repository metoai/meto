import { streamWithGemini } from "@/lib/gemini";
import { streamPlainEndIndex } from "@/lib/stream-prompt";

/** Stream only user-visible plain text (stops emitting at the JSON marker). */
export async function streamPlainTextToSse(
  prompt: string,
  emit: (data: Record<string, unknown>) => void,
  options?: { temperature?: number }
): Promise<string> {
  let full = "";
  let emittedLen = 0;

  for await (const chunk of streamWithGemini(prompt, options)) {
    full += chunk;
    const plainEnd = streamPlainEndIndex(full);
    const slice = full.slice(emittedLen, plainEnd);
    if (slice) {
      emit({ token: slice });
      emittedLen = plainEnd;
    }
  }

  return full;
}
