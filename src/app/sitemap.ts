import type { MetadataRoute } from "next";
import { fetchPublicProfileUsernames } from "@/lib/public-profile";
import {
  getPublicContextApiUrl,
  getPublicProfileUrl,
  getSiteUrl,
} from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/auth/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/auth/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const usernames = await fetchPublicProfileUsernames();
  const profileEntries: MetadataRoute.Sitemap = usernames.flatMap(
    (username) => [
      {
        url: getPublicProfileUrl(username),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: getPublicContextApiUrl(username),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
    ]
  );

  return [...staticEntries, ...profileEntries];
}
