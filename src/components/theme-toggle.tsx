"use client";

import { useEffect, useState } from "react";
import {
  applyTheme,
  cycleThemePreference,
  loadThemePreference,
  type ThemePreference,
} from "@/lib/theme";

function ThemeToggleIcon({ preference }: { preference: ThemePreference }) {
  if (preference === "light") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (preference === "dark") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
        <path
          d="M21 14.5A7.5 7.5 0 1111.5 5a5.5 5.5 0 008.5 9.5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect
        x="3"
        y="4"
        width="18"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8 20h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("system");

  useEffect(() => {
    setPreference(loadThemePreference());
  }, []);

  function handleClick() {
    const next = cycleThemePreference(preference);
    setPreference(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition-colors hover:text-[var(--color-accent)]"
      aria-label={`Theme: ${preference}. Click to change.`}
      title={
        preference === "system"
          ? "Theme: System"
          : preference === "light"
            ? "Theme: Light"
            : "Theme: Dark"
      }
    >
      <ThemeToggleIcon preference={preference} />
    </button>
  );
}
