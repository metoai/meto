import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { brandCssVariables } from "@/lib/brand";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Meto — Your AI Identity",
  description:
    "Every AI should already know you. Tell Meto once — no more re-introducing yourself in Claude, ChatGPT, or Gemini.",
  icons: {
    icon: [{ url: "/brand/logo-icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/logo-icon.svg", type: "image/svg+xml" }],
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
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
