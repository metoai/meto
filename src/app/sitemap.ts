import type { MetadataRoute } from "next";
import { COMPARISONS_LIST } from "@/lib/comparisons-data";
import { INTEGRATIONS_LIST } from "@/lib/integrations-data";
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

  const coreMarketingPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${base}/pricing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${base}/integrations`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${base}/auth/signup`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/auth/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${base}/solutions/share-context`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/solutions/sync-rules`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/solutions/ai-developer-memory`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/for/cursor-and-claude`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${base}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const integrationPages: MetadataRoute.Sitemap = INTEGRATIONS_LIST.map(
    (item) => ({
      url: `${base}/integrations/${item.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })
  );

  const comparisonPages: MetadataRoute.Sitemap = COMPARISONS_LIST.map(
    (item) => ({
      url: `${base}/compare/${item.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    })
  );

  const usernames = await fetchPublicProfileUsernames();
  const profileEntries: MetadataRoute.Sitemap = usernames.flatMap(
    (username) => [
      {
        url: getPublicProfileUrl(username),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      },
      {
        url: getPublicContextApiUrl(username),
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
    ]
  );

  return [
    ...coreMarketingPages,
    ...integrationPages,
    ...comparisonPages,
    ...profileEntries,
  ];
}
