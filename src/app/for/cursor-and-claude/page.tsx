import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Layers,
  Terminal,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { IntegrationSnippetCopy } from "@/components/marketing/integration-snippet-copy";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free, Local-First Shared Memory for Cursor and Claude Code | Meto",
  description:
    "Free, local-first shared memory and context protocol for Cursor and Claude Code. Compile .cursor/rules and CLAUDE.md from one source and share persistent memory via MCP.",
  alternates: {
    canonical: `${getSiteUrl()}/for/cursor-and-claude`,
  },
  openGraph: {
    title: "Free, Local-First Shared Memory for Cursor and Claude Code — Meto",
    description:
      "Share persistent memory and sync rules (.cursor/rules and CLAUDE.md) across Cursor and Claude Code without manual copying.",
    url: `${getSiteUrl()}/for/cursor-and-claude`,
    siteName: "Meto",
    type: "article",
  },
};

export default function CursorAndClaudeWorkflowPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/for/cursor-and-claude`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Workflows", item: `${siteUrl}/for` },
      { "@type": "ListItem", position: 3, name: "Cursor & Claude Code", item: pageUrl },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "How to Use Cursor and Claude Code Together in a Unified Workflow",
    description:
      "A complete guide to combining Cursor's inline IDE capabilities with Claude Code CLI agentic execution, powered by a shared context and rule protocol.",
    author: { "@type": "Organization", name: "Meto", url: siteUrl },
    publisher: { "@type": "Organization", name: "Meto", url: siteUrl },
    url: pageUrl,
  };

  const faqList = [
    {
      q: "Can I use Cursor and Claude Code together on the same codebase?",
      a: "Yes. In fact, pairing Cursor (for inline visual editing, tab completions, and diff inspection) with Claude Code (for autonomous terminal execution and deep architectural refactoring) is one of the highest-leverage developer setups. The challenge is state synchronization, which Meto solves by compiling a single context source into both .cursor/rules and CLAUDE.md simultaneously.",
    },
    {
      q: "Why do Cursor and Claude Code drift out of sync?",
      a: "Cursor stores project rules in .cursor/rules/*.mdc or .cursorrules, whereas Claude Code relies on CLAUDE.md. When you refine rules or make architectural choices in one tool, the other tool is unaware, resulting in conflicting code styles and duplicated work. Meto provides a unified protocol that updates both environments automatically.",
    },
    {
      q: "Does Meto replace Cursor or Claude Code?",
      a: "No. Meto is the shared context and memory infrastructure layer. It sits between you and your AI coding tools, providing the persistent directives, architectural guardrails, and project state that feed into both Cursor and Claude Code via native MCP and rule files.",
    },
    {
      q: "Is any proprietary codebase code uploaded to Meto's servers?",
      a: "No. Meto operates local-first. Your private source code stays strictly on your local disk and in your Git repository. Only high-level developer directives, stack definitions, and rule schemas are managed and compiled.",
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

  const cursorSnippet = `{
  "mcpServers": {
    "meto": {
      "command": "npx",
      "args": ["-y", "@meto/mcp@latest"]
    }
  }
}`;

  const claudeSnippet = `# Add Meto context protocol to Claude Code CLI
claude mcp add meto npx -y @meto/mcp@latest

