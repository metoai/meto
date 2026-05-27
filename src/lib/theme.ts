export const THEME_STORAGE_KEY = "meto-theme";

export type ThemePreference = "system" | "light" | "dark";

export function applyTheme(preference: ThemePreference) {
  const root = document.documentElement;
  if (preference === "system") {
    root.removeAttribute("data-theme");
    localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    root.setAttribute("data-theme", preference);
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  }
}

export function loadThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "system";
}

export function cycleThemePreference(
  current: ThemePreference
): ThemePreference {
  if (current === "system") return "light";
  if (current === "light") return "dark";
  return "system";
}
