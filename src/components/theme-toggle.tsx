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

  const cycleTheme = () => {
    const order = ["light", "dark", "system"] as const;
    const idx = order.indexOf(active as (typeof order)[number]);
    setTheme(order[(idx + 1) % order.length]);
  };

  if (compact) {
    const Icon = resolvedTheme === "dark" ? Moon : Sun;
    return (
      <button
        type="button"
        onClick={cycleTheme}
        className={`flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--border-subtle)] hover:text-[var(--text)] ${className}`}
        aria-label={`Theme: ${active}. Click to change.`}
        title={`Theme: ${active}`}
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
