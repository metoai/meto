import { COMPARISONS_LIST } from "@/lib/comparisons-data";
import { INTEGRATIONS_LIST } from "@/lib/integrations-data";
import { CANONICAL_SITE_HOST, getSiteUrl } from "@/lib/site";

export const DEFAULT_INDEXNOW_KEY = "ae7652935d464837a2119f0f7be368fc";

export function getIndexNowKey(): string {
  return process.env.INDEXNOW_KEY?.trim() || DEFAULT_INDEXNOW_KEY;
}

export const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
] as const;

export interface IndexNowPayload {
  host: string;
  key: string;
  keyLocation: string;
  urlList: string[];
}

export interface IndexNowEndpointResponse {
  endpoint: string;
  status: number;
  ok: boolean;
  statusText: string;
  message?: string;
}

export interface IndexNowResult {
  success: boolean;
  host: string;
  key: string;
  keyLocation: string;
  submittedCount: number;
  urls: string[];
  results: IndexNowEndpointResponse[];
}

/**
 * Returns all public, index-worthy pages for Meto:
 * - Core marketing & workflow solutions
 * - Integration guides
 * - Feature comparisons
 */
export async function getIndexableUrls(baseUrl?: string): Promise<string[]> {
  const base = (baseUrl || getSiteUrl()).replace(/\/$/, "");

  const corePages = [
    `${base}/`,
    `${base}/solutions/share-context`,
    `${base}/solutions/sync-rules`,
    `${base}/solutions/ai-developer-memory`,
    `${base}/solutions/team-context-sync`,
    `${base}/solutions/monorepo-ai-rules`,
    `${base}/solutions/personal-ai-identity`,
    `${base}/solutions/universal-custom-instructions`,
    `${base}/for/cursor-and-claude`,
    `${base}/pricing`,
    `${base}/integrations`,
    `${base}/blog`,
    `${base}/terms`,
    `${base}/privacy`,
    `${base}/cookies`,
  ];

  const integrationPages = INTEGRATIONS_LIST.map(
    (item) => `${base}/integrations/${item.slug}`
  );

  const comparisonPages = COMPARISONS_LIST.map(
    (item) => `${base}/compare/${item.slug}`
  );

  // Deduplicate URLs
  return Array.from(
    new Set([
      ...corePages,
      ...integrationPages,
      ...comparisonPages,
    ])
  );
}

/**
 * Submits URL list to IndexNow endpoints (IndexNow Global & Bing).
 * If no URLs are provided, collects all indexable pages across the site.
 */
export async function submitToIndexNow(
  urls?: string[],
  options?: {
    host?: string;
    key?: string;
    baseUrl?: string;
  }
): Promise<IndexNowResult> {
  const siteUrl = options?.baseUrl || getSiteUrl();
  const urlList =
    urls && urls.length > 0 ? urls : await getIndexableUrls(siteUrl);

  const firstUrl = urlList[0] || siteUrl;
  let parsedHost = CANONICAL_SITE_HOST;
  try {
    parsedHost = new URL(firstUrl).host;
  } catch {
    /* fallback to canonical */
  }

  const host = options?.host || parsedHost;
  const key = options?.key || getIndexNowKey();
  const keyLocation = `https://${host}/${key}.txt`;

  const payload: IndexNowPayload = {
    host,
    key,
    keyLocation,
    urlList,
  };

  const results: IndexNowEndpointResponse[] = [];

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      let message: string | undefined;
      if (!res.ok) {
        try {
          message = await res.text();
        } catch {
          /* ignore */
        }
      }

      // IndexNow returns:
      // 200: URL submitted successfully
      // 202: Accepted (Key is pending validation or crawling queued)
      const ok = res.status === 200 || res.status === 202;

      results.push({
        endpoint,
        status: res.status,
        ok,
        statusText: res.statusText || (ok ? "Accepted" : "Failed"),
        message,
      });
    } catch (err) {
      results.push({
        endpoint,
        status: 0,
        ok: false,
        statusText: err instanceof Error ? err.message : "Network error",
      });
    }
  }

  const anySuccess = results.some((r) => r.ok);

  return {
    success: anySuccess,
    host,
    key,
    keyLocation,
    submittedCount: urlList.length,
    urls: urlList,
    results,
  };
}
