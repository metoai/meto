import type { CompileFormat } from "@/lib/types";
import { getPublicProfileUrl, getSiteUrl } from "@/lib/site";

export type PlatformShareGuide = {
  url: string;
  prompt: string;
  hint: string;
  /** What gets copied when the user hits "Copy link". */
  clipboardText: string;
};

function withShareParams(
  contextShareUrl: string,
  params: Record<string, string>
): string {
  const url = new URL(contextShareUrl, getSiteUrl());
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

export function buildPlatformShareGuide(
  format: CompileFormat,
  username: string,
  contextShareUrl: string
): PlatformShareGuide {
  const profileUrl = getPublicProfileUrl(username);

  switch (format) {
    case "chatgpt": {
      const url = withShareParams(contextShareUrl, { format: "chatgpt" });
      const prompt = [
        "Open this URL with your browsing tool, read the full page, and use it as context about me.",
        "Do not guess from memory or training data.",
        url,
      ].join("\n");
      return {
        url,
        prompt,
        hint: "ChatGPT often skips /api/ links — paste the full prompt below, not just the URL.",
        clipboardText: prompt,
      };
    }
    case "gemini": {
      const prompt = [
        "Read everything at this URL and use it as context about me.",
        "Fetch the page — do not rely on search snippets alone.",
        profileUrl,
      ].join("\n");
      return {
        url: profileUrl,
        prompt,
        hint: "Gemini works best with the HTML profile page (indexed by Google), not API URLs.",
        clipboardText: prompt,
      };
    }
    default:
      return {
        url: contextShareUrl,
        prompt: `Use this as context about me:\n${contextShareUrl}`,
        hint: "Paste into Claude, DeepSeek, Grok, Kimi, or any AI that fetches links.",
        clipboardText: contextShareUrl,
      };
  }
}
