/** Universal paste block — works across ChatGPT, Gemini, Claude, DeepSeek, Grok, Kimi, Qwen, and more. */
export function buildProfileShareClipboard(profileUrl: string): string {
  return [
    "Read everything at this URL and use it as context about me.",
    "Fetch the page — do not rely on search snippets alone.",
    profileUrl,
  ].join("\n");
}
