export const SITE_DOMAIN = "metoai.site";

/** Canonical origin — set NEXT_PUBLIC_SITE_URL in env (e.g. https://metoai.site). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (typeof window !== "undefined" && window.location?.origin) {
    return window.location.origin;
  }

  return process.env.NODE_ENV === "production"
    ? `https://${SITE_DOMAIN}`
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
