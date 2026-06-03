/** Splits streamed model output: plain text for the user, then optional JSON payload. */
export const STREAM_JSON_MARKER = "---JSON---";

export function appendStreamFormat(instructions: string) {
  return `${instructions}

STREAMING OUTPUT FORMAT (required):
1. Write your user-facing reply as plain text first (no JSON, no markdown code fences).
2. Then on its own line write exactly: ${STREAM_JSON_MARKER}
3. Then one line of minified JSON with any structured fields required above.`;
}

/** Safe end index while streaming — holds back partial `---JSON---` marker suffixes. */
export function streamPlainEndIndex(full: string): number {
  const markerIndex = full.indexOf(STREAM_JSON_MARKER);
  const end = markerIndex === -1 ? full.length : markerIndex;
  const plain = full.slice(0, end);
  for (let len = STREAM_JSON_MARKER.length - 1; len >= 1; len--) {
    if (plain.endsWith(STREAM_JSON_MARKER.slice(0, len))) {
      return end - len;
    }
  }
  return end;
}

/** User-visible text from an in-progress streamed buffer. */
export function streamPlainTextForDisplay(full: string): string {
  return full.slice(0, streamPlainEndIndex(full));
}

export function splitStreamOutput(full: string) {
  const markerIndex = full.indexOf(STREAM_JSON_MARKER);
  if (markerIndex === -1) {
    return { plain: streamPlainTextForDisplay(full).trim(), jsonRaw: null as string | null };
  }
  return {
    plain: full.slice(0, markerIndex).trim(),
    jsonRaw: full.slice(markerIndex + STREAM_JSON_MARKER.length).trim(),
  };
}
