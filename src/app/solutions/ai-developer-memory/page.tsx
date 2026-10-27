import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  Database,
  Layers,
  RefreshCw,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { IntegrationSnippetCopy } from "@/components/marketing/integration-snippet-copy";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "AI Developer Memory — Persistent Context for Cursor, Claude & Windsurf | Meto",
  description:
    "Stop AI amnesia. Meto equips Cursor, Claude Code, and Windsurf with persistent developer memory, tracking architectural decisions, rejected patterns, and coding directives.",
  alternates: {
    canonical: `${getSiteUrl()}/solutions/ai-developer-memory`,
  },
  openGraph: {
    title: "AI Developer Memory — Persistent Context Across AI Coding Tools",
    description:
      "Eliminate context window compaction and chat rot. A structured 3-tier memory layer for senior software engineers using AI.",
    url: `${getSiteUrl()}/solutions/ai-developer-memory`,
    siteName: "Meto",
    type: "article",
  },
};

export default function AiDeveloperMemoryPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/solutions/ai-developer-memory`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${siteUrl}/solutions` },
      { "@type": "ListItem", position: 3, name: "AI Developer Memory", item: pageUrl },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "AI Developer Memory: How to Give Coding Assistants Long-Term Architectural Recall",
    description:
      "A technical deep dive into persistent memory architectures for LLM coding agents, eliminating chat rot and Groundhog Day amnesia across developer tools.",
    author: { "@type": "Organization", name: "Meto", url: siteUrl },
    publisher: { "@type": "Organization", name: "Meto", url: siteUrl },
    url: pageUrl,
  };

  const faqList = [
    {
      q: "What causes AI coding assistant amnesia?",
      a: "LLM coding assistants operate on stateless API calls with bounded context windows. When a conversation exceeds 20-50 messages, tools apply context compaction or summarization ('chat rot'), discarding earlier decisions, edge-case fixes, and technical constraints. When you start a fresh chat or switch from Cursor to Claude Code, all past memory is completely wiped.",
    },
    {
      q: "How does Meto provide persistent memory without token bloat?",
      a: "Instead of injecting thousands of lines of chat logs into every prompt (which causes reasoning degradation and high token costs), Meto structures developer memory into a 3-tier hierarchy: global directives, project Architectural Decision Records (ADRs), and active task scratchpads. Through Model Context Protocol (MCP), tools query only the exact memory slice needed for the current file or task.",
    },
    {
      q: "Can Meto prevent AI assistants from repeating previously failed solutions?",
      a: "Yes. Meto includes a structured 'Negative Knowledge / Rejected Solutions' ledger. When an agent attempts an approach that fails or violates project architecture, recording it prevents the model (and any subsequent assistant) from proposing the exact same flawed pattern again in future sessions.",
    },
    {
      q: "Where is my memory stored, and is it private?",
      a: "Meto is local-first and privacy-centric. Your memory profiles and rules can live inside your local Git repository or your private Meto workspace. Meto never ingests or stores your proprietary source code.",
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

  const sampleMemoryJson = `{
  "developerDirectives": {
    "typescript": "strict, no 'any', enforce exhaustive switch checks",
    "architecture": "functional core, imperative shell; zero server mutations without Zod validation",
    "ui": "Tailwind CSS v4 with semantic tokens, zero custom hex in JSX"
  },
  "projectDecisions": [
    {
      "id": "ADR-004",
      "status": "accepted",
      "decision": "Use Supabase SSR client with server cookies; avoid raw supabase-js in Server Components",
      "rejected": ["Passing anon token in client headers", "Custom JWT cookies"]
    }
  ],
  "rejectedPatterns": [
    "Do NOT suggest react-query; this project uses Next.js 16 native cache and Server Actions",
    "Do NOT introduce styled-components or CSS modules"
  ]
}`;

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
          <Link href="/solutions/share-context" className="hover:text-[var(--text)] transition-colors">
            Solutions
          </Link>
          <span>/</span>
          <span className="text-[var(--text)]">AI Developer Memory</span>
        </nav>

        {/* Header Banner - Compact developer interface */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <Brain className="h-3 w-3 text-emerald-500" />
                Persistent Context Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)] leading-tight">
              AI Developer Memory: Stop the Groundhog Day Amnesia
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Give Cursor, Claude Code, and Windsurf long-term architectural recall. Keep past decisions, rejected patterns, and coding directives permanently accessible.
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
            <Link
              href="/for/cursor-and-claude"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <span>Cursor + Claude Workflow &rarr;</span>
            </Link>
          </div>
        </header>

        {/* AEO / Quick Answer Box */}
        <section
          aria-label="Direct Answer"
          className="mb-10 rounded-lg border-l-2 border-emerald-500 border-y border-r border-[var(--border-subtle)] bg-[var(--surface)] p-4 sm:p-5"
        >
          <p className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold mb-1.5">
            Direct Answer · How AI Developer Memory Works
          </p>
          <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--text)]">
            <strong>AI developer memory is an externalized, persistent context protocol</strong> that decouples project intelligence and architectural memory from transient LLM chat windows. When developers work with AI coding tools, context window limits force chat truncation and compaction (&ldquo;chat rot&rdquo;), causing models to forget past bug fixes and re-recommend deprecated patterns. Meto solves this by maintaining a structured 3-tier memory store (Global Developer Directives, Project ADRs, and Rejected Patterns) queried on-demand through Model Context Protocol (MCP) or compiled into native editor rule files, ensuring 100% architectural consistency across all sessions and tools.
          </p>
        </section>

        {/* The Problem: Chat Rot & Compaction */}
        <section className="mb-10">
          <div className="max-w-2xl mb-5">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              The Two Failures of AI Coding Memory
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Every senior engineer using AI coding assistants hits the same wall after 20 minutes of productive flow:
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
              <span className="inline-block rounded border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-500 mb-3">
                Failure 01
              </span>
              <h3 className="text-sm font-semibold text-[var(--text)]">Cold-Start Reset (Session Amnesia)</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                When you click &ldquo;New Chat&rdquo; in Cursor or launch a new Claude Code terminal instance, the assistant begins with a completely blank slate. You waste the first 5 to 10 minutes of every coding block re-explaining the same tech stack constraints, package managers, and architecture rules.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
              <span className="inline-block rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-amber-500 mb-3">
                Failure 02
              </span>
              <h3 className="text-sm font-semibold text-[var(--text)]">Chat Rot (Compaction Degradation)</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                As a conversation grows beyond 30 messages, the IDE automatically summarizes or drops earlier turns to stay under the context limit. Critical decisions made in message 4 (like &ldquo;do not use axios, use native fetch&rdquo;) vanish from the model&apos;s attention span, causing the assistant to re-introduce the exact bug you resolved an hour ago.
              </p>
            </div>
          </div>
        </section>

        {/* The 3-Tier Developer Memory Architecture */}
        <section className="mb-10 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]/50 p-5 sm:p-6">
          <div className="max-w-xl mb-5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-semibold">
              State Engine
            </span>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)] mt-1">
              The 3-Tier Developer Memory Architecture
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
              Meto replaces fragile chat history with a deterministic, structured memory pipeline:
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
                  Tier 1: Global Developer Directives
                </span>
                <span className="rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                  Always-On
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Your personal engineering philosophy and code standards across all projects. For example: strict TypeScript configuration, explicit error handling, immutability conventions, and zero hallucinated dependencies.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                  Tier 2: Architectural Decision Records (ADRs)
                </span>
                <span className="rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                  Project Scope
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Repository-specific technical decisions. Why library X was selected over library Y, the exact database conventions in use, authentication flow requirements, and caching strategies. This prevents the AI from suggesting architectural shifts that contradict your project design.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-amber-500 uppercase tracking-wider">
                  Tier 3: Negative Knowledge &amp; Rejected Patterns
                </span>
                <span className="rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--muted)]">
                  Anti-Loop Guardrails
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                A ledger of approaches that failed or are explicitly forbidden. When an AI attempts a workaround that causes a regression, recording it into Meto ensures neither Cursor nor Claude Code ever wastes time proposing that same failed solution again.
              </p>
            </div>
          </div>
        </section>

        {/* Live Code Schema */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              Structured Memory Schema
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Meto compiles memory into clean, token-efficient formats that AI coding assistants can consume via MCP queries or local configuration files:
            </p>
          </div>

          <IntegrationSnippetCopy
            filename=".meto/memory.json"
            language="json"
            snippet={sampleMemoryJson}
          />
        </section>

        {/* Comparison Matrix */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              Architectural Comparison: How Meto Differs
            </h2>
          </div>

          <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--card)]">
            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text)]">
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold">Capability</th>
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold text-rose-500">Standard Chat History</th>
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold text-amber-500">Static Rule Files</th>
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold text-emerald-500">Meto Memory Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)] text-[var(--text-secondary)]">
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Survival Across Sessions</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Lost on &ldquo;New Chat&rdquo;</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Yes (manual edits)</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Automatic &amp; Persistent
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Cross-Tool Availability</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Locked inside single tool</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Drifts across different files</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Synced to Cursor, Claude, Windsurf
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Context Token Overhead</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Massive (bloats prompt)</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Static (wastes tokens)</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Zero-bloat (queried via MCP on demand)
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Negative Knowledge (Rejected Fixes)</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Not supported</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Rarely maintained</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    First-class ledger prevents repeat errors
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Privacy &amp; Code Storage</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Vendor cloud chats</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Local file</td>
                  <td className="py-3 px-3.5 text-[var(--text)] font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Local-first, zero proprietary code saved
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

        {/* Bottom CTA Banner */}
        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text)]">
              Equip Your AI Coding Assistants with Real Memory
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
              Stop repeating your architecture, tech stack, and conventions to every new chat.
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
              href="/for/cursor-and-claude"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              Cursor + Claude
            </Link>
          </div>
        </section>
      </article>
    </MarketingLayout>
  );
}
