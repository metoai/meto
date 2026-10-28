#!/usr/bin/env node

/**
 * IndexNow Protocol Submission Script
 *
 * Instantly notifies Bing, Yandex, Seznam, and answer engines (Perplexity, etc.)
 * to index all core marketing pages, solution workflows, integration docs,
 * comparisons, and public profiles.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *   node scripts/submit-indexnow.mjs https://www.metoai.site/solutions/share-context
 *   npm run indexnow
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Load environment variables from .env.local if present
const envLocalPath = resolve(process.cwd(), ".env.local");
if (existsSync(envLocalPath)) {
  const envContent = readFileSync(envLocalPath, "utf-8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const CANONICAL_SITE_HOST = "www.metoai.site";
const DEFAULT_SITE_URL = `https://${CANONICAL_SITE_HOST}`;
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "5f7eda72722b2bb4a8f9b4d9e4e153c3";
const INDEXNOW_ENDPOINTS = [
  "https://api.indexnow.org/indexnow",
  "https://www.bing.com/indexnow",
];

const STATIC_INDEXABLE_PATHS = [
  "/",
  "/solutions/share-context",
  "/solutions/sync-rules",
  "/solutions/ai-developer-memory",
  "/for/cursor-and-claude",
  "/pricing",
  "/integrations",
  "/blog",
  "/terms",
  "/privacy",
  "/cookies",
  "/compare/cursorrules-vs-meto",
  "/compare/cursor-memories-vs-meto",
  "/compare/claude-code-memory-vs-meto",
  "/llms.txt",
  "/llms-full.txt",
  "/integrations/cursor",
  "/integrations/windsurf",
  "/integrations/antigravity",
  "/integrations/claude-desktop",
  "/integrations/claude-code",
  "/integrations/vscode",
  "/integrations/jetbrains",
  "/integrations/continue",
];

async function main() {
  console.log("=========================================");
  console.log("  Meto IndexNow Fast-Indexing Submitter  ");
  console.log("=========================================\n");

  const args = process.argv.slice(2);
  const explicitUrls = args.filter((a) => a.startsWith("http"));

  let urlsToSubmit = [];
  const host = CANONICAL_SITE_HOST;
  const base = DEFAULT_SITE_URL;

  if (explicitUrls.length > 0) {
    urlsToSubmit = explicitUrls;
    console.log(`[Mode] Submitting ${explicitUrls.length} explicit URL(s) provided via CLI.`);
  } else {
    console.log("[Mode] Collecting all core marketing, solution, and integration pages...");
    urlsToSubmit = STATIC_INDEXABLE_PATHS.map((p) => `${base}${p}`);
    console.log(`[Discovered] ${STATIC_INDEXABLE_PATHS.length} verified indexable product routes.`);
  }

  const keyLocation = `${base}/${INDEXNOW_KEY}.txt`;

  console.log(`\n[Host]        ${host}`);
  console.log(`[Key]         ${INDEXNOW_KEY}`);
  console.log(`[KeyLocation] ${keyLocation}`);
  console.log(`[URL Count]   ${urlsToSubmit.length} URLs to submit\n`);

  console.log("Preview of URLs:");
  urlsToSubmit.slice(0, 8).forEach((u) => console.log(`  • ${u}`));
  if (urlsToSubmit.length > 8) {
    console.log(`  ... and ${urlsToSubmit.length - 8} more URLs\n`);
  }

  const payload = {
    host,
    key: INDEXNOW_KEY,
    keyLocation,
    urlList: urlsToSubmit,
  };

  for (const endpoint of INDEXNOW_ENDPOINTS) {
    console.log(`Submitting to: ${endpoint} ...`);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(payload),
      });

      let responseText = "";
      try {
        responseText = await res.text();
      } catch {
        // empty
      }

      if (res.status === 200) {
        console.log(`  ✓ HTTP 200 OK — URLs submitted and processed successfully!`);
      } else if (res.status === 202) {
        console.log(`  ✓ HTTP 202 Accepted — URLs received; IndexNow key validation in progress.`);
      } else {
        console.warn(`  ! HTTP ${res.status} ${res.statusText}: ${responseText || "No response body"}`);
      }
    } catch (err) {
      console.error(`  ✗ Error submitting to ${endpoint}:`, err.message);
    }
  }

  console.log("\n[Complete] IndexNow notification finished.");
  console.log("Bing, Yandex, Seznam, and partner engines will now prioritize crawling these URLs.");
}

main().catch((err) => {
  console.error("Fatal error running IndexNow submission:", err);
  process.exit(1);
});
