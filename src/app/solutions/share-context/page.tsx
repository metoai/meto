import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Network,
  RefreshCw,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { IntegrationSnippetCopy } from "@/components/marketing/integration-snippet-copy";
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

      <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Navigation Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--muted)]">Solutions</span>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">Share AI Context</span>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1 text-xs font-medium text-[var(--text-secondary)] mb-4">
            <Network className="h-3.5 w-3.5 text-amber-500" />
            Universal Developer Context Protocol
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-[var(--text)] leading-[1.12]">
            One AI Context for All. <br className="hidden sm:inline" />
            Stop Re-Introducing Yourself.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Your tech stack, coding standards, and architectural decisions in continuous sync across Cursor, Claude Code, Windsurf, and ChatGPT. Zero prompt copying. Zero amnesia.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
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
              Explore Supported Tools
            </Link>
          </div>
        </div>

        {/* Direct Answer Box for AEO & GEO engines */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-6 sm:p-7 mb-14 shadow-xs">
          <p className="text-[11px] font-mono uppercase tracking-wider text-amber-500 font-semibold mb-2">
            The Definition & Concept
          </p>
          <p className="text-sm sm:text-[15px] leading-relaxed text-[var(--text)]">
            <strong>Meto is an open developer context protocol and synchronization engine.</strong> It unifies project rules, active architectural directives, and personal developer preferences into a single source of truth, accessible across Cursor, Claude Code, Windsurf, VS Code, and Google Antigravity via local files and the Model Context Protocol (MCP).
          </p>
        </div>

        {/* The Multi-Tool Reality (Problem Section) */}
        <section className="mb-14">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--text)]">
              The Reality: Modern Engineers Don&apos;t Use Just One AI
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
              You code in Cursor Composer. You run autonomous terminal loops in Claude Code. You brainstorm architecture in ChatGPT or Perplexity. But each assistant lives in a complete silo.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 mb-3 font-mono font-bold text-xs">
                01
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)]">The Groundhog Day Burnout</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                Starting every morning by re-explaining that you use Next.js 16, Supabase, and Tailwind v4. If you don&apos;t remind the AI, it defaults to deprecated syntax.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 mb-3 font-mono font-bold text-xs">
                02
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)]">The Copy-Paste Handoff Dance</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                Planning in Claude &rarr; copying markdown into Cursor Composer &rarr; generating code &rarr; copying stack traces back to Claude. Friction destroys your flow state.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 mb-3 font-mono font-bold text-xs">
                03
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Chat Rot & Context Degradation</h3>
              <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed">
                After 15 messages, LLM context compaction sets in. Models loop on rejected solutions, forcing you to wipe the thread and lose your working state.
              </p>
            </div>
          </div>
        </section>

        {/* 3-Tier State Architecture */}
        <section className="mb-14 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]/60 p-6 sm:p-8">
          <div className="max-w-xl mb-6">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
              System Architecture
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] mt-1">
              How Meto Solves Context Fragmentation
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Rather than stuffing raw files into a prompt, Meto structures developer identity into a deterministic three-tier state protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] mb-2">
                <Layers className="h-4 w-4 text-amber-500" />
                Tier 1: Static Directives
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Verified framework versions, styling systems, testing libraries, and strict typing constraints that apply across all projects.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] mb-2">
                <Cpu className="h-4 w-4 text-emerald-500" />
                Tier 2: Persistent Memory
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Architectural Decision Records (ADRs), rejected libraries, and historical bug fixes. The AI remembers why you chose or rejected an approach.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <div className="flex items-center gap-2 text-xs font-semibold text-[var(--text)] mb-2">
                <RefreshCw className="h-4 w-4 text-blue-500" />
                Tier 3: Active State
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Live task queues, mid-session handoffs, and multi-agent directives accessible across terminal and editor via Model Context Protocol.
              </p>
            </div>
          </div>
        </section>

        {/* Supported AI Ecosystem Grid */}
        <section className="mb-14">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)] mb-4 text-center">
            One Setup. Continuously Synchronized Everywhere.
          </h2>
          <p className="text-xs sm:text-sm text-[var(--muted)] text-center max-w-xl mx-auto mb-8">
            Update your profile once in Meto. Every connected IDE and agent queries your latest directives automatically.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                className="flex items-center gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-3 text-xs font-medium text-[var(--text)]"
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
        <section className="mb-14">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)] mb-6 text-center">
            Manual Prompting vs Meto Context Protocol
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text)]">
                  <th className="py-3 px-4 font-semibold">Capability</th>
                  <th className="py-3 px-4 font-semibold text-[var(--muted)]">Manual Copy-Pasting</th>
                  <th className="py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">Meto Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr className="hover:bg-[var(--surface)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">Multi-Tool Synchronization</td>
                  <td className="py-3.5 px-4 text-[var(--muted)]">Zero (each tool is an island)</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Automatic via MCP & live API
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">Chat Rot Recovery</td>
                  <td className="py-3.5 px-4 text-[var(--muted)]">Must re-type prompts from scratch</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Instant re-anchor in new chat
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">Token Efficiency</td>
                  <td className="py-3.5 px-4 text-[var(--muted)]">Bloats entire system prompt</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Lazy-loaded tools on-demand
                  </td>
                </tr>
                <tr className="hover:bg-[var(--surface)]/50 transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[var(--text)]">Directives Verification</td>
                  <td className="py-3.5 px-4 text-[var(--muted)]">None (contradictions common)</td>
                  <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    Context Score & gap audit engine
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
            Connect all your AI tools to one source of truth
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            Create your Meto profile in 2 minutes. Free forever for developers.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              Start for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
