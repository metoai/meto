import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Network,
  RefreshCw,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { getSiteUrl } from "@/lib/site";
import { AI_BRAND_ICON_CLASS } from "@/lib/ai-brand-icon";
import { MCP_TOOL_ICONS } from "@/lib/ai-platform-icons";

export const metadata: Metadata = {
  title: "One AI Context for All — Share Context Across Cursor, Claude & Windsurf | Meto",
  description:
    "Stop re-introducing your tech stack to every AI tool. Meto provides a single, live developer context and memory protocol that connects Cursor, Claude Code, Windsurf, and ChatGPT.",
  alternates: {
    canonical: `${getSiteUrl()}/solutions/share-context`,
  },
  openGraph: {
    title: "One AI Context for All — Share Context Across Cursor, Claude & Windsurf",
    description:
      "A unified, Git-backed developer context protocol. Synchronize architectural decisions, coding preferences, and stack rules across every AI assistant.",
    url: `${getSiteUrl()}/solutions/share-context`,
    siteName: "Meto",
    type: "article",
  },
};

export default function ShareContextSolutionPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/solutions/share-context`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${siteUrl}/solutions` },
      { "@type": "ListItem", position: 3, name: "Share AI Context", item: pageUrl },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "One AI Context for All: How to Share Developer Memory Across Coding Assistants",
    description:
      "Technical blueprint for unifying developer context, coding standards, and architectural memory across Cursor, Claude, Windsurf, and Google Antigravity.",
    author: { "@type": "Organization", name: "Meto", url: siteUrl },
    publisher: { "@type": "Organization", name: "Meto", url: siteUrl },
    url: pageUrl,
  };

  const faqList = [
    {
      q: "How does Meto share context between different AI tools?",
      a: "Meto operates as an open Model Context Protocol (MCP) server. When an AI tool (Cursor, Windsurf, Claude Desktop, Antigravity) receives a prompt, it queries Meto's local/remote MCP tools to retrieve your verified tech stack, architectural constraints, and coding rules in real time without manual copy-pasting.",
    },
    {
      q: "Does Meto upload my proprietary code to the cloud?",
      a: "No. Meto only stores your developer profile, stack directives, and architectural preferences. It never scans, clones, or stores your private source code repositories.",
    },
    {
      q: "Can I use Meto with both web chats (ChatGPT/Claude) and desktop IDEs?",
      a: "Yes. For IDEs with native MCP support (Cursor, Windsurf, Antigravity, VS Code, Claude Code CLI), Meto connects directly via MCP. For web interfaces (ChatGPT, Claude.ai, Gemini), Meto generates tailored, token-optimized system instruction prompts that you can copy in one click.",
    },
    {
      q: "How does this prevent 'Chat Rot' and context compaction?",
      a: "When AI chat sessions extend past 20 messages, LLM context windows degrade, causing models to hallucinate or forget instructions. With Meto, you can wipe the chat thread at any moment—the next query immediately re-anchors to your verified Meto profile through MCP, completely eliminating cold-start friction.",
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
          <span className="text-[var(--text)]">Share AI Context</span>
        </nav>

        {/* Header Banner - Compact high-signal developer interface */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <Network className="h-3 w-3 text-amber-500" />
                Universal Developer Context Protocol
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)] leading-tight">
              One AI Context for All. Stop Re-Introducing Yourself.
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Your tech stack, coding standards, and architectural decisions in continuous sync across Cursor, Claude Code, Windsurf, and ChatGPT. Zero prompt copying. Zero amnesia.
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
              href="/integrations"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <span>Supported Tools &rarr;</span>
            </Link>
          </div>
        </header>

        {/* Direct Answer Box for AEO & GEO engines */}
        <section
          aria-label="Direct Answer"
          className="mb-10 rounded-lg border-l-2 border-amber-500 border-y border-r border-[var(--border-subtle)] bg-[var(--surface)] p-4 sm:p-5"
        >
          <p className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold mb-1.5">
            Direct Answer · Shared Memory &amp; Context Protocol
          </p>
          <p className="text-xs sm:text-[13px] leading-relaxed text-[var(--text)] mb-3">
            <strong>Meto is a free, local-first shared memory and context protocol for AI coding assistants.</strong> It unifies project rules, active architectural decision records (ADRs), and stack preferences into a single source of truth, accessible across Cursor, Claude Code, Windsurf, VS Code, and Google Antigravity via local files and the Model Context Protocol (MCP).
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <span className="text-emerald-500 font-medium">✓ Best for:</span>
            <span>Sharing context and compiling rules (.cursor/rules, CLAUDE.md, .windsurfrules) across multiple AI tools without a hosted service.</span>
          </div>
        </section>

        {/* The Multi-Tool Reality (Problem Section) */}
        <section className="mb-10">
          <div className="max-w-2xl mb-5">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              The Reality: Modern Engineers Don&apos;t Use Just One AI
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              You code in Cursor Composer. You run autonomous terminal loops in Claude Code. You brainstorm architecture in ChatGPT or Perplexity. But each assistant lives in a complete silo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
              <span className="inline-block rounded border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-500 mb-3">
                01
              </span>
              <h3 className="text-sm font-semibold text-[var(--text)]">The Groundhog Day Burnout</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                Starting every morning by re-explaining that you use Next.js 16, Supabase, and Tailwind v4. If you don&apos;t remind the AI, it defaults to deprecated syntax.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
              <span className="inline-block rounded border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-500 mb-3">
                02
              </span>
              <h3 className="text-sm font-semibold text-[var(--text)]">The Copy-Paste Handoff Dance</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                Planning in Claude &rarr; copying markdown into Cursor Composer &rarr; generating code &rarr; copying stack traces back to Claude. Friction destroys your flow state.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
              <span className="inline-block rounded border border-rose-500/20 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-rose-500 mb-3">
                03
              </span>
              <h3 className="text-sm font-semibold text-[var(--text)]">Chat Rot &amp; Context Degradation</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                After 15 messages, LLM context compaction sets in. Models loop on rejected solutions, forcing you to wipe the thread and lose your working state.
              </p>
            </div>
          </div>
        </section>

        {/* 3-Tier State Architecture */}
        <section className="mb-10 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]/50 p-5 sm:p-6">
          <div className="max-w-xl mb-5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-amber-600 dark:text-amber-400 font-semibold">
              System Architecture
            </span>
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)] mt-1">
              How Meto Solves Context Fragmentation
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
              Rather than stuffing raw files into a prompt, Meto structures developer identity into a deterministic three-tier state protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] mb-2">
                <Layers className="h-3.5 w-3.5 text-amber-500" />
                Tier 1: Static Directives
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Verified framework versions, styling systems, testing libraries, and strict typing constraints that apply across all projects.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] mb-2">
                <Cpu className="h-3.5 w-3.5 text-emerald-500" />
                Tier 2: Persistent Memory
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Architectural Decision Records (ADRs), rejected libraries, and historical bug fixes. The AI remembers why you chose or rejected an approach.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] mb-2">
                <RefreshCw className="h-3.5 w-3.5 text-blue-500" />
                Tier 3: Active State
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Live task queues, mid-session handoffs, and multi-agent directives accessible across terminal and editor via Model Context Protocol.
              </p>
            </div>
          </div>
        </section>

        {/* Supported AI Ecosystem Grid */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              One Setup. Continuously Synchronized Everywhere.
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
              Update your profile once in Meto. Every connected IDE and agent queries your latest directives automatically.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { name: "Cursor", tool: "cursor" as const },
              { name: "Windsurf", tool: "windsurf" as const },
              { name: "Google Antigravity", tool: "antigravity" as const },
              { name: "Claude Desktop", tool: "claude" as const },
              { name: "VS Code (Cline/Roo)", tool: "vscode" as const },
              { name: "GitHub Copilot", tool: "copilot" as const },
              { name: "Zed", tool: "zed" as const },
              { name: "Claude Code CLI", tool: "terminal" as const },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center gap-2.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-2.5 text-xs font-medium text-[var(--text)] transition-colors hover:border-[var(--border)]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MCP_TOOL_ICONS[item.tool].url}
                  alt={item.name}
                  width={18}
                  height={18}
                  className={`${AI_BRAND_ICON_CLASS} shrink-0 object-contain`}
                />
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text)]">
              Manual Prompting vs Meto Context Protocol
            </h2>
          </div>
          <div className="overflow-x-auto rounded-lg border border-[var(--border-subtle)] bg-[var(--card)]">
            <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text)]">
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold">Capability</th>
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold text-[var(--muted)]">Manual Copy-Pasting</th>
                  <th className="py-2.5 px-3.5 font-mono text-xs font-semibold text-amber-600 dark:text-amber-400">Meto Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Multi-Tool Synchronization</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Zero (each tool is an island)</td>
                  <td className="py-3 px-3.5 font-medium text-[var(--text)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Automatic via MCP &amp; live API
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Chat Rot Recovery</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Must re-type prompts from scratch</td>
                  <td className="py-3 px-3.5 font-medium text-[var(--text)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Instant re-anchor in new chat
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Token Efficiency</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">Bloats entire system prompt</td>
                  <td className="py-3 px-3.5 font-medium text-[var(--text)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Lazy-loaded tools on-demand
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/40 transition-colors">
                  <td className="py-3 px-3.5 font-medium text-[var(--text)]">Directives Verification</td>
                  <td className="py-3 px-3.5 text-[var(--muted)]">None (contradictions common)</td>
                  <td className="py-3 px-3.5 font-medium text-[var(--text)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Context Score &amp; gap audit engine
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
            {faqList.map((f) => (
              <div key={f.q} className="rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5">
                <h3 className="text-xs sm:text-sm font-semibold text-[var(--text)]">{f.q}</h3>
                <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[var(--text)]">
              Connect all your AI tools to one source of truth
            </h2>
            <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">
              Create your Meto profile in 2 minutes. Free forever for developers.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Start for Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              View Pricing
            </Link>
          </div>
        </section>
      </article>
    </MarketingLayout>
  );
}
