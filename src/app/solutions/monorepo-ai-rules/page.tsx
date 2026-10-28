import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CheckCircle2,
  Cpu,
  FileCode2,
  FolderTree,
  Terminal,
  Workflow,
  XCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Rules & Context for Monorepos — Turborepo, Nx & pnpm | Meto",
  description:
    "Stop AI context bloat in monorepos. Compile granular, package-scoped rules for Cursor, Claude Code, and Windsurf without polluting your prompt tokens.",
  alternates: {
    canonical: `${getSiteUrl()}/solutions/monorepo-ai-rules`,
  },
  openGraph: {
    title: "AI Rules & Context for Monorepos — Turborepo, Nx & pnpm | Meto",
    description:
      "Granular, package-scoped AI rules and Model Context Protocol memory for large TypeScript and fullstack monorepos.",
    url: `${getSiteUrl()}/solutions/monorepo-ai-rules`,
    siteName: "Meto",
    type: "article",
  },
};

export default function MonorepoAiRulesPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/solutions/monorepo-ai-rules`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${siteUrl}/solutions` },
      { "@type": "ListItem", position: 3, name: "Monorepo AI Rules", item: pageUrl },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "AI Rules & Context for Monorepos: Managing Turborepo, Nx, and pnpm Workspaces with Cursor and Claude",
    description:
      "How to prevent prompt token bloat and hallucinated imports in large monorepos using package-scoped rule compilation and on-demand Model Context Protocol memory.",
    author: { "@type": "Organization", name: "Meto", url: siteUrl },
    publisher: { "@type": "Organization", name: "Meto", url: siteUrl },
    url: pageUrl,
  };

  const faqList = [
    {
      q: "Why do static rule files fail in monorepos?",
      a: "In a monorepo with multiple apps (e.g. Next.js web app, React Native mobile app) and shared packages (database, UI library, API client), a single root .cursorrules or CLAUDE.md file dumps every rule into every prompt. This confuses AI models, causing them to suggest web APIs in mobile code or backend imports in UI components.",
    },
    {
      q: "How does Meto scope rules to individual packages?",
      a: "Meto compiles modern Cursor MDC files (.cursor/rules/*.mdc) with explicit frontmatter glob patterns (e.g. 'apps/web/**', 'packages/ui/**'). When you open a file in apps/web, Cursor only loads the web directives. Similarly, Meto's MCP server filters architectural records by target package path.",
    },
    {
      q: "Does Meto support Turborepo, Nx, and pnpm workspaces?",
      a: "Yes. Meto CLI automatically detects workspace configuration files (pnpm-workspace.yaml, turbo.json, nx.json) and compiles both root and package-level rule definitions.",
    },
    {
      q: "Can I share common architectural standards across all monorepo packages?",
      a: "Yes. Meto allows you to define global workspace standards (e.g. TypeScript strictness, formatting, Git workflow) that apply everywhere, while attaching framework-specific rules only to designated sub-packages.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqList.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <MarketingLayout showFooter contentAlign="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Navigation Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs font-mono text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--muted)]">Solutions</span>
          <span>/</span>
          <span className="text-[var(--text)]">Monorepo AI Rules</span>
        </nav>

        {/* Header Banner */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <Boxes className="h-3 w-3 text-amber-500" />
                Monorepo Workspace Optimization
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)] leading-tight">
              AI Rules & Context for Turborepo, Nx & pnpm
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Stop monorepo context bloat in Cursor, Claude Code, and Windsurf. Compile granular, package-scoped MDC rules and serve target-specific directives via Model Context Protocol.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/integrations/cursor"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              <span>Cursor Setup</span>
            </Link>
          </div>
        </header>

        {/* Direct Answer Box for AEO & Search Engines */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 mb-10 border-l-2 border-l-[var(--primary)]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Direct Answer: Monorepo AI Context Management
          </div>
          <p className="text-sm text-[var(--text)] font-medium leading-relaxed">
            Meto solves monorepo AI context degradation by compiling package-scoped rules instead of monolithic root files. By generating targeted .cursor/rules/*.mdc files equipped with precise glob matchers (e.g. apps/web/** vs packages/database/**) and exposing on-demand MCP tools, Meto ensures coding assistants receive only the architectural rules relevant to the active file.
          </p>
        </div>

        {/* Root Bloat vs Scoped Rules */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-amber-500" />
            The Monorepo Dilemma: Root Bloat vs Scoped Directives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <span className="text-xs font-mono text-red-500 uppercase font-semibold">The Monolithic Trap</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1.5 mb-3">
                Single Root .cursorrules File
              </h3>
              <ul className="space-y-2 text-xs text-[var(--muted)]">
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>Dumps 1,000+ lines into every prompt, exhausting LLM attention and token budget.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>Next.js web rules leak into Expo mobile components or backend worker lambdas.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>AI hallucinates incorrect relative imports across package boundaries.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <span className="text-xs font-mono text-amber-500 uppercase font-semibold">The Meto Compiler</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1.5 mb-3">
                Granular Package-Scoped Rules
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Frontmatter glob filters activate rules only when matching files are edited.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>MCP server filters ADRs dynamically based on workspace package context.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Preserves 80%+ of prompt tokens for actual code and conversation history.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Monorepo Architecture Blueprint */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <FileCode2 className="h-4 w-4 text-amber-500" />
            Compiled Monorepo Rule Output
          </h2>
          <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
            <div className="text-xs font-mono text-[var(--muted)] mb-3">
              Generated structure via &apos;npx meto-cli sync&apos;:
            </div>
            <pre className="overflow-x-auto rounded-lg bg-[var(--surface)] p-4 font-mono text-xs text-[var(--text)] leading-relaxed border border-[var(--border-subtle)]">
{`my-monorepo/
├── .cursor/rules/
│   ├── 00-global-standards.mdc       # globs: ["**/*"] (TypeScript strict, git)
│   ├── 10-apps-web.mdc               # globs: ["apps/web/**/*"] (Next.js 15, Tailwind v4)
│   ├── 20-apps-mobile.mdc            # globs: ["apps/mobile/**/*"] (React Native, Expo)
│   └── 30-packages-db.mdc            # globs: ["packages/db/**/*"] (Drizzle ORM, Postgres)
├── CLAUDE.md                         # Scoped terminal directives for Claude Code
├── .windsurfrules                     # Cascade rules with package path triggers
└── turbo.json`}
            </pre>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqList.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4"
              >
                <h3 className="text-sm font-medium text-[var(--text)]">{item.q}</h3>
                <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Footer */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-6 text-center">
          <h2 className="text-base font-semibold text-[var(--text)]">
            Tame your monorepo AI context today
          </h2>
          <p className="mt-1.5 text-xs text-[var(--muted)] max-w-md mx-auto">
            Compile clean, scoped rules for Cursor, Claude Code, and Windsurf in under 2 minutes.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/solutions/sync-rules"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              <span>View Rule Sync</span>
            </Link>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
