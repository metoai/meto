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
    "Build your AI identity once. Paste it everywhere. Stop introducing yourself to AI.",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "Meto — Your AI Identity",
    description:
      "Build your AI identity once. Paste it everywhere. Stop introducing yourself to AI.",
    url: siteUrl,
    siteName: "Meto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meto — Your AI Identity",
    description:
      "Build your AI identity once. Paste it everywhere.",
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
