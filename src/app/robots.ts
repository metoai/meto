import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const publicAllow = [
    "/",
    "/favicon.ico",
    "/favicon*.png",
    "/icon*.png",
    "/brand/",
    "/apple-touch-icon.png",
    "/site.webmanifest",
    "/pricing",
    "/integrations",
    "/integrations/",
    "/compare/",
    "/solutions/",
    "/for/",
    "/rules",
    "/rules/",
    "/tools/",
    "/blog",
    "/terms",
    "/privacy",
    "/cookies",
    "/.well-known/",
    "/llms.txt",
    "/llms-full.txt",
    "/*.txt",
  ];

  const privateDisallow = [
    "/profile/",
    "/auth/",
    "/dashboard",
    "/settings",
    "/onboarding",
    "/reset-password",
    "/api/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicAllow,
        disallow: privateDisallow,
      },
      {
        userAgent: ["Googlebot", "Googlebot-Image", "Bingbot", "Applebot"],
        allow: publicAllow,
        disallow: privateDisallow,
      },
      {
        userAgent: [
          "PerplexityBot",
          "Perplexity-User",
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "anthropic-ai",
        ],
        allow: publicAllow,
        disallow: privateDisallow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
