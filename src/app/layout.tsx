import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/components/posthog-provider";
import { brandCssVariables } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Meto — Your AI Identity",
  description:
    "Every AI should already know you. Tell Meto once — no more re-introducing yourself in Claude, ChatGPT, or Gemini.",
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/apple-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Meto — Your AI Identity",
    description:
      "Every AI should already know you. Tell Meto once — no more re-introducing yourself in Claude, ChatGPT, or Gemini.",
    url: siteUrl,
    siteName: "Meto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meto — Your AI Identity",
    description:
      "Every AI should already know you. Tell Meto once — no more re-introducing yourself in Claude, ChatGPT, or Gemini.",
  },
  other: {
    "msvalidate.01": "955F87C2C946B8129E485C03A43CBFD6",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={brandCssVariables()}
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-screen font-sans text-[var(--text)]">
        <PostHogProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
