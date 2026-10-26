const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;

export function validateUsername(username: string): string | null {
  const normalized = username.trim().toLowerCase();

  if (!USERNAME_REGEX.test(normalized)) {
    return "Username must be 3–20 characters, lowercase letters, numbers, or underscores only.";
  }

  const reserved = ["admin", "api", "auth", "dashboard", "settings", "onboarding"];
  if (reserved.includes(normalized)) {
    return "That username is reserved.";
  }

  return null;
}

export function normalizeUsername(username: string) {
  return username.trim().toLowerCase();
}

export function generateDefaultUsername(
  fullNameOrEmail: string,
  isTaken?: (candidate: string) => boolean,
): string {
  const raw = fullNameOrEmail.trim();
  const firstWord = raw.split(/\s+/)[0] || raw.split("@")[0] || "user";
  let base = firstWord.toLowerCase().replace(/[^a-z0-9_]/g, "");

  if (!base) {
    base = raw.split("@")[0]?.toLowerCase().replace(/[^a-z0-9_]/g, "") || "user";
  }

  if (base.length < 3) {
    base = base.padEnd(3, "0");
  }

  if (base.length > 16) {
    base = base.slice(0, 16);
  }

  const reserved = ["admin", "api", "auth", "dashboard", "settings", "onboarding"];
  let candidate = base;
  let suffix = 0;

  while (
    reserved.includes(candidate) ||
    (isTaken && isTaken(candidate))
  ) {
    suffix += 1;
    candidate = `${base.slice(0, 20 - String(suffix).length)}${suffix}`;
  }

  return candidate;
}

export {
  getPublicContextApiUrl,
  getPublicContextUrl,
  getPublicProfileUrl,
  publicProfileLabel,
} from "@/lib/site";
