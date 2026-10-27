import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const publicAllow = [
    "/",
    "/pricing",
    "/integrations",
    "/integrations/",
    "/compare/",
    "/solutions/",
    "/for/",
    "/blog",
    "/profile/",
    "/.well-known/",
    "/api/public/",
    "/api/badge/",
    "/llms.txt",
  ];

  const privateDisallow = [
    "/dashboard",
    "/settings",
    "/onboarding",
    "/api/profile/",
    "/api/onboarding/",
    "/api/billing/",
    "/api/admin/",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicAllow,
        disallow: privateDisallow,
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot"],
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
