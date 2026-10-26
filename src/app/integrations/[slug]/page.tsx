import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { IntegrationSnippetCopy } from "@/components/marketing/integration-snippet-copy";
import {
  INTEGRATIONS_LIST,
  getIntegrationBySlug,
} from "@/lib/integrations-data";
import { getSiteUrl } from "@/lib/site";
import { AI_BRAND_ICON_CLASS } from "@/lib/ai-brand-icon";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
  return INTEGRATIONS_LIST.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const integration = getIntegrationBySlug(resolvedParams.slug);

  if (!integration) {
    return { title: "Integration Not Found — Meto" };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/integrations/${integration.slug}`;

  return {
    title: integration.metaTitle,
    description: integration.metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: integration.metaTitle,
      description: integration.metaDescription,
      url: pageUrl,
      siteName: "Meto",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: integration.metaTitle,
      description: integration.metaDescription,
    },
  };
}

export default async function IntegrationDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const item = getIntegrationBySlug(resolvedParams.slug);

  if (!item) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/integrations/${item.slug}`;

  // Demo snippet with standard placeholder credentials
  const demoSnippet = item.getSnippet(
    `${siteUrl}/api/mcp/your-username`,
    "meto_mcp_your_personal_token"
  );

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
        name: "Integrations",
        item: `${siteUrl}/integrations`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: item.name,
        item: pageUrl,
      },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to Connect Meto to ${item.name}`,
    description: item.summary,
    step: item.steps.map((s, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: s.title,
      text: s.description,
    })),
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
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
          <Link href="/integrations" className="hover:text-[var(--text)] transition-colors">
            Integrations
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">{item.name}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-[var(--border-subtle)] pb-8 mb-10">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.iconUrl}
                alt={item.name}
                width={30}
                height={30}
                className={`${AI_BRAND_ICON_CLASS} shrink-0 object-contain`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text)]">
                  {item.name}
                </h1>
                <span className="rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 text-xs font-mono text-[var(--muted)]">
                  {item.badge}
                </span>
              </div>
              <p className="mt-1.5 text-sm sm:text-base text-[var(--muted)] leading-relaxed">
                {item.tagline}
              </p>
            </div>
          </div>

          <Link
            href="/auth/signup"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-opacity hover:opacity-90"
          >
            Connect in Meto
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Problem vs Solution Callout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400 mb-2">
              <Zap className="h-4 w-4" />
              The Challenge Without Meto
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {item.painPoint}
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <CheckCircle2 className="h-4 w-4" />
              The Meto Solution
            </div>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {item.solution}
            </p>
          </div>
        </div>

        {/* Key Benefits */}
        <section className="mb-12">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--text)] mb-4">
            Key Advantages with {item.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {item.keyBenefits.map((b) => (
              <div
                key={b}
                className="flex items-start gap-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-3.5 text-xs sm:text-sm text-[var(--text-secondary)]"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-Step Setup Instructions */}
        <section className="mb-14">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)] mb-6">
            Step-by-Step Configuration Guide
          </h2>
          <div className="space-y-6">
            {item.steps.map((s, index) => (
              <div
                key={s.title}
                className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 sm:p-6 shadow-xs"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    {index + 1}
                  </span>
                  <h3 className="text-base font-semibold text-[var(--text)]">
                    {s.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed pl-9">
                  {s.description}
                </p>

                {s.code ? (
                  <div className="pl-9 mt-3">
                    <IntegrationSnippetCopy
                      snippet={s.code}
                      filename={s.filename}
                      language={s.language}
                    />
                  </div>
                ) : null}

                {/* If it's a step pointing to the general snippet */}
                {index === 1 && demoSnippet ? (
                  <div className="pl-9 mt-3">
                    <IntegrationSnippetCopy
                      snippet={demoSnippet}
                      filename={s.filename || "mcp_config.json"}
                      language="json"
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        {/* Frequently Asked Questions */}
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

        {/* Bottom CTA Box */}
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-gradient-to-b from-[var(--surface)] to-[var(--card)] p-6 sm:p-8 text-center">
          <h2 className="text-xl font-bold tracking-tight text-[var(--text)]">
            Ready to give {item.name} persistent memory?
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[var(--muted)] max-w-lg mx-auto leading-relaxed">
            Create your Meto profile in 2 minutes. Fill in your stack once, and never repeat your setup again.
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
              href="/integrations"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              All Integrations
            </Link>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
