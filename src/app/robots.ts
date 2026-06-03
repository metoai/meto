import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/profile/", "/.well-known/", "/api/public/", "/llms.txt"],
      disallow: [
        "/dashboard",
        "/settings",
        "/onboarding",
        "/api/profile/",
        "/api/onboarding/",
        "/api/billing/",
      ],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
  };
}
