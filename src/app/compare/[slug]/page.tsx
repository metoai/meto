import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Scale,
  Sparkles,
  XCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import {
  COMPARISONS_LIST,
  getComparisonBySlug,
} from "@/lib/comparisons-data";
import { getSiteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
  return COMPARISONS_LIST.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const comparison = getComparisonBySlug(resolvedParams.slug);

  if (!comparison) {
    return { title: "Comparison Not Found — Meto" };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/compare/${comparison.slug}`;

  return {
    title: comparison.metaTitle,
    description: comparison.metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: comparison.metaTitle,
      description: comparison.metaDescription,
      url: pageUrl,
      siteName: "Meto",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: comparison.metaTitle,
      description: comparison.metaDescription,
    },
  };
}

export default async function ComparisonDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const item = getComparisonBySlug(resolvedParams.slug);

  if (!item) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/compare/${item.slug}`;

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
        name: "Comparisons",
        item: `${siteUrl}/compare`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.title,
        item: pageUrl,
      },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: item.faq.map((f) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <article className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Navigation Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">Comparison</span>
          <span>/</span>
          <span className="text-[var(--text)] font-medium truncate">{item.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] mb-4">
            <Scale className="h-3.5 w-3.5 text-amber-500" />
            Architectural Comparison
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            {item.headline}
          </h1>
          <p className="mt-3.5 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            {item.subtitle}
          </p>
        </div>

        {/* Side by Side Pros / Cons Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-14">
          {/* Traditional Way */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-6">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--muted)]">
              Traditional Method
            </span>
            <h2 className="text-lg font-bold text-[var(--text)] mt-1 mb-4">
              {item.traditionalLabel}
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                  Advantages
                </p>
                <ul className="space-y-2 text-xs text-[var(--muted)]">
                  {item.traditionalPros.map((pro) => (
                    <li key={pro} className="flex items-start gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
                  Limitations & Pain Points
                </p>
                <ul className="space-y-2 text-xs text-[var(--muted)]">
                  {item.traditionalCons.map((con) => (
                    <li key={con} className="flex items-start gap-2">
                      <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Meto Way */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 shadow-xs">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-500">
              Modern Solution
            </span>
            <h2 className="text-lg font-bold text-[var(--text)] mt-1 mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Dynamic Meto MCP Identity
            </h2>

            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
                Why Developers Choose Meto
              </p>
              <ul className="space-y-3 text-xs sm:text-sm text-[var(--text-secondary)]">
                {item.metoPros.map((pro) => (
                  <li key={pro} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <section className="mb-14">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)] mb-6 text-center">
            Side-by-Side Capability Matrix
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)]">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text)]">
                  <th className="py-3 px-4 font-semibold">Feature</th>
                  <th className="py-3 px-4 font-semibold text-[var(--muted)]">{item.traditionalLabel}</th>
                  <th className="py-3 px-4 font-semibold text-amber-600 dark:text-amber-400">Meto MCP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                {item.featuresMatrix.map((row) => (
                  <tr key={row.feature} className="hover:bg-[var(--surface)]/50 transition-colors">
                    <td className="py-3.5 px-4 font-medium text-[var(--text)]">{row.feature}</td>
                    <td className="py-3.5 px-4 text-[var(--muted)]">{row.traditional}</td>
                    <td className="py-3.5 px-4 font-medium text-[var(--text-secondary)] flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      {row.meto}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Detailed Breakdown Sections */}
        <section className="mb-14 space-y-8">
          {item.detailedBreakdown.map((section) => (
            <div key={section.heading} className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-6">
              <h2 className="text-lg font-bold tracking-tight text-[var(--text)] mb-2.5">
                {section.heading}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </section>

        {/* FAQ */}
        {item.faq.length > 0 ? (
          <section className="mb-14">
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text)] mb-4 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-amber-500" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {item.faq.map((f) => (
                <div
                  key={f.question}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4 sm:p-5"
                >
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    {f.question}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                    {f.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* CTA */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-b from-[var(--surface)] to-[var(--card)] p-6 sm:p-8 text-center">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
            Upgrade your AI workflow from static rules to live MCP
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            Create your Meto profile in 2 minutes. Connect to Cursor with one click.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
            >
              Get Started for Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/integrations/cursor"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              View Cursor Guide
            </Link>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
