import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar, Clock, Sparkles, Tag } from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { BLOG_POSTS } from "@/lib/blog-data";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  title: "Engineering Blog & AI Context Guides — Meto",
  description:
    "In-depth technical guides on Cursor rules, CLAUDE.md migration, Model Context Protocol (MCP), and multi-IDE AI context synchronization.",
  alternates: {
    canonical: `${siteUrl}/blog`,
  },
  openGraph: {
    title: "Engineering Blog & AI Context Guides — Meto",
    description:
      "In-depth technical guides on Cursor rules, CLAUDE.md migration, Model Context Protocol (MCP), and multi-IDE AI context synchronization.",
    url: `${siteUrl}/blog`,
    siteName: "Meto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Engineering Blog & AI Context Guides — Meto",
    description:
      "In-depth technical guides on Cursor rules, CLAUDE.md migration, Model Context Protocol (MCP), and multi-IDE AI context synchronization.",
  },
};

export default function BlogIndexPage() {
  return (
    <MarketingLayout showFooter contentAlign="top">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">Blog</span>
        </nav>

        {/* Header Banner */}
        <div className="mb-12 border-b border-[var(--border-subtle)] pb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)] mb-3">
            <BookOpen className="h-3.5 w-3.5 text-[var(--primary)]" />
            Engineering & Architecture Guides
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            AI Context, Rules & Developer Identity
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--muted)] max-w-2xl leading-relaxed">
            Practical, in-depth architectural guides on synchronizing Cursor rules, mastering CLAUDE.md, and building drift-free developer memory with Model Context Protocol.
          </p>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-6 transition-all duration-200 hover:border-[var(--primary)]/40 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[var(--muted)] mb-3">
                  <span className="font-mono uppercase font-semibold text-[var(--primary)]">
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <h2 className="text-lg font-bold text-[var(--text)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-3 text-sm text-[var(--muted)] line-clamp-3 leading-relaxed">
                  {post.subtitle}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                  <Calendar className="h-3 w-3" />
                  <time dateTime={post.publishedAt}>{post.publishedAt}</time>
                </div>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)] group-hover:translate-x-0.5 transition-transform"
                >
                  Read guide
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </MarketingLayout>
  );
}
