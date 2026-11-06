import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Layers,
  Sparkles,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { RuleDetailClient } from "@/components/rules/rule-detail-client";
import { getRuleBySlug, RULES_LIST } from "@/lib/rules-data";
import { getSiteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
  return RULES_LIST.map((rule) => ({
    slug: rule.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const rule = getRuleBySlug(resolvedParams.slug);

  if (!rule) {
    return { title: "Rule Not Found — Meto" };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/rules/${rule.slug}`;

  return {
    title: rule.metaTitle,
    description: rule.metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: rule.metaTitle,
      description: rule.metaDescription,
      url: pageUrl,
      siteName: "Meto",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: rule.metaTitle,
      description: rule.metaDescription,
    },
  };
}

export default async function RuleDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const rule = getRuleBySlug(resolvedParams.slug);

  if (!rule) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/rules/${rule.slug}`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Rules Directory",
        item: `${siteUrl}/rules`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: rule.title,
        item: pageUrl,
      },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: rule.title,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    url: pageUrl,
    description: rule.description,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: rule.faq.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Navigation Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/rules" className="hover:text-[var(--text)] transition-colors">
            Rules
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium truncate max-w-xs">{rule.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10 border-b border-[var(--border-subtle)] pb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-md border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-2.5 py-0.5 font-mono text-xs font-semibold uppercase text-[var(--primary)]">
              {rule.category}
            </span>
            <span className="text-xs text-[var(--muted)]">•</span>
            <span className="text-xs text-[var(--muted)] font-mono">Cursor .mdc & CLAUDE.md</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] leading-tight">
            {rule.title}
          </h1>

          <p className="mt-3.5 text-base sm:text-lg text-[var(--muted)] leading-relaxed max-w-3xl">
            {rule.description}
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            {rule.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-[var(--surface)] px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)] border border-[var(--border-subtle)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Core Directives Checklist */}
        <section className="mb-10 rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <h2 className="text-sm font-mono font-semibold uppercase tracking-wider text-[var(--text)]">
              Core Architectural Directives Enforced
            </h2>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[var(--text-secondary)]">
            {rule.keyDirectives.map((d, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0 mt-2" />
                <span className="leading-relaxed">{d}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Interactive Code Viewer & Copy Component */}
        <RuleDetailClient rule={rule} />

        {/* FAQ Section */}
        {rule.faq && rule.faq.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-xl font-bold text-[var(--text)]">Frequently Asked Questions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rule.faq.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5"
                >
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-2">{f.question}</h3>
                  <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back Link */}
        <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--muted)]">
          <Link
            href="/rules"
            className="inline-flex items-center gap-1.5 hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all AI rules
          </Link>
          <Link
            href="/tools/cursor-to-claude"
            className="hover:text-[var(--primary)] transition-colors"
          >
            Convert between rule formats with our free tool →
          </Link>
        </div>
      </article>
    </MarketingLayout>
  );
}
