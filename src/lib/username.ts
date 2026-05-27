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

export function getPublicProfileUrl(username: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/profile/${username}`;
  }
  return `/profile/${username}`;
}
