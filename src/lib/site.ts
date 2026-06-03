export const SITE_DOMAIN = "metoai.site";

/** Production host — Vercel redirects apex → www; all public links should use www. */
export const CANONICAL_SITE_HOST = "www.metoai.site";

function normalizeSiteOrigin(origin: string): string {
  try {
    const url = new URL(origin);
    if (
      process.env.NODE_ENV === "production" &&
      url.hostname === SITE_DOMAIN &&
      !url.hostname.startsWith("www.")
    ) {
      url.hostname = CANONICAL_SITE_HOST;
    }
    return url.origin;
  } catch {
    return origin;
  }
}

/** Canonical origin — set NEXT_PUBLIC_SITE_URL (prefer https://www.metoai.site in production). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return normalizeSiteOrigin(fromEnv);

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return process.env.NODE_ENV === "production"
    ? `https://${CANONICAL_SITE_HOST}`
    : "http://localhost:3000";
}

export function getPublicProfilePath(username: string) {
  return `/profile/${username.trim().toLowerCase()}`;
}

export function getPublicProfileUrl(username: string) {
  return `${getSiteUrl()}${getPublicProfilePath(username)}`;
}

/** Plain-text context (legacy path). */
export function getPublicContextUrl(username: string) {
  return `${getSiteUrl()}${getPublicProfilePath(username)}/context`;
}

/** Plain-text API — most reliable for ChatGPT / Claude web fetch. */
export function getPublicContextApiUrl(username: string) {
  return `${getSiteUrl()}/api/public/profile/${username.trim().toLowerCase()}/context`;
}

export function getAiProfileJsonUrl(username: string) {
  return `${getSiteUrl()}/.well-known/ai-profile/${username.trim().toLowerCase()}.json`;
}

/** Display label shown in UI, e.g. metoai.site/profile/jane */
export function publicProfileLabel(username: string) {
  return `${SITE_DOMAIN}/profile/${username.trim().toLowerCase()}`;
}
