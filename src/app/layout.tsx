import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/theme-provider";
import { PostHogProvider } from "@/components/posthog-provider";
import { brandCssVariables } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";
import { ResponsiveDX } from 'responsive-dx';

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Meto — Your AI Identity",
  description:
    "Every AI should already know you. Tell Meto once — no more re-introducing yourself in Claude, Cursor, Windsurf, Google Antigravity, or ChatGPT.",
  icons: {
    icon: [{ url: "/brand/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/brand/apple-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Meto — Your AI Identity",
    description:
      "Every AI should already know you. Tell Meto once — no more re-introducing yourself in Claude, Cursor, Windsurf, Google Antigravity, or ChatGPT.",
    url: siteUrl,
    siteName: "Meto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meto — Your AI Identity",
    description:
      "Every AI should already know you. Tell Meto once — no more re-introducing yourself in Claude, Cursor, Windsurf, Google Antigravity, or ChatGPT.",
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      "Cft7uQiPS0yXmJKApEGFitfnPqMsbcG-huLNCqS-FfY",
  },
  other: {
    "msvalidate.01": "955F87C2C946B8129E485C03A43CBFD6",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Meto",
      url: siteUrl,
      logo: `${siteUrl}/brand/favicon.svg`,
      description:
        "Developer AI identity & Model Context Protocol (MCP) server for Claude, Cursor, Windsurf, and Google Antigravity.",
      sameAs: [
        "https://github.com/metoai",
        "https://x.com/metoai",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Meto",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#application`,
      name: "Meto",
      applicationCategory: "DeveloperApplication",
      applicationSubCategory: "AI Context Protocol, Multi-IDE Rule Compiler, Developer Memory",
      operatingSystem: "All",
      description:
        "Universal context protocol, multi-IDE rule synchronization, and AI developer memory across Cursor, Claude Code, Windsurf, Google Antigravity, and GitHub Copilot.",
      featureList: [
        "Universal Context Protocol across Cursor, Claude Code, Windsurf, Copilot, and Antigravity",
        "Multi-IDE Rule Synchronization (.cursor/rules/*.mdc, CLAUDE.md, .windsurfrules, copilot-instructions)",
        "Model Context Protocol (MCP) Server with lazy-loaded tool execution",
        "3-Tier Developer Memory (Global Directives, Project ADRs, Negative Knowledge)",
        "Context Health Score and automated rule drift detection",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="min-h-screen font-sans text-[var(--text)]">
        <PostHogProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </PostHogProvider>
        <ResponsiveDX />
      </body>
    </html>
  );
}
