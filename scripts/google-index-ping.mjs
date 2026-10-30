#!/usr/bin/env node

/**
 * Google Indexing API & Search Engine Notifier
 *
 * Fast-tracks indexing for new public profiles, blog articles, and integration guides.
 *
 * Usage:
 *   node scripts/google-index-ping.mjs https://www.metoai.site/integrations/cursor
 *   node scripts/google-index-ping.mjs --sitemap
 */

import { createSign } from "crypto";
import { readFileSync, existsSync } from "fs";

const GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token";
const GOOGLE_INDEXING_ENDPOINT =
  "https://indexing.googleapis.com/v3/urlNotifications:publish";
const DEFAULT_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.metoctx.com";

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function getGoogleAccessToken(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "RS256", typ: "JWT" };
  const claimSet = {
    iss: credentials.client_email,
    scope: "https://www.googleapis.com/auth/indexing",
    aud: GOOGLE_TOKEN_URI,
    exp: now + 3600,
    iat: now,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedClaimSet = base64UrlEncode(JSON.stringify(claimSet));
  const unsignedToken = `${encodedHeader}.${encodedClaimSet}`;

  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(credentials.private_key, "base64");
  const encodedSignature = signature
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const jwt = `${unsignedToken}.${encodedSignature}`;

  const res = await fetch(GOOGLE_TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Google OAuth error: ${data.error_description || data.error}`);
  }
  return data.access_token;
}

async function submitUrlToGoogle(url, accessToken, type = "URL_UPDATED") {
  const res = await fetch(GOOGLE_INDEXING_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ url, type }),
  });

  const result = await res.json();
  return { ok: res.ok, status: res.status, result };
}

async function pingSearchEnginesWithSitemap(sitemapUrl) {
  console.log(`[SEO] Pinging search engines with sitemap: ${sitemapUrl}`);

  // Ping Google (standard webmaster ping)
  try {
    const googlePing = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(googlePing);
    console.log(`[Google Ping] HTTP ${res.status}`);
  } catch (err) {
    console.warn(`[Google Ping Failed]: ${err.message}`);
  }

  // Ping Bing
  try {
    const bingPing = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
    const res = await fetch(bingPing);
    console.log(`[Bing Ping] HTTP ${res.status}`);
  } catch (err) {
    console.warn(`[Bing Ping Failed]: ${err.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const sitemapFlag = args.includes("--sitemap");
  const urlsToPing = args.filter((a) => a.startsWith("http"));

  if (sitemapFlag || urlsToPing.length === 0) {
    const sitemapUrl = `${DEFAULT_SITE_URL}/sitemap.xml`;
    await pingSearchEnginesWithSitemap(sitemapUrl);
  }

  // Check for Google Cloud service account credentials
  let credentials = null;
  if (process.env.GOOGLE_INDEXING_CREDENTIALS) {
    try {
      credentials = JSON.parse(process.env.GOOGLE_INDEXING_CREDENTIALS);
    } catch {
      console.warn("[Google Indexing] Could not parse GOOGLE_INDEXING_CREDENTIALS JSON");
    }
  } else if (existsSync("./google-service-account.json")) {
    credentials = JSON.parse(readFileSync("./google-service-account.json", "utf-8"));
  }

  if (!credentials) {
    console.log(
      "\n[Notice] Google Indexing API service account key not found." +
        "\nTo enable instant URL push to Google, provide GOOGLE_INDEXING_CREDENTIALS in env or place google-service-account.json in the project root." +
        "\nLearn more: https://developers.google.com/search/apis/indexing-api/v3/prereqs\n"
    );
    return;
  }

  console.log(`[Google Indexing] Authenticating service account: ${credentials.client_email}`);
  const token = await getGoogleAccessToken(credentials);

  for (const url of urlsToPing) {
    console.log(`[Google Indexing] Submitting URL: ${url}`);
    const res = await submitUrlToGoogle(url, token);
    if (res.ok) {
      console.log(`  ✓ Accepted by Google at ${res.result.urlNotificationMetadata?.latestUpdate?.notifyTime || "now"}`);
    } else {
      console.error(`  ✗ Error (${res.status}):`, res.result);
    }
  }
}

main().catch(console.error);
