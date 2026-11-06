import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HelpCircle, Sparkles, Wrench } from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { RuleConverterTool } from "@/components/tools/rule-converter-tool";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();
const pageUrl = `${siteUrl}/tools/cursor-to-claude`;

export const metadata: Metadata = {
  title: "Convert Cursor Rules to CLAUDE.md & Windsurf — Free Online Converter",
  description:
    "Free in-browser developer tool to convert Cursor .cursorrules and .mdc files to Claude Code CLAUDE.md, .windsurfrules, and GitHub Copilot instructions with real-time token audit.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "Convert Cursor Rules to CLAUDE.md & Windsurf — Free Online Converter",
    description:
      "Free in-browser developer tool to convert Cursor .cursorrules and .mdc files to Claude Code CLAUDE.md, .windsurfrules, and GitHub Copilot instructions with real-time token audit.",
    url: pageUrl,
    siteName: "Meto",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Cursor Rules to CLAUDE.md & Windsurf — Free Online Converter",
    description:
      "Free in-browser developer tool to convert Cursor .cursorrules and .mdc files to Claude Code CLAUDE.md, .windsurfrules, and GitHub Copilot instructions with real-time token audit.",
  },
};

export default function CursorToClaudePage() {
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
        name: "Developer Tools",
        item: `${siteUrl}/tools/cursor-to-claude`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Cursor to CLAUDE.md Converter",
        item: pageUrl,
      },
    ],
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Cursor Rules to CLAUDE.md Converter",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "All",
    url: pageUrl,
    description:
      "Convert Cursor .cursorrules and .mdc files into Claude Code CLAUDE.md, .windsurfrules, and Copilot format with live token counting.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does the Cursor to CLAUDE.md converter work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The tool strips Cursor-specific YAML frontmatter (such as globs: and alwaysApply:) and restructures the directives into clean, imperative markdown compatible with Claude Code CLI and Anthropic models.",
        },
      },
      {
        "@type": "Question",
        name: "Does my code or rule data get sent to a remote server?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. All conversion, token counting, and rule linter audits occur 100% locally in your web browser. Nothing is uploaded or logged.",
        },
      },
      {
        "@type": "Question",
        name: "How can I automatically sync rules across Cursor, Claude, and Windsurf without manual copying?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can connect your workspaces to Meto's Model Context Protocol (MCP) server. Meto serves your canonical developer rules dynamically across all supported IDEs with zero manual file duplication.",
        },
      },
    ],
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

      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Navigation Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--muted)]">Tools</span>
          <span>/</span>
          <span className="text-[var(--text)] font-medium">Cursor to CLAUDE.md Converter</span>
        </nav>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs font-mono font-semibold text-[var(--primary)] mb-3">
            <Wrench className="h-3.5 w-3.5" />
            Free Developer Utility • Zero Data Stored
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--text)] leading-tight">
            Convert Cursor Rules to CLAUDE.md & Windsurf
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--muted)] leading-relaxed">
            Instantly translate <code className="text-xs font-mono bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">.cursorrules</code> and <code className="text-xs font-mono bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">.mdc</code> files into Claude Code <code className="text-xs font-mono bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">CLAUDE.md</code>, <code className="text-xs font-mono bg-[var(--surface)] px-1.5 py-0.5 rounded border border-[var(--border-subtle)]">.windsurfrules</code>, and Copilot instructions.
          </p>
        </div>

        {/* Converter Tool Interactive Component */}
        <RuleConverterTool />

        {/* FAQ Section */}
        <section className="mt-16 pt-10 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-2 mb-6">
            <HelpCircle className="h-5 w-5 text-[var(--primary)]" />
            <h2 className="text-xl font-bold text-[var(--text)]">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
                Why do Cursor rules need conversion for Claude Code?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                Cursor uses structured YAML frontmatter (<code className="font-mono">globs: ...</code>) to attach rules to specific file patterns. Claude Code reads a single root <code className="font-mono">CLAUDE.md</code> file without frontmatter. Converting strips the syntax while retaining the core technical directives.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <h3 className="text-sm font-semibold text-[var(--text)] mb-2">
                What does the Context Health Score measure?
              </h3>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                Our linter evaluates token bloat, the presence of explicit negative constraints (&quot;Do not use X&quot;), concrete filepath references, and penalizes conversational AI persona fluff that wastes context budget.
              </p>
            </div>
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--muted)]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 hover:text-[var(--text)] transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Meto Home
          </Link>
          <Link
            href="/blog/claude-md-vs-cursorrules-guide"
            className="hover:text-[var(--primary)] transition-colors"
          >
            Read: CLAUDE.md vs .cursorrules Architecture Guide →
          </Link>
        </div>
      </div>
    </MarketingLayout>
  );
}
