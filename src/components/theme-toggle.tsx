"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";

type ThemeToggleProps = {
  /** Compact icon-only control for nav bars */
  compact?: boolean;
  className?: string;
};

const OPTIONS = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export function ThemeToggle({ compact = false, className = "" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={`${compact ? "h-8 w-8" : "h-9 w-[108px]"} rounded-lg bg-[var(--surface)] ${className}`}
        aria-hidden
      />
    );
  }

  const active = theme ?? "system";

  const toggleCompactTheme = () => {
    // Single click toggles directly between light and dark without invisible intermediate 'system' step
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  };

  if (compact) {
    const isDark = resolvedTheme === "dark";
    const Icon = isDark ? Moon : Sun;
    const nextLabel = isDark ? "Switch to light theme" : "Switch to dark theme";

    return (
      <button
        type="button"
        onClick={toggleCompactTheme}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-neutral-700 hover:text-neutral-950 hover:bg-black/[0.05] dark:text-neutral-200 dark:hover:text-white dark:hover:bg-white/[0.08] active:scale-[0.95] transition-all duration-150 ${className}`}
        aria-label={nextLabel}
        title={nextLabel}
      >
        <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>
    );
  }

  return (
    <div
      className={`inline-flex rounded-lg border border-[var(--border)] bg-[var(--surface)] p-0.5 ${className}`}
      role="group"
      aria-label="Appearance"
    >
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-md px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-150 ${
              isActive
                ? "bg-[var(--card)] text-[var(--text)] shadow-[var(--shadow-sm)]"
                : "text-[var(--muted)] hover:text-[var(--text-secondary)]"
            }`}
            aria-pressed={isActive}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
            {label}
          </button>
        );
      })}
    </div>
  );
}
