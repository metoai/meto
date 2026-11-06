import { describe, it, expect } from "vitest";
import { COMPARISONS_LIST, getComparisonBySlug } from "@/lib/comparisons-data";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-data";
import { RULES_LIST, getRuleBySlug } from "@/lib/rules-data";
import { convertRules, stripYamlFrontmatter, estimateTokens, auditRuleQuality } from "@/lib/rule-converter";
import sitemap from "@/app/sitemap";

describe("SEO & Growth Engine Validation", () => {
  it("includes Direct Answer blocks on flagship comparison pages for AEO", () => {
    const flagshipSlugs = [
      "cursorrules-vs-meto",
      "cursor-memories-vs-meto",
      "claude-code-memory-vs-meto",
      "copilot-instructions-vs-meto",
      "windsurfrules-vs-meto",
    ];

    for (const slug of flagshipSlugs) {
      const item = getComparisonBySlug(slug);
      expect(item, `Comparison item ${slug} must exist`).toBeDefined();
      expect(item?.directAnswer, `Item ${slug} must have a directAnswer defined`).toBeDefined();
      expect(item!.directAnswer!.length).toBeGreaterThan(60);
    }
  });

  it("retargets comparison metadata away from brand-only queries to high-intent queries", () => {
    const cursorRulesComparison = getComparisonBySlug("cursorrules-vs-meto");
    expect(cursorRulesComparison?.targetQuery).toContain("cursor rules");
    expect(cursorRulesComparison?.metaTitle).toContain("Cursor Rules vs CLAUDE.md");

    const cursorMemoriesComparison = getComparisonBySlug("cursor-memories-vs-meto");
    expect(cursorMemoriesComparison?.targetQuery).toContain("sync cursor rules");
    expect(cursorMemoriesComparison?.metaTitle).toContain("Sync Cursor Rules");

    const claudeComparison = getComparisonBySlug("claude-code-memory-vs-meto");
    expect(claudeComparison?.targetQuery).toContain("claude code");
  });

  it("provides in-depth technical blog posts with structured data fields", () => {
    expect(BLOG_POSTS.length).toBeGreaterThanOrEqual(4);

    for (const post of BLOG_POSTS) {
      expect(post.slug).toBeDefined();
      expect(post.title.length).toBeGreaterThan(15);
      expect(post.metaDescription.length).toBeGreaterThan(50);
      expect(post.directAnswer.length).toBeGreaterThan(50);
      expect(post.sections.length).toBeGreaterThanOrEqual(3);
      expect(post.tableOfContents.length).toBeGreaterThanOrEqual(3);
      expect(post.faq.length).toBeGreaterThanOrEqual(2);

      const retrieved = getBlogPostBySlug(post.slug);
      expect(retrieved).toEqual(post);
    }
  });

  it("validates rule directory templates and metadata", () => {
    expect(RULES_LIST.length).toBeGreaterThanOrEqual(6);

    for (const rule of RULES_LIST) {
      expect(rule.slug).toBeDefined();
      expect(rule.title).toBeDefined();
      expect(rule.metaTitle).toBeDefined();
      expect(rule.metaDescription.length).toBeGreaterThan(40);
      expect(rule.cursorMdcContent).toContain("---");
      expect(rule.claudeMdContent.length).toBeGreaterThan(50);
      expect(rule.keyDirectives.length).toBeGreaterThanOrEqual(3);
      expect(rule.faq.length).toBeGreaterThanOrEqual(1);

      const retrieved = getRuleBySlug(rule.slug);
      expect(retrieved).toEqual(rule);
    }
  });

  it("converts Cursor rules to CLAUDE.md and .windsurfrules accurately", () => {
    const testMdc = `---
description: Test Rule for Next.js
globs: src/**/*.tsx
alwaysApply: true
---

# Directives
- Do not use axios
- Use React Server Components`;

    const result = convertRules(testMdc);
    expect(result.claudeMd).toContain("# Test Rule for Next.js");
    expect(result.claudeMd).toContain("Do not use axios");
    expect(result.claudeMd).not.toContain("globs:");
    expect(result.windsurfrules).toContain("# Windsurf Cascade Rules");
    expect(result.copilotInstructions).toContain("# GitHub Copilot Custom Instructions");
    expect(result.cursorMdc).toContain("globs: \"src/**/*.tsx\"");
    expect(result.estimatedTokens).toBeGreaterThan(0);
    expect(result.score).toBeGreaterThan(70);
  });

  it("includes all blog posts, rules, and tools in sitemap.xml", async () => {
    const siteMapEntries = await sitemap();
    const urls = siteMapEntries.map((e) => e.url);

    expect(urls.some((u) => u.endsWith("/blog"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/rules"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/tools/cursor-to-claude"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/blog/how-to-sync-cursor-rules-across-repos"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/blog/claude-md-vs-cursorrules-guide"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/blog/stop-prompt-token-bloat-ai-rules"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/blog/claude-code-cursor-windsurf-shared-memory-mcp"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/rules/nextjs-15-app-router"))).toBe(true);
    expect(urls.some((u) => u.endsWith("/rules/typescript-strict-zod"))).toBe(true);
  });
});
