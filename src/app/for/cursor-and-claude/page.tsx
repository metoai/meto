import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileCode2,
  GitCompare,
  Layers,
  RefreshCw,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { IntegrationSnippetCopy } from "@/components/marketing/integration-snippet-copy";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cursor & Claude Code: The Ultimate Hybrid AI Developer Workflow | Meto",
  description:
    "How to pair Cursor's visual editor with Claude Code CLI without copy-pasting context. Share rules, architectural memory, and active state across both tools.",
  alternates: {
    canonical: `${getSiteUrl()}/for/cursor-and-claude`,
  },
  openGraph: {
    title: "Cursor & Claude Code Workflow: Share Context Across Editor & Terminal",
    description:
      "Stop the copy-paste handoff dance. Meto unifies Cursor and Claude Code with a shared memory and rules protocol.",
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

      <article className="mx-auto w-full max-w-4xl px-4 py-8 sm:py-12">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-xs font-mono text-[var(--muted)]"
        >
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--text-secondary)]">Workflows</span>
          <span>/</span>
          <span className="text-[var(--text)]">Cursor + Claude Code</span>
        </nav>

        {/* Header */}
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>Developer Workflow Blueprint</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
            Cursor & Claude Code: The Ultimate Hybrid Workflow
          </h1>

          <p className="text-lg text-[var(--text-secondary)] leading-relaxed sm:text-xl">
            Cursor gives you lightning-fast inline completions and editor control. Claude Code gives you
            deep autonomous terminal execution. Meto eliminates the copy-paste handoff dance between them.
          </p>
        </header>

        {/* AEO / Quick Answer Box */}
        <section
          aria-label="Quick Answer"
          className="my-10 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/[0.03] p-6 text-sm leading-relaxed"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[var(--primary)] font-semibold mb-2">
            <Zap className="h-4 w-4" />
            <span>Direct Answer: Using Cursor and Claude Code Together</span>
          </div>
          <p className="text-[var(--text)]">
            <strong>Yes, Cursor and Claude Code form the ideal dual-agent workflow</strong> when connected
            by a shared memory layer. Senior engineers use Claude Code CLI for broad repository analysis,
            test execution, and multi-file refactoring agents, while using Cursor for granular editing, inline
            tab completions, and git diff reviews. Meto acts as the unified context protocol, synchronizing
            architectural decisions, active scratchpad state, and rule files (<code className="font-mono text-xs bg-[var(--surface)] px-1 py-0.5 rounded">.cursor/rules/*.mdc</code> and <code className="font-mono text-xs bg-[var(--surface)] px-1 py-0.5 rounded">CLAUDE.md</code>)
            so both tools stay aligned without repetitive re-prompting.
          </p>
        </section>

        {/* The Problem: The Copy-Paste Handoff Dance */}
        <section className="my-16 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            The Problem: The Copy-Paste Handoff Dance
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Developers who adopt both tools quickly discover an irritating friction loop:
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-rose-400 font-semibold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-[10px]">1</span>
                <span>Context Isolation</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                You run an architecture plan in Claude Code. Then you open Cursor, only to realize Cursor
                has zero awareness of what Claude Code just deduced. You manually copy paragraphs between windows.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-semibold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-[10px]">2</span>
                <span>Rule Divergence</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                You configure strict TypeScript conventions in your <code className="font-mono text-[11px]">.cursor/rules</code>.
                When you run Claude Code in your terminal, it ignores those rules because it looks for <code className="font-mono text-[11px]">CLAUDE.md</code>,
                generating code with outdated patterns.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-semibold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/10 text-[10px]">3</span>
                <span>State Overwrite</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Cursor edits files while Claude Code is midway through a multi-step refactor. Without a shared
                session lock or shared state file, one tool breaks the assumptions of the other.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs text-rose-400 font-semibold">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/10 text-[10px]">4</span>
                <span>Groundhog Day Amnesia</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Every new terminal window and every new Cursor composer chat resets the assistant back to
                a generic AI. You find yourself explaining your stack for the tenth time today.
              </p>
            </div>
          </div>
        </section>

        {/* The Meto Architecture */}
        <section className="my-16 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            The Solution: A Shared Memory Protocol
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Meto treats developer context as an independent, local-first layer that sits beneath both editors.
            Instead of manually duplicating guidelines, Meto acts as the compiler and synchronization bridge:
          </p>

          <div className="overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)]">
            <div className="border-b border-[var(--border-subtle)] bg-[var(--surface)] px-5 py-3">
              <span className="font-mono text-xs text-[var(--muted)]">
                Architecture: Dual-Agent Unified Execution
              </span>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] p-4 text-center space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-[var(--surface)] text-[var(--primary)]">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-[var(--text)]">Claude Code CLI</h3>
                  <p className="text-xs text-[var(--muted)]">
                    Deep terminal agents, CLI tooling, test suites, multi-file refactoring
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/[0.05] p-4 text-center space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-[var(--primary)] text-white">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-[var(--text)]">Meto Context Layer</h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Shared ADRs, directives, stack rules &amp; active session memory
                  </p>
                </div>

                <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg)] p-4 text-center space-y-2">
                  <div className="inline-flex p-2 rounded-lg bg-[var(--surface)] text-[var(--primary)]">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-sm text-[var(--text)]">Cursor IDE</h3>
                  <p className="text-xs text-[var(--muted)]">
                    Real-time inline code edits, Copilot-style Tab completions, visual git diffs
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-[var(--surface)] p-4 text-xs font-mono text-[var(--text-secondary)] leading-relaxed space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>How it operates in real-time:</span>
                </div>
                <p>1. You refine a convention in Meto or directly in your codebase.</p>
                <p>2. Meto compiles the directive into native <code className="text-[var(--text)]">CLAUDE.md</code> and <code className="text-[var(--text)]">.cursor/rules/*.mdc</code> formats.</p>
                <p>3. Both agents query the live MCP context endpoint for active task state and architectural decision records (ADRs).</p>
                <p>4. Zero divergence: Both tools speak the exact same architectural language.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step-by-Step Setup */}
        <section className="my-16 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            Quickstart: Setting Up the Cursor &amp; Claude Code Bridge
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Follow this 3-minute setup to connect both tools to your unified Meto context:
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-sm font-semibold text-[var(--text)]">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)] text-white text-xs">1</span>
                <span>Initialize Meto in your project root</span>
              </div>
              <IntegrationSnippetCopy
                filename="Terminal"
                language="bash"
                snippet="npx meto init"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-sm font-semibold text-[var(--text)]">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)] text-white text-xs">2</span>
                <span>Connect Claude Code CLI via MCP</span>
              </div>
              <IntegrationSnippetCopy
                filename="Terminal"
                language="bash"
                snippet={claudeSnippet}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-sm font-semibold text-[var(--text)]">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--primary)] text-white text-xs">3</span>
                <span>Enable Meto MCP in Cursor Settings</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
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
        <section className="my-16 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            Workflow Comparison: Fragmented vs. Unified
          </h2>

          <div className="overflow-x-auto rounded-xl border border-[var(--border-subtle)] bg-[var(--card)]">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)]">
                <tr>
                  <th className="p-4 font-mono font-semibold">Workflow Dimension</th>
                  <th className="p-4 font-mono font-semibold text-rose-400">Manual / Fragmented</th>
                  <th className="p-4 font-mono font-semibold text-emerald-400">Meto Unified Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr>
                  <td className="p-4 font-medium text-[var(--text)]">Rule Definition</td>
                  <td className="p-4">Duplicate edits in .cursorrules and CLAUDE.md</td>
                  <td className="p-4 text-emerald-300 font-medium">Single source of truth compiled to all targets</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--text)]">Architectural Decisions (ADRs)</td>
                  <td className="p-4">Forgotten as soon as context compresses</td>
                  <td className="p-4 text-emerald-300 font-medium">Persistent ADR ledger queried on-demand via MCP</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--text)]">Code Style Enforcement</td>
                  <td className="p-4">Inconsistent styles between editor &amp; terminal</td>
                  <td className="p-4 text-emerald-300 font-medium">100% unified linting &amp; naming constraints</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--text)]">Cold Start Amnesia</td>
                  <td className="p-4">5-10 minutes re-explaining stack per session</td>
                  <td className="p-4 text-emerald-300 font-medium">0 seconds — instant context loading</td>
                </tr>
                <tr>
                  <td className="p-4 font-medium text-[var(--text)]">Multi-Repository Support</td>
                  <td className="p-4">Rules trapped inside individual git repos</td>
                  <td className="p-4 text-emerald-300 font-medium">Global developer profile sync across every repo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="my-16 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            Frequently Asked Questions
          </h2>
          <div className="grid gap-4">
            {faqList.map((item) => (
              <div
                key={item.q}
                className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 space-y-2"
              >
                <h3 className="text-sm font-semibold text-[var(--text)]">{item.q}</h3>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="my-16 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)] p-8 text-center space-y-5">
          <h2 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            Bridge Cursor and Claude Code in 60 Seconds
          </h2>
          <p className="mx-auto max-w-xl text-sm text-[var(--text-secondary)]">
            Stop losing architectural context when switching between your editor and your terminal.
            Create your unified Meto profile and keep all your AI coding assistants in sync.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-medium text-white transition-transform active:scale-[0.98] hover:opacity-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/solutions/share-context"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] px-6 py-3 text-sm font-medium text-[var(--text)] transition-colors hover:bg-[var(--surface)]"
            >
              <span>Explore Context Protocol</span>
            </Link>
          </div>
        </section>
      </article>
    </MarketingLayout>
  );
}
