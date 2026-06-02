/** Only allow same-origin relative paths (blocks open redirects). */
export function safeRedirectPath(next: string | null, fallback = "/dashboard"): string {
  if (!next) return fallback;

  const path = next.trim();
  if (!path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  if (path.includes("\\") || path.includes("\0")) {
    return fallback;
  }

  return path;
}
