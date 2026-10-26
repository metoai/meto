import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Cpu, ExternalLink, Sparkles, Terminal } from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { INTEGRATIONS_LIST } from "@/lib/integrations-data";
import { getSiteUrl } from "@/lib/site";
import { AI_BRAND_ICON_CLASS } from "@/lib/ai-brand-icon";

export const metadata: Metadata = {
  title: "AI Coding Assistant & IDE Integrations — Meto",
  description:
    "Connect your Meto developer profile to Cursor, Windsurf, Google Antigravity, Claude, VS Code, and ChatGPT via Model Context Protocol (MCP).",
  alternates: {
    canonical: `${getSiteUrl()}/integrations`,
  },
  openGraph: {
    title: "AI Coding Assistant & IDE Integrations — Meto",
    description:
      "Connect your Meto developer profile to Cursor, Windsurf, Google Antigravity, Claude, VS Code, and ChatGPT via Model Context Protocol (MCP).",
    url: `${getSiteUrl()}/integrations`,
    siteName: "Meto",
    type: "website",
  },
};

export default function IntegrationsPage() {
  const siteUrl = getSiteUrl();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Meto AI Integrations Directory",
    description:
      "Guides and MCP connection specifications for integrating Meto with modern AI IDEs and assistants.",
    url: `${siteUrl}/integrations`,
    hasPart: INTEGRATIONS_LIST.map((item) => ({
      "@type": "TechArticle",
      name: item.metaTitle,
      url: `${siteUrl}/integrations/${item.slug}`,
      description: item.summary,
    })),
  };

  return (
    <MarketingLayout showFooter contentAlign="top">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">Integrations</span>
        </nav>

        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] mb-4">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Model Context Protocol & Custom Prompts
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            Connect Meto to Any AI Coding Assistant
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Tell Meto once about your stack, preferences, and architecture. Your favorite tools automatically query your verified profile in real time.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INTEGRATIONS_LIST.map((item) => (
            <Link
              key={item.slug}
              href={`/integrations/${item.slug}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 transition-all duration-200 hover:border-[var(--border)] hover:shadow-sm hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] transition-colors group-hover:border-[var(--border)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.iconUrl}
                      alt={item.name}
                      width={22}
                      height={22}
                      className={`${AI_BRAND_ICON_CLASS} shrink-0 object-contain`}
                      loading="lazy"
                    />
                  </div>
                  <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface)]/80 px-2 py-0.5 text-[11px] font-mono text-[var(--muted)]">
                    {item.badge}
                  </span>
                </div>

                <h2 className="text-base font-semibold tracking-tight text-[var(--text)] group-hover:text-amber-500 transition-colors">
                  {item.name}
                </h2>
                <p className="mt-1.5 text-xs text-[var(--muted)] leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-medium text-[var(--text-secondary)] group-hover:text-[var(--text)]">
                <span>View Setup Guide</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        {/* Feature comparison teaser */}
        <div className="mt-16 rounded-2xl border border-[var(--border-subtle)] bg-[var(--surface)]/60 p-6 sm:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-xl">
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500 font-semibold">
                Dynamic MCP vs Static Files
              </span>
              <h2 className="text-xl font-bold tracking-tight text-[var(--text)] mt-1">
                Tired of managing outdated .cursorrules across 20 repositories?
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
                Read our in-depth comparison on why hardcoded rule files lead to context drift, and how dynamic Model Context Protocol servers solve it permanently.
              </p>
            </div>
            <Link
              href="/compare/cursorrules-vs-meto"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90"
            >
              Read Comparison
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
