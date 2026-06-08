/**
 * Meto brand tokens — edit THIS FILE ONLY to rebrand the app.
 * Colors, typography, spacing, and radii all flow from here into
 * CSS variables (layout), Tailwind (tailwind.config.ts), and components.
 */
export const brandLight = {
  primary: "#FF4D00",
  primaryHover: "#FF6B2C",
  primaryLight: "#FFF0E8",
  background: "#FFFFFF",
  surface: "#F5F5F5",
  card: "#FFFFFF",
  text: "#0A0A0A",
  textMuted: "#737373",
  textSubtle: "#A3A3A3",
  border: "#E5E5E5",
  codeText: "#525252",
  codeBackground: "#F5F5F5",
} as const;

/**
 * Dark palette — keep in sync with `.dark` tokens in globals.css.
 */
export const brandDark = {
  primary: "#FF4D00",
  primaryHover: "#FF6B2C",
  primaryLight: "#2A1508",
  background: "#0B0B0B",
  surface: "#141414",
  card: "#1A1A1A",
  text: "#FFFFFF",
  textMuted: "#A0A0A0",
  textSubtle: "#737373",
  border: "#2A2A2A",
  codeText: "#A0A0A0",
  codeBackground: "#141414",
} as const;

export const brand = {
  colors: {
    primary: brandLight.primary,
    primaryHover: brandLight.primaryHover,
    primaryLight: brandLight.primaryLight,
    background: brandLight.background,
    surface: brandLight.surface,
    card: brandLight.card,
    text: brandLight.text,
    textMuted: brandLight.textMuted,
    textSubtle: brandLight.textSubtle,
    border: brandLight.border,
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
  favicon: "/brand/favicon.svg",
  appleIcon: "/brand/apple-icon.svg",
  logoHorizontalWhite: "/brand/logo-horizontal-white.svg",
  logoHorizontalGreen: "/brand/logo-horizontal-green.svg",
} as const;

export type LogoHorizontalVariant = "white" | "green";
