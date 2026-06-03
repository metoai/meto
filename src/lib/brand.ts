/**
 * Meto brand tokens — edit THIS FILE ONLY to rebrand the app.
 * Colors, typography, spacing, and radii all flow from here into
 * CSS variables (layout), Tailwind (tailwind.config.ts), and components.
 */
export const brandLight = {
  primary: "#0F6E56",
  primaryHover: "#1D9E75",
  primaryLight: "#E8F5F0",
  background: "#FFFFFF",
  surface: "#F7F7F5",
  card: "#FFFFFF",
  text: "#1A1A18",
  textMuted: "#6B6B63",
  textSubtle: "#9B9B93",
  border: "#E8E8E4",
  codeText: "#6B6B63",
  codeBackground: "#F7F7F5",
} as const;

/**
 * Dark palette — keep in sync with `.dark` tokens in globals.css.
 * Featured UI: `.brand-surface` (teal edge). Hero spots only: `.brand-spot` (grid + glow).
 */
export const brandDark = {
  primary: "#2EB88A",
  primaryHover: "#3DD19E",
  primaryLight: "#0F2E24",
  background: "#080C0B",
  surface: "#0F1514",
  card: "#151C1A",
  text: "#EDECE8",
  textMuted: "#A8A89E",
  textSubtle: "#72726A",
  border: "#2E2E2A",
  codeText: "#A8A89E",
  codeBackground: "#1A1A18",
} as const;

export const brand = {
  colors: {
    /** Primary — logo, CTAs, links */
    primary: brandLight.primary,
    /** Hover states, accents */
    primaryHover: brandLight.primaryHover,
    /** Light backgrounds, badges, highlights */
    primaryLight: brandLight.primaryLight,
    /** Page background */
    background: brandLight.background,
    /** Slightly elevated surfaces (sidebar, preview) */
    surface: brandLight.surface,
    /** Card / panel background */
    card: brandLight.card,
    /** Primary text */
    text: brandLight.text,
    /** Secondary / muted text */
    textMuted: brandLight.textMuted,
    /** Tertiary / labels */
    textSubtle: brandLight.textSubtle,
    /** Borders */
    border: brandLight.border,
    /** Code / copy blocks */
    codeText: brandLight.codeText,
    codeBackground: brandLight.codeBackground,
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

/** Non-color tokens injected on <html> — colors live in globals.css (:root / .dark) */
export function brandCssVariables(): Record<string, string> {
  const { radius } = brand;
  return {
    "--brand-radius-sm": radius.sm,
    "--brand-radius-md": radius.md,
    "--brand-radius-lg": radius.lg,
    "--brand-radius-xl": radius.xl,
  };
}

export type Brand = typeof brand;

/** Static brand assets — served from /public/brand */
export const brandAssets = {
  logoIcon: "/brand/logo-icon.svg",
  logoHorizontalWhite: "/brand/logo-horizontal-white.svg",
  logoHorizontalGreen: "/brand/logo-horizontal-green.svg",
} as const;

export type LogoHorizontalVariant = "white" | "green";
