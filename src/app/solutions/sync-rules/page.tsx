import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileCode2,
  GitBranch,
  Layers,
  RefreshCw,
  Scale,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sync AI Rules Across Cursor, Windsurf, Claude & Copilot | Meto",
  description:
    "Stop manually copying .cursorrules, CLAUDE.md, and .windsurfrules. Meto unifies your AI coding standards into a single source of truth that synchronizes across all IDEs.",
  alternates: {
    canonical: `${getSiteUrl()}/solutions/sync-rules`,
  },
  openGraph: {
    title: "Sync AI Rules Across Cursor, Windsurf, Claude & Copilot — Meto",
    description:
      "One rule file to rule them all. Keep .cursor/rules, CLAUDE.md, .windsurfrules, and .github/copilot-instructions.md in continuous sync.",
    url: `${getSiteUrl()}/solutions/sync-rules`,
    siteName: "Meto",
    type: "article",
  },
};

export default function SyncRulesSolutionPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/solutions/sync-rules`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${siteUrl}/solutions` },
      { "@type": "ListItem", position: 3, name: "Sync AI Rules", item: pageUrl },
    ],
  };

  const faqList = [
    {
      q: "Why do I need rule synchronization if I already have a .cursorrules file?",
      a: "A static .cursorrules file only works in Cursor and only inside that single repository. If you use Windsurf, Claude Code, or work across multiple repositories, your rules immediately drift. When you adopt a new library or convention, you have to manually edit every repo. Meto synchronizes your verified rules globally across all repositories and editors.",
    },
    {
      q: "What formats does Meto support?",
      a: "Meto exports and compiles to .cursor/rules/*.mdc, legacy .cursorrules, CLAUDE.md, .windsurfrules, .github/copilot-instructions.md, and native Model Context Protocol (MCP) servers.",
    },
    {
      q: "How does Meto prevent token bloat from giant rules files?",
      a: "Dumping 2,000 lines of rules into an always-on configuration degrades model reasoning (the 'lost-in-the-middle' phenomenon). Meto structures your rules hierarchically: core global rules are compact, while stack-specific rules are lazily loaded on-demand via MCP only when relevant files are touched.",
    },
    {
      q: "Can I use Meto on a team with different editor choices?",
      a: "Yes! If half your team uses Cursor and the other half uses Windsurf or Claude Code, Meto ensures all engineers generate code according to the exact same architectural standards, regardless of their client tool.",
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Navigation Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--muted)]">Solutions</span>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">Sync AI Rules</span>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1 text-xs font-medium text-[var(--text-secondary)] mb-4">
            <RefreshCw className="h-3.5 w-3.5 text-amber-500" />
            Universal AI Rules Synchronization
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text)] leading-[1.12]">
            One Rule File to Rule Them All. <br className="hidden sm:inline" />
            Stop Juggling Config Sprawl.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Write your coding standards, framework versions, and architectural guidelines once. Meto keeps Cursor, Windsurf, Claude Code, and Copilot in continuous sync.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              Start Syncing Rules Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/compare/cursorrules-vs-meto"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              .cursorrules vs Meto
            </Link>
          </div>
        </div>

        {/* Direct Answer Box for AEO / GEO */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-6 sm:p-7 mb-14 shadow-xs">
          <p className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold mb-2">
            The Definition & Architecture
          </p>
          <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--text)]">
            <strong>Rule synchronization is the automated management of AI developer directives across fragmented configuration formats.</strong> Instead of manually duplicating rules across <code>.cursor/rules/*.mdc</code>, <code>CLAUDE.md</code>, <code>.windsurfrules</code>, and <code>.github/copilot-instructions.md</code>, Meto serves as a unified Single Source of Truth (SSOT), compiling guidelines and streaming verified context on demand.
          </p>
        </div>

        {/* The 4 Pitfalls of Fragmented Config Files */}
        <section className="mb-14">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              Why Managing Rules Manually Breaks Down
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
              Every AI tool invented its own rule syntax. Maintaining them across multiple repositories creates compounding tech debt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text)] mb-2">
                <FileCode2 className="h-4 w-4 text-red-500" />
                Format Incompatibility
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Cursor uses <code>.cursor/rules/*.mdc</code> with YAML frontmatter. Claude Code uses <code>CLAUDE.md</code> in the repo root. Windsurf expects <code>.windsurfrules</code>. Copilot reads <code>.github/copilot-instructions.md</code>. You have to maintain 4 files for the exact same rules.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text)] mb-2">
                <GitBranch className="h-4 w-4 text-red-500" />
                Multi-Repository Drift
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                When you adopt Vitest over Jest or switch from Tailwind v3 to v4, your primary project gets updated. Your 10 other repositories remain stuck on obsolete rules, causing AI assistants to write deprecated code.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text)] mb-2">
                <Layers className="h-4 w-4 text-red-500" />
                Token Window Exhaustion
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Dumping hundreds of lines of static text into an always-on configuration consumes thousands of tokens on every chat query. Models suffer from &apos;lost-in-the-middle&apos; syndrome and miss critical constraints.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2.5 text-sm font-semibold text-[var(--text)] mb-2">
                <Code2 className="h-4 w-4 text-red-500" />
                No Rule Verification
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Static markdown files have no compiler or linter. Conflicting instructions (&apos;use camelCase&apos; vs &apos;use snake_case&apos;) go unnoticed until the AI generates erratic code in production.
              </p>
            </div>
          </div>
        </section>

        {/* The Unified Configuration Matrix Table */}
        <section className="mb-14">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)] mb-6 text-center">
            How Meto Compiles to Every AI Format
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text)]">
                  <th className="py-3 px-4 font-semibold">AI Tool / IDE</th>
                  <th className="py-3 px-4 font-semibold text-[var(--muted)]">Target File / Protocol</th>
                  <th className="py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">Meto Sync Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">Cursor Composer</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--muted)]">.cursor/rules/*.mdc & MCP</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    1-Click MCP + live compile
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">Claude Code (CLI)</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--muted)]">CLAUDE.md & claude mcp add</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Terminal MCP server
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">Windsurf Cascade</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--muted)]">.windsurfrules & mcp_config</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Direct Cascade MCP
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">GitHub Copilot</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--muted)]">.github/copilot-instructions.md</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Auto-generated markdown
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">Google Antigravity</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[var(--muted)]">~/.gemini/antigravity/mcp</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Autonomous agent directives
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-14">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)] mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqList.map((f) => (
              <div key={f.q} className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
                <h3 className="text-sm font-semibold text-[var(--text)]">{f.q}</h3>
                <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-b from-[var(--surface)] to-[var(--card)] p-6 sm:p-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
            Stop copying rules. Start synchronizing.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            Set up your Single Source of Truth in Meto. Free for developers.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/integrations"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              View All Integrations
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
