import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  HelpCircle,
  Share2,
  Terminal,
  User,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { BLOG_POSTS, getBlogPostBySlug } from "@/lib/blog-data";
import { getSiteUrl } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    return { title: "Article Not Found — Meto" };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/blog/${post.slug}`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: pageUrl,
      siteName: "Meto",
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const post = getBlogPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/blog/${post.slug}`;

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
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: pageUrl,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.headline,
    description: post.metaDescription,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
    },
    publisher: {
      "@type": "Organization",
      name: "Meto",
      url: siteUrl,
      logo: `${siteUrl}/icon-512x512.png`,
    },
    url: pageUrl,
    keywords: post.tags.join(", "),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((f) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
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
          <Link href="/blog" className="hover:text-[var(--text)] transition-colors">
            Blog
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Post Header */}
        <header className="mb-10 border-b border-[var(--border-subtle)] pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)] mb-4">
            <span className="rounded-md border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-2.5 py-0.5 font-mono font-semibold uppercase text-[var(--primary)]">
              {post.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt}>{post.publishedAt}</time>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{post.readTime}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              <span>{post.author.name}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] leading-tight">
            {post.headline}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            {post.subtitle}
          </p>
        </header>

        {/* Direct Answer Block (AEO / Answer Engine Optimization) */}
        {post.directAnswer && (
          <section className="mb-10 rounded-xl border-l-2 border-[var(--primary)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--primary)]">
                Direct Answer & Quick Takeaway
              </span>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-[var(--text)]">
              {post.directAnswer}
            </p>
          </section>
        )}

        {/* Table of Contents */}
        {post.tableOfContents && post.tableOfContents.length > 0 && (
          <div className="mb-10 rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--muted)]">
              Table of Contents
            </span>
            <ul className="mt-3 space-y-1.5 text-sm">
              {post.tableOfContents.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors"
                  >
                    {item.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Article Body */}
        <div className="space-y-10 text-[var(--text)] leading-relaxed">
          {post.sections.map((section, idx) => (
            <section key={section.id || idx} id={section.id} className="scroll-mt-20">
              {section.heading && (
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)] mb-4">
                  {section.heading}
                </h2>
              )}

              <div className="space-y-4 text-base text-[var(--text-secondary)] leading-relaxed">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>

              {section.callout && (
                <div
                  className={`mt-5 rounded-lg border p-4 text-sm ${
                    section.callout.type === "warning"
                      ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                      : "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--text)]"
                  }`}
                >
                  <p className="leading-relaxed">{section.callout.text}</p>
                </div>
              )}

              {section.codeBlock && (
                <div className="mt-5 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface-code)] overflow-hidden">
                  {section.codeBlock.filename && (
                    <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--card)] px-4 py-2 text-xs font-mono text-[var(--muted)]">
                      <Terminal className="h-3.5 w-3.5" />
                      <span>{section.codeBlock.filename}</span>
                    </div>
                  )}
                  <pre className="p-4 text-xs sm:text-sm font-mono overflow-x-auto text-neutral-200">
                    <code>{section.codeBlock.code}</code>
                  </pre>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* FAQ Section */}
        {post.faq && post.faq.length > 0 && (
          <section className="mt-14 pt-10 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="h-5 w-5 text-[var(--primary)]" />
              <h2 className="text-xl font-bold text-[var(--text)]">Frequently Asked Questions</h2>
            </div>
            <div className="space-y-4">
              {post.faq.map((f, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5"
                >
                  <h3 className="text-base font-semibold text-[var(--text)] mb-2">{f.question}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bottom CTA Banner */}
        <section className="mt-14 rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-r from-[var(--primary)]/10 via-[var(--surface)] to-[var(--primary)]/5 p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--text)]">
            Stop Copy-Pasting AI Rules. Sync Them Live with Meto.
          </h3>
          <p className="mt-2 text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto">
            Connect Cursor, Claude Code, Windsurf, and Copilot to a single Model Context Protocol server.
            One developer identity, zero rule drift.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/integrations/cursor"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-5 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--card)] active:scale-[0.97] transition-all"
            >
              Cursor MCP Setup Guide
            </Link>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-[var(--border-subtle)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to all engineering guides
          </Link>
        </div>
      </article>
    </MarketingLayout>
  );
}
