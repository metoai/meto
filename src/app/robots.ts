import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/profile/", "/.well-known/"],
      disallow: ["/dashboard", "/settings", "/onboarding", "/api/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
