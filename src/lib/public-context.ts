import { buildContextText, resolveSelectedSectionTypes } from "@/lib/context-templates";
import type { CompileFormat } from "@/lib/types";
import {
  fetchPublicProfileByUsername,
  toAiProfileDocument,
  type PublicProfile,
} from "@/lib/public-profile";
import { getPublicContextUrl, getSiteUrl } from "@/lib/site";

const VALID_FORMATS: CompileFormat[] = [
  "universal",
  "claude",
  "chatgpt",
  "gemini",
];

export const PUBLIC_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export const PUBLIC_FETCH_HEADERS = {
  "Content-Type": "text/plain; charset=utf-8",
  "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
  ...PUBLIC_CORS_HEADERS,
  "X-Robots-Tag": "all",
  "X-Meto-Profile-Format": "text",
} as const;

export type PublicContextSuccess = {
  text: string;
  profile: PublicProfile;
  format: CompileFormat;
};

export function requestWantsJson(
  request: Request,
  searchParams: URLSearchParams
): boolean {
  if (searchParams.get("format") === "json") return true;
  const accept = request.headers.get("accept")?.toLowerCase() ?? "";
  return accept.includes("application/json");
}

function acceptQuality(accept: string, mime: string): number {
  const escaped = mime.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = accept.match(new RegExp(`${escaped}(?:;q=([0-9.]+))?`));
  if (!match) return -1;
  return match[1] ? Number.parseFloat(match[1]) : 1;
}

/** True when the client is a browser-style fetcher that should get an HTML page. */
export function requestWantsHtml(
  request: Request,
  searchParams: URLSearchParams
): boolean {
  if (searchParams.get("format") === "json") return false;
  if (searchParams.get("view") === "html") return true;

  const ua = request.headers.get("user-agent")?.toLowerCase() ?? "";
  if (
    ua.includes("chatgpt-user") ||
    ua.includes("gptbot") ||
    ua.includes("googlebot") ||
    ua.includes("google-extended") ||
    ua.includes("gemini")
  ) {
    return true;
  }

  const accept = request.headers.get("accept")?.toLowerCase() ?? "";
  if (!accept.includes("text/html")) return false;

  const htmlQ = acceptQuality(accept, "text/html");
  const plainQ = acceptQuality(accept, "text/plain");
  return htmlQ >= plainQ;
}

export async function buildPublicContextBody(
  username: string,
  searchParams: URLSearchParams
): Promise<PublicContextSuccess | { error: string; status: number }> {
  const normalized = username.toLowerCase();
  const formatParam = searchParams.get("format") ?? "universal";
  const format = VALID_FORMATS.includes(formatParam as CompileFormat)
    ? (formatParam as CompileFormat)
    : "universal";

  const publicProfile = await fetchPublicProfileByUsername(normalized);

  if (!publicProfile) {
    return { error: "Profile not found.", status: 404 };
  }

  if (!publicProfile.hasPublicContent) {
    return { error: "This profile has no public sections.", status: 404 };
  }

  const availableTypes = publicProfile.sections.map((s) => s.section_type);
  const sectionsParam = searchParams.get("sections");
  const requestedSections = sectionsParam
    ? sectionsParam.split(",").map((s) => s.trim())
    : null;

  const selectedTypes = resolveSelectedSectionTypes(availableTypes, {
    sections: requestedSections,
    preset: searchParams.get("preset"),
  });

  const text = buildContextText(
    publicProfile.sections,
    selectedTypes,
    format,
    publicProfile.username,
    publicProfile.name
  );

  if (!text) {
    return {
      error: "No matching public sections for this request.",
      status: 404,
    };
  }

  return { text, profile: publicProfile, format };
}

export type PublicContextJsonPayload = {
  username: string;
  name: string;
  format: CompileFormat;
  /** Full plain-text block for pasting into AI tools. */
  context: string;
  summary: string;
  expertise: string[];
  profileUrl: string;
  contextUrl: string;
  legacyContextUrl: string;
  jsonUrl: string;
};

export function publicContextJsonResponse(
  payload: PublicContextJsonPayload,
  extraHeaders?: Record<string, string>
) {
  const apiUrl = `${getSiteUrl()}/api/public/profile/${payload.username}/context`;

  return Response.json(payload, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=86400",
      ...PUBLIC_CORS_HEADERS,
      "X-Robots-Tag": "all",
      "X-Meto-Profile-Format": "json",
      Link: `<${payload.legacyContextUrl}>; rel="canonical", <${apiUrl}>; rel="alternate"; type="application/json"`,
      "X-Meto-Context-Url": apiUrl,
      ...extraHeaders,
    },
  });
}

export function buildPublicContextJsonPayload(
  username: string,
  result: PublicContextSuccess
): PublicContextJsonPayload {
  const doc = toAiProfileDocument(result.profile);
  return {
    username: doc.username,
    name: doc.name,
    format: result.format,
    context: result.text,
    summary: doc.summary,
    expertise: doc.expertise,
    profileUrl: doc.profileUrl,
    contextUrl: doc.contextUrl,
    legacyContextUrl: doc.legacyContextUrl,
    jsonUrl: doc.jsonUrl,
  };
}

export function publicContextResponse(
  username: string,
  text: string,
  extraHeaders?: Record<string, string>
) {
  const canonical = getPublicContextUrl(username);
  const apiUrl = `${getSiteUrl()}/api/public/profile/${username}/context`;

  return new Response(text, {
    status: 200,
    headers: {
      ...PUBLIC_FETCH_HEADERS,
      Link: `<${canonical}>; rel="canonical", <${apiUrl}>; rel="alternate"`,
      "X-Meto-Context-Url": apiUrl,
      ...extraHeaders,
    },
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function publicContextHtmlResponse(
  username: string,
  name: string,
  text: string,
  extraHeaders?: Record<string, string>
) {
  const profileUrl = `${getSiteUrl()}/profile/${username}`;
  const contextUrl = getPublicContextUrl(username);
  const description = text.trim().slice(0, 200);
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Context about ${escapeHtml(name)} — Meto</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${contextUrl}" />
</head>
<body>
  <h1>Context about ${escapeHtml(name)}</h1>
  <p>Machine-readable profile context from <a href="${profileUrl}">Meto</a>.</p>
  <pre>${escapeHtml(text)}</pre>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": PUBLIC_FETCH_HEADERS["Cache-Control"],
      ...PUBLIC_CORS_HEADERS,
      "X-Robots-Tag": "all",
      "X-Meto-Profile-Format": "html",
      Link: `<${contextUrl}>; rel="canonical"`,
      ...extraHeaders,
    },
  });
}
