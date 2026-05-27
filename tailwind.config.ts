import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          "primary-hover": "var(--brand-primary-hover)",
          "primary-light": "var(--brand-primary-light)",
          background: "var(--brand-background)",
          surface: "var(--brand-surface)",
          card: "var(--brand-card)",
          text: "var(--brand-text)",
          "text-muted": "var(--brand-text-muted)",
          "text-subtle": "var(--brand-text-subtle)",
          border: "var(--brand-border)",
          "code-text": "var(--brand-code-text)",
          "code-bg": "var(--brand-code-bg)",
        },
      },
      borderRadius: {
        "brand-sm": "var(--brand-radius-sm)",
        "brand-md": "var(--brand-radius-md)",
        "brand-lg": "var(--brand-radius-lg)",
        "brand-xl": "var(--brand-radius-xl)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
