import { HTTPClient, Polar } from "@polar-sh/sdk";
import { getSiteUrl } from "@/lib/site";

let polarClient: Polar | null = null;

/**
 * Polar SDK passes Request objects to fetch. Next.js patched fetch crashes on
 * error responses (401) with "expected non-null body source" on Node 24+.
 * Unwrap to url + init so Polar errors surface correctly.
 */
async function polarFetcher(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  if (input instanceof Request) {
    const body = input.body ? await input.clone().text() : undefined;
    return fetch(input.url, {
      method: input.method,
      headers: Object.fromEntries(input.headers.entries()),
      body,
      redirect: input.redirect,
      signal: input.signal,
    });
  }

  return init == null ? fetch(input) : fetch(input, init);
}

export function getPolarServer(): "sandbox" | "production" {
  return process.env.POLAR_SERVER === "production" ? "production" : "sandbox";
}

export function getPolar(): Polar {
  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  if (!accessToken) {
    throw new Error("POLAR_ACCESS_TOKEN is not configured.");
  }

  if (!polarClient) {
    polarClient = new Polar({
      accessToken,
      server: getPolarServer(),
      httpClient: new HTTPClient({ fetcher: polarFetcher }),
    });
  }

  return polarClient;
}

export function getPolarProProductId(): string {
  const productId = process.env.POLAR_PRO_PRODUCT_ID;
  if (!productId) {
    throw new Error("POLAR_PRO_PRODUCT_ID is not configured.");
  }
  return productId;
}

export function getSiteOrigin(): string {
  return getSiteUrl();
}
