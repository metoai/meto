/**
 * Meto brand tokens — edit THIS FILE ONLY to rebrand the app.
 * Colors, typography, spacing, and radii all flow from here into
 * CSS variables (layout), Tailwind (tailwind.config.ts), and components.
 */
export const brand = {
  colors: {
    /** Primary — logo, CTAs, links */
    primary: "#0F6E56",
    /** Hover states, accents */
    primaryHover: "#1D9E75",
    /** Light backgrounds, badges, highlights */
    primaryLight: "#E1F5EE",
    /** Dark mode page background */
    background: "#0F1F1A",
    /** Slightly elevated surfaces (cards, sidebar) */
    surface: "#111111",
    /** Card / panel background */
    card: "#1a1a1a",
    /** Primary text */
    text: "#f5f5f5",
    /** Secondary / muted text */
    textMuted: "#a3a3a3",
    /** Tertiary / labels */
    textSubtle: "#737373",
    /** Borders */
    border: "#262626",
    /** Code / copy blocks */
    codeText: "#1D9E75",
    codeBackground: "#111111",
  },
  fonts: {
    sans: "var(--font-geist-sans)",
    mono: "var(--font-geist-mono)",
  },
  radius: {
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
} as const;

/** CSS custom properties injected on <html> — do not edit; derived from brand.colors */
export function brandCssVariables(): Record<string, string> {
  const { colors, radius } = brand;
  return {
    "--brand-primary": colors.primary,
    "--brand-primary-hover": colors.primaryHover,
    "--brand-primary-light": colors.primaryLight,
    "--brand-background": colors.background,
    "--brand-surface": colors.surface,
    "--brand-card": colors.card,
    "--brand-text": colors.text,
    "--brand-text-muted": colors.textMuted,
    "--brand-text-subtle": colors.textSubtle,
    "--brand-border": colors.border,
    "--brand-code-text": colors.codeText,
    "--brand-code-bg": colors.codeBackground,
    "--brand-radius-sm": radius.sm,
    "--brand-radius-md": radius.md,
    "--brand-radius-lg": radius.lg,
    "--brand-radius-xl": radius.xl,
  };
}

export type Brand = typeof brand;
