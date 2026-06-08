/** Universal paste block — works across ChatGPT, Gemini, Claude, DeepSeek, Grok, Kimi, Qwen, and more. */
export function buildProfileShareClipboard(contextUrl: string): string {
  return [
    "Fetch this URL and read the full response. Use it as context about me.",
    "Do not rely on web search, snippets, or memory alone.",
    contextUrl,
  ].join("\n");
}
