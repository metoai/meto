import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  GitBranch,
  ShieldAlert,
  Terminal,
  Users,
  Workflow,
  XCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shared AI Coding Standards for Engineering Teams | Meto",
  description:
    "Align your entire engineering team on identical AI standards. Prevent rule drift and contradictory code patterns across Cursor, Claude Code, Windsurf, and Copilot.",
  alternates: {
    canonical: `${getSiteUrl()}/solutions/team-context-sync`,
  },
  openGraph: {
    title: "Shared AI Coding Standards for Engineering Teams — Meto",
    description:
      "One source of truth for your team's AI coding assistants. Centralize architectural decisions, enforce negative knowledge, and compile rules across all repositories.",
    url: `${getSiteUrl()}/solutions/team-context-sync`,
    siteName: "Meto",
    type: "article",
  },
};

export default function TeamContextSyncPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/solutions/team-context-sync`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${siteUrl}/solutions` },
      { "@type": "ListItem", position: 3, name: "Team Context Sync", item: pageUrl },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Shared AI Coding Standards for Engineering Teams: Preventing Rule Drift in Multi-Tool Environments",
    description:
      "Architectural guide on how engineering organizations maintain consistent coding standards, architectural decision records (ADRs), and negative constraints across disparate AI assistants.",
    author: { "@type": "Organization", name: "Meto", url: siteUrl },
    publisher: { "@type": "Organization", name: "Meto", url: siteUrl },
    url: pageUrl,
  };

  const faqList = [
    {
      q: "How does Meto ensure all developers on a team share the same AI context?",
      a: "Meto acts as a single architectural compiler. When a team lead or architect defines project ADRs, approved libraries, or forbidden patterns in Meto, running 'npx meto-cli sync' updates all local .cursor/rules, CLAUDE.md, and .windsurfrules files simultaneously.",
    },
    {
      q: "Does Meto replace our existing code reviews or linters?",
      a: "No. Meto shifts quality upstream into the AI generation phase. Rather than catching architectural errors or forbidden imports during human code review or CI linter runs, your team's coding assistants are prevented from generating those mistakes in the first place.",
    },
    {
      q: "What happens when team members use different IDEs (some Cursor, some Claude Code, some Windsurf)?",
      a: "That is the primary reason teams adopt Meto. Because Meto compiles to all target formats (.cursor/rules/*.mdc, CLAUDE.md, .windsurfrules, and .github/copilot-instructions.md), every developer's assistant behaves with identical architectural consistency regardless of editor preference.",
    },
    {
      q: "Can developers keep their personal preferences separate from team standards?",
      a: "Yes. Meto cleanly separates personal developer identity (such as shell quirks, keybindings, or personal linting shortcuts) from shared repository constraints. Personal preferences never pollute team Git commits.",
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
          <span className="text-[var(--text)]">Team Context Sync</span>
        </nav>

        {/* Header Banner */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <Users className="h-3 w-3 text-amber-500" />
                Team & Organization AI Alignment
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)] leading-tight">
              Shared AI Coding Standards for Engineering Teams
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Stop 10 engineers from getting 10 different code patterns from Cursor, Claude Code, and Windsurf. Centralize architectural decisions, enforce negative knowledge, and synchronize rules across all repositories.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Start Team Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              <span>View Pricing</span>
            </Link>
          </div>
        </header>

        {/* Direct Answer Box for AEO & Search Engines */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 mb-10 border-l-2 border-l-[var(--primary)]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Direct Answer: Team AI Synchronization
          </div>
          <p className="text-sm text-[var(--text)] font-medium leading-relaxed">
            Meto serves as a centralized architectural compiler for engineering teams. By converting technical guidelines, package constraints, and anti-patterns into deterministic rule files (.cursor/rules, CLAUDE.md, .windsurfrules) and live Model Context Protocol (MCP) endpoints, Meto ensures every developer&apos;s AI assistant generates code that adheres to team standards from the first prompt.
          </p>
        </div>

        {/* The Problem: The Chaos of Uncoordinated AIs */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            The Problem: Architectural Chaos in AI-Powered Teams
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <span className="text-xs font-mono text-red-500 uppercase font-semibold">Without Meto</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1.5 mb-3">
                Fragmented AI Conventions
              </h3>
              <ul className="space-y-2 text-xs text-[var(--muted)]">
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>Senior engineers write custom prompts, while junior engineers get conflicting legacy patterns.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>Cursor users adhere to .cursorrules while Claude Code users follow outdated CLAUDE.md files.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>Forbidden packages and deprecated utilities re-enter the codebase via AI auto-completions.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <span className="text-xs font-mono text-amber-500 uppercase font-semibold">With Meto</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1.5 mb-3">
                Unified Architectural Alignment
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>One canonical specification compiles to Cursor, Claude Code, Windsurf, and Copilot.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Negative Knowledge blocks rejected libraries and antipatterns before code is written.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Automated CLI command (&apos;npx meto-cli sync&apos;) can be enforced in CI or Git hooks.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4 Core Pillars for Teams */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Workflow className="h-4 w-4 text-amber-500" />
            How Meto Unifies Team Development
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Terminal className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-[var(--text)]">CI/CD & Pre-commit Parity</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Add &apos;npx meto-cli sync --check&apos; to your CI pipeline or husky pre-commit hook to verify that all repository rule files match the canonical team architecture.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Multi-Repository Sync</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                When your team updates from Tailwind v3 to v4 or migrates from Jest to Vitest, update the directive once in Meto to propagate across dozens of microservices instantly.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Enforced Anti-Patterns</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Record negative knowledge (e.g. &apos;Never use lodash directly&apos; or &apos;Never import server actions in client components&apos;) to eliminate recurring PR review comments.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Role & Stack Scoping</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Scoped rules ensure backend engineers receive database conventions while frontend engineers receive design system directives without prompt clutter.
              </p>
            </div>
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
            Align your engineering team on AI standards today
          </h2>
          <p className="mt-1.5 text-xs text-[var(--muted)] max-w-md mx-auto">
            Set up your organization in 2 minutes. Free for individual contributors, flexible seats for teams.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Get Started</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/solutions/sync-rules"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              <span>Explore Rule Sync</span>
            </Link>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
