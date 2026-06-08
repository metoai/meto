import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const publicAllow = ["/", "/profile/", "/.well-known/", "/api/public/", "/llms.txt"];

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicAllow,
        disallow: [
          "/dashboard",
          "/settings",
          "/onboarding",
          "/api/profile/",
          "/api/onboarding/",
          "/api/billing/",
        ],
      },
      {
        userAgent: "PerplexityBot",
        allow: publicAllow,
      },
      {
        userAgent: "Perplexity-User",
        allow: publicAllow,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