# Or generate synchronized CLAUDE.md and .cursor/rules
npx meto sync`;

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
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-1.5 text-xs font-mono text-[var(--muted)]"
        >
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--muted)]">Workflows</span>
          <span>/</span>
          <span className="text-[var(--text)]">Cursor + Claude Code</span>
        </nav>

        {/* Header Banner - Compact developer interface */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <Layers className="h-3 w-3 text-cyan-500" />
                Free, Local-First Shared Memory for Cursor &amp; Claude Code
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)] leading-tight">
              Shared Memory &amp; Rules for Cursor and Claude Code
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Free, local-first shared memory for Cursor and Claude Code. Meto compiles .cursor/rules and CLAUDE.md from a single source of truth and exposes live ADR memory over Model Context Protocol (MCP).
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <div className="font-mono text-[11px] text-[var(--muted)] bg-[var(--surface)] px-2 py-1 rounded border border-[var(--border-subtle)]">
              npx meto-cli sync
            </div>
          </div>
        </header>

        {/* AEO / Quick Answer Box */}
        <section
          aria-label="Direct Answer"
          className="mb-10 rounded-lg border-l-2 border-cyan-500 border-y border-r border-[var(--border-subtle)] bg-[var(--surface)] p-4 sm:p-5"
        >
          <p className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold mb-1.5">
            Direct Answer · Shared Memory for Cursor and Claude Code
          </p>
          <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--text)] mb-3">
            <strong>Meto is a free, local-first shared memory and context protocol for Cursor and Claude Code.</strong> It compiles project conventions simultaneously into <code className="font-mono text-[11px] bg-[var(--card)] px-1 py-0.5 rounded border border-[var(--border-subtle)]">.cursor/rules/*.mdc</code> and <code className="font-mono text-[11px] bg-[var(--card)] px-1 py-0.5 rounded border border-[var(--border-subtle)]">CLAUDE.md</code> while exposing an open Model Context Protocol (MCP) server so both agents share the exact same architectural decision records (ADRs) and negative antipatterns.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <span className="text-emerald-500 font-medium">✓ Best for:</span>
            <span>Sharing context and persistent memory across Cursor and Claude Code without a hosted service.</span>
          </div>
        </section>

        {/* The Problem: The Copy-Paste Handoff Dance */}
        <section className="mb-10">
          <div className="max-w-2xl mb-5">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              The Problem: The Copy-Paste Handoff Dance
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Developers who adopt both tools quickly discover an irritating friction loop:
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
              <span className="inline-block rounded border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-500 mb-3">
                01
              </span>
              <h3 className="text-sm font-semibold text-[var(--text)]">Context Isolation</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                You run an architecture plan in Claude Code. Then you open Cursor, only to realize Cursor has zero awareness of what Claude Code just deduced. You manually copy paragraphs between windows.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
              <span className="inline-block rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-500 mb-3">
                02
              </span>
              <h3 className="text-sm font-semibold text-[var(--text)]">Rule Divergence</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                You configure strict TypeScript conventions in your <code className="font-mono text-[11px]">.cursor/rules</code>. When you run Claude Code in your terminal, it ignores those rules because it looks for <code className="font-mono text-[11px]">CLAUDE.md</code>, generating code with outdated patterns.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
              <span className="inline-block rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-500 mb-3">
                03
              </span>
              <h3 className="text-sm font-semibold text-[var(--text)]">State Overwrite</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                Cursor edits files while Claude Code is midway through a multi-step refactor. Without a shared session lock or shared state file, one tool breaks the assumptions of the other.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
              <span className="inline-block rounded border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-500 mb-3">
                04
              </span>
              <h3 className="text-sm font-semibold text-[var(--text)]">Groundhog Day Amnesia</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                Every new terminal window and every new Cursor composer chat resets the assistant back to a generic AI. You find yourself explaining your stack for the tenth time today.
              </p>
            </div>
          </div>
        </section>

        {/* The Meto Architecture */}
        <section className="mb-10 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-5 sm:p-6">
          <div className="max-w-xl mb-5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-600 dark:text-cyan-400 font-semibold">
              Dual-Agent Topology
            </span>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)] mt-1">
              A Unified Shared Memory Protocol
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
              Meto treats developer context as an independent, local-first layer that sits beneath both editors:
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 mb-5">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5 text-center">
              <div className="inline-flex p-1.5 rounded-md bg-[var(--card)] text-[var(--primary)] mb-2">
                <Terminal className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-xs text-[var(--text)]">Claude Code CLI</h3>
              <p className="mt-1 text-[11px] text-[var(--muted)] leading-relaxed">
                Deep terminal agents, CLI tooling, test suites, multi-file refactoring
              </p>
            </div>

            <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/5 p-3.5 text-center">
              <div className="inline-flex p-1.5 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-2">
                <Layers className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-xs text-[var(--text)]">Meto Context Layer</h3>
              <p className="mt-1 text-[11px] text-[var(--text-secondary)] leading-relaxed">
                Shared ADRs, directives, stack rules &amp; active session memory
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5 text-center">
              <div className="inline-flex p-1.5 rounded-md bg-[var(--card)] text-[var(--primary)] mb-2">
                <Code2 className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-xs text-[var(--text)]">Cursor IDE</h3>
              <p className="mt-1 text-[11px] text-[var(--muted)] leading-relaxed">
                Real-time inline code edits, Copilot-style Tab completions, visual git diffs
              </p>
            </div>
          </div>

          <div className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5 text-xs font-mono text-[var(--text-secondary)] leading-relaxed space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-500 font-semibold mb-1 text-[11px]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Real-Time Synchronized Execution Pipeline:</span>
            </div>
            <p>1. You refine a convention in Meto or directly in your codebase.</p>
            <p>2. Meto compiles the directive into native <code className="text-[var(--text)]">CLAUDE.md</code> and <code className="text-[var(--text)]">.cursor/rules/*.mdc</code> formats.</p>
            <p>3. Both agents query the live MCP context endpoint for active task state and architectural decision records (ADRs).</p>
            <p>4. Zero divergence: Both tools speak the exact same architectural language.</p>
          </div>
        </section>

        {/* Step-by-Step Setup */}
        <section className="mb-10">
          <div className="mb-5">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              Quickstart: Setting Up the Cursor &amp; Claude Code Bridge
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Follow this 3-minute setup to connect both tools to your unified Meto context:
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text)]">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[var(--primary)] text-white text-[11px]">1</span>
                <span>Initialize Meto in your project root</span>
              </div>
              <IntegrationSnippetCopy
                filename="Terminal"
                language="bash"
                snippet="npx meto init"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text)]">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[var(--primary)] text-white text-[11px]">2</span>
                <span>Connect Claude Code CLI via MCP</span>
              </div>
              <IntegrationSnippetCopy
                filename="Terminal"
                language="bash"
                snippet={claudeSnippet}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-[var(--text)]">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-[var(--primary)] text-white text-[11px]">3</span>
                <span>Enable Meto MCP in Cursor Settings</span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                In Cursor, open <span className="font-mono font-medium text-[var(--text)]">Cursor Settings &rarr; Features &rarr; MCP</span> and add:
              </p>
              <IntegrationSnippetCopy
                filename="~/.cursor/mcp.json"
                language="json"
                snippet={cursorSnippet}
              />
            </div>
          </div>
        </section>

        {/* Feature Matrix / Capability Breakdown */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              Workflow Comparison: Fragmented vs. Unified
            </h2>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--card)]">
            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text)]">
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold">Workflow Dimension</th>
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold text-rose-500">Manual / Fragmented</th>
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold text-emerald-500">Meto Unified Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Rule Definition</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Duplicate edits in .cursorrules and CLAUDE.md</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Single source of truth compiled to all targets
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Architectural Decisions (ADRs)</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Forgotten as soon as context compresses</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Persistent ADR ledger queried on-demand via MCP
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Code Style Enforcement</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Inconsistent styles between editor &amp; terminal</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    100% unified linting &amp; naming constraints
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Cold Start Amnesia</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">5-10 minutes re-explaining stack per session</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    0 seconds — instant context loading
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Multi-Repository Support</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Rules trapped inside individual git repos</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Global developer profile sync across every repo
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-2.5">
            {faqList.map((item) => (
              <div
                key={item.q}
                className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5"
              >
                <h3 className="text-xs sm:text-sm font-semibold text-[var(--text)]">{item.q}</h3>
                <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text)]">
              Bridge Cursor and Claude Code in 60 Seconds
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
              Stop losing architectural context when switching between your editor and your terminal.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/solutions/share-context"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              Context Protocol
            </Link>
          </div>
        </section>
      </article>
    </MarketingLayout>
  );
}
