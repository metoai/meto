import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Check, Copy, FileCode, Layers, ShieldCheck, Sparkles, Terminal, Zap } from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { RULES_LIST } from "@/lib/rules-data";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "The Open AI Rules Directory — Best Cursor Rules & CLAUDE.md Templates",
  description:
    "Curated collection of production-grade Cursor rules (.cursor/rules/*.mdc) and CLAUDE.md templates for Next.js, TypeScript, FastAPI, Tailwind, and Supabase. Copy or sync via Meto MCP.",
  alternates: {
    canonical: `${siteUrl}/rules`,
  },
  openGraph: {
    title: "The Open AI Rules Directory — Best Cursor Rules & CLAUDE.md Templates",
    description:
      "Curated collection of production-grade Cursor rules (.cursor/rules/*.mdc) and CLAUDE.md templates for Next.js, TypeScript, FastAPI, Tailwind, and Supabase. Copy or sync via Meto MCP.",
    url: `${siteUrl}/rules`,
    siteName: "Meto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Open AI Rules Directory — Best Cursor Rules & CLAUDE.md Templates",
    description:
      "Curated collection of production-grade Cursor rules (.cursor/rules/*.mdc) and CLAUDE.md templates for Next.js, TypeScript, FastAPI, Tailwind, and Supabase. Copy or sync via Meto MCP.",
  },
};

export default function RulesDirectoryPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "The Open AI Rules Directory for Cursor and Claude Code",
    description:
      "Curated collection of production-grade Cursor rules (.cursor/rules/*.mdc) and CLAUDE.md templates for modern development stacks.",
    url: `${siteUrl}/rules`,
    hasPart: RULES_LIST.map((rule) => ({
      "@type": "SoftwareApplication",
      name: rule.title,
      url: `${siteUrl}/rules/${rule.slug}`,
      applicationCategory: "DeveloperApplication",
      description: rule.description,
    })),
  };

  return (
    <MarketingLayout showFooter contentAlign="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">Rules Directory</span>
        </nav>

        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-mono font-semibold text-[var(--primary)] mb-3">
            <Layers className="h-3.5 w-3.5" />
            The Open AI Rules Catalog • Free .mdc & CLAUDE.md
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] leading-tight">
            Production-Ready AI Rules for Cursor & Claude Code
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Stop starting with blank prompts. Copy battle-tested rules for Next.js, TypeScript, FastAPI, and Supabase—or sync them dynamically across all your repos with Meto MCP.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/tools/cursor-to-claude"
              className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-mono font-medium text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--card)] active:scale-[0.97] transition-all"
            >
              <Terminal className="h-3 w-3" />
              Try Format Converter Tool →
            </Link>
          </div>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RULES_LIST.map((rule) => (
            <div
              key={rule.slug}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-6 transition-all duration-200 hover:border-[var(--primary)]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-3">
                  <span className="rounded-md border border-[var(--primary)]/20 bg-[var(--primary)]/10 px-2 py-0.5 font-mono font-semibold text-[var(--primary)] text-[11px] uppercase">
                    {rule.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--muted)]">
                    <span>.mdc & CLAUDE.md</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                  <Link href={`/rules/${rule.slug}`}>
                    {rule.title}
                  </Link>
                </h2>

                <p className="mt-2.5 text-xs sm:text-sm text-[var(--muted)] leading-relaxed line-clamp-3">
                  {rule.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {rule.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-[var(--surface)] px-2 py-0.5 text-[11px] font-mono text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <Link
                  href={`/rules/${rule.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--primary)] group-hover:translate-x-0.5 transition-transform"
                >
                  View & Copy Rules
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Value Proposition CTA */}
        <section className="mt-16 rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/15 via-[var(--surface)] to-[var(--primary)]/5 p-8 text-center sm:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--primary)]">
              The Meto Advantage
            </span>
            <h3 className="text-2xl font-bold text-[var(--text)]">
              Never Copy-Paste Rule Files Again
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              When you upgrade a library or change a preference, static rules committed across 20 repositories silently rot.
              Connect Meto to Cursor, Claude Code, and Windsurf via Model Context Protocol to serve live, canonical rules everywhere in real time.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Sync Rules via Meto MCP
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </MarketingLayout>
  );
}
