/**
 * Universal Rule Converter & Linter Engine
 * Converts between Cursor .mdc, CLAUDE.md, .windsurfrules, and copilot-instructions.md.
 */

export type TargetFormat = "claude" | "windsurf" | "copilot" | "cursor";

export type LintIssue = {
  severity: "warning" | "tip" | "error";
  title: string;
  description: string;
};

export type ConversionResult = {
  claudeMd: string;
  windsurfrules: string;
  copilotInstructions: string;
  cursorMdc: string;
  estimatedTokens: number;
  wordCount: number;
  score: number;
  issues: LintIssue[];
};

/**
 * Strips YAML frontmatter from Cursor .mdc files.
 */
export function stripYamlFrontmatter(content: string): { frontmatter: string; body: string } {
  const trimmed = content.trim();
  if (!trimmed.startsWith("---")) {
    return { frontmatter: "", body: trimmed };
  }

  const endIdx = trimmed.indexOf("---", 3);
  if (endIdx === -1) {
    return { frontmatter: "", body: trimmed };
  }

  const frontmatter = trimmed.slice(3, endIdx).trim();
  const body = trimmed.slice(endIdx + 3).trim();
  return { frontmatter, body };
}

/**
 * Extracts frontmatter fields (globs, description, alwaysApply).
 */
export function parseCursorFrontmatter(frontmatter: string): {
  description?: string;
  globs?: string;
  alwaysApply?: boolean;
} {
  const result: { description?: string; globs?: string; alwaysApply?: boolean } = {};
  const lines = frontmatter.split("\n");

  for (const line of lines) {
    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim().toLowerCase();
    const val = line.slice(colonIdx + 1).trim();

    if (key === "description") result.description = val.replace(/^["']|["']$/g, "");
    if (key === "globs") result.globs = val.replace(/^["']|["']$/g, "");
    if (key === "alwaysapply") result.alwaysApply = val.toLowerCase() === "true";
  }

  return result;
}

/**
 * Estimates token count (~4 characters per token average).
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Audits a rule text for prompt bloat, negative constraints, and precision.
 */
export function auditRuleQuality(content: string): { score: number; issues: LintIssue[] } {
  const issues: LintIssue[] = [];
  let score = 100;
  const tokens = estimateTokens(content);
  const lower = content.toLowerCase();

  // 1. Token Bloat Check
  if (tokens > 1200) {
    score -= 30;
    issues.push({
      severity: "error",
      title: "Severe Token Bloat (>1,200 tokens)",
      description: `Rule file contains approx. ${tokens} tokens. Large rules degrade model attention ("lost in the middle") and increase per-prompt API costs. Split into glob-scoped rules or load via MCP.`,
    });
  } else if (tokens > 600) {
    score -= 15;
    issues.push({
      severity: "warning",
      title: "Moderate Token Drag (>600 tokens)",
      description: `Rule file has ~${tokens} tokens. Keep always-on rules under 500 tokens to preserve context space for your source code.`,
    });
  }

  // 2. Negative Constraints Check (Do not, Never, Avoid)
  const hasNegativeConstraints =
    lower.includes("do not") ||
    lower.includes("never") ||
    lower.includes("avoid") ||
    lower.includes("don't") ||
    lower.includes("prohibit");

  if (!hasNegativeConstraints) {
    score -= 10;
    issues.push({
      severity: "tip",
      title: "Missing Negative Constraints",
      description:
        "Models follow explicit negative constraints with high reliability (e.g. 'Do not use axios; use native fetch'). Add explicit pattern bans to prevent habitual mistakes.",
    });
  }

  // 3. Generic AI Fluff Check
  if (
    lower.includes("be helpful") ||
    lower.includes("you are a world-class") ||
    lower.includes("expert developer who writes clean code")
  ) {
    score -= 15;
    issues.push({
      severity: "warning",
      title: "Generic Persona Fluff Detected",
      description:
        "Phrases like 'You are an expert developer' waste context tokens without altering model weights. Replace conversational fluff with imperative technical directives.",
    });
  }

  // 4. Concrete Code Paths Check
  const hasFilePaths =
    content.includes("src/") ||
    content.includes("components/") ||
    content.includes(".ts") ||
    content.includes(".tsx") ||
    content.includes(".py") ||
    content.includes("/");

  if (!hasFilePaths) {
    score -= 5;
    issues.push({
      severity: "tip",
      title: "No Concrete Filepath References",
      description:
        "Point directly to source-of-truth reference files in your repository (e.g. 'Follow patterns in src/lib/api.ts') rather than explaining patterns in abstract prose.",
    });
  }

  return {
    score: Math.max(20, Math.min(100, score)),
    issues,
  };
}

/**
 * Universal conversion function.
 */
export function convertRules(input: string, sourceFormat: "auto" | "cursor" | "claude" = "auto"): ConversionResult {
  const trimmed = input.trim();
  const { frontmatter, body } = stripYamlFrontmatter(trimmed);
  const metadata = parseCursorFrontmatter(frontmatter);

  const cleanBody = body || trimmed;
  const wordCount = cleanBody ? cleanBody.split(/\s+/).filter(Boolean).length : 0;
  const tokens = estimateTokens(cleanBody);
  const { score, issues } = auditRuleQuality(cleanBody);

  // Generate CLAUDE.md format
  const claudeHeader = metadata.description
    ? `# ${metadata.description}\n\n`
    : `# Project & Coding Guidelines\n\n`;
  const claudeMd = `${claudeHeader}${cleanBody}`;

  // Generate .windsurfrules format
  const windsurfHeader = `# Windsurf Cascade Rules\n# Evaluated across all Cascade workflows\n\n`;
  const windsurfrules = `${windsurfHeader}${cleanBody}`;

  // Generate .github/copilot-instructions.md format
  const copilotHeader = `# GitHub Copilot Custom Instructions\n# Applied to GitHub Copilot Chat & Completions\n\n`;
  const copilotInstructions = `${copilotHeader}${cleanBody}`;

  // Generate Cursor .mdc format
  const mdcFrontmatter = [
    "---",
    `description: "${metadata.description || "Project coding guidelines and conventions"}"`,
    `globs: "${metadata.globs || "*.*"}"`,
    `alwaysApply: ${metadata.alwaysApply !== undefined ? metadata.alwaysApply : true}`,
    "---",
    "",
    cleanBody,
  ].join("\n");

  return {
    claudeMd,
    windsurfrules,
    copilotInstructions,
    cursorMdc: mdcFrontmatter,
    estimatedTokens: tokens,
    wordCount,
    score,
    issues,
  };
}

export const SAMPLE_CURSOR_RULE = `---
description: Next.js 15 App Router & Strict TypeScript Conventions
globs: src/**/*.{ts,tsx}
alwaysApply: true
---

# Architecture & Style Guidelines

- Use Next.js 15 App Router with Server Components by default
- Mark client components strictly with 'use client' at the top
- Do not install axios; use native fetch with Next.js revalidation
- Validate all incoming mutations and form payloads using Zod schemas
- For styling, use Tailwind CSS utility classes; avoid custom CSS modules
- Write unit tests using Vitest and React Testing Library in tests/unit/
- Handle errors using RFC 7807 Problem Details response formats
`;
