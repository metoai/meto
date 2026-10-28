import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Layers,
  MessageSquare,
  ShieldAlert,
  Sliders,
  Sparkles,
  Workflow,
  XCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Universal Custom Instructions for ChatGPT, Claude & Gemini | Meto",
  description:
    "Write your custom instructions once in Meto and sync them to ChatGPT, Claude.ai, and Google Gemini. Eliminate repetitive prompt writing across AI chatbots.",
  alternates: {
    canonical: `${getSiteUrl()}/solutions/universal-custom-instructions`,
  },
  openGraph: {
    title: "Universal Custom Instructions for ChatGPT, Claude & Gemini — Meto",
    description:
      "One central hub to manage your custom instructions across all major AI chatbots. Platform-tuned exports, negative prompts, and zero repetitive typing.",
    url: `${getSiteUrl()}/solutions/universal-custom-instructions`,
    siteName: "Meto",
    type: "article",
  },
};

export default function UniversalCustomInstructionsPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/solutions/universal-custom-instructions`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${siteUrl}/solutions` },
      { "@type": "ListItem", position: 3, name: "Universal Custom Instructions", item: pageUrl },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Universal Custom Instructions: How to Sync AI Persona and Directives Across Multiple Chatbots",
    description:
      "A complete guide to managing unified custom instructions, tone preferences, and negative constraints across OpenAI ChatGPT, Anthropic Claude.ai, and Google Gemini.",
    author: { "@type": "Organization", name: "Meto", url: siteUrl },
    publisher: { "@type": "Organization", name: "Meto", url: siteUrl },
    url: pageUrl,
  };

  const faqList = [
    {
      q: "How do Universal Custom Instructions differ from standard ChatGPT instructions?",
      a: "Standard ChatGPT Custom Instructions only work inside ChatGPT and are limited to two 1,500-character text boxes. Meto's Universal Custom Instructions give you a central profile that compiles customized, token-optimized prompts for ChatGPT, Claude.ai, Google Gemini, and DeepSeek with one click.",
    },
    {
      q: "What happens when I want to change my writing tone or job role?",
      a: "With standard custom instructions, you have to log into 3 or 4 different websites and manually rewrite your prompts. In Meto, you update your profile once (or tell Meto in chat), and all your export prompts update instantly.",
    },
    {
      q: "Does Meto respect the character limits of each platform?",
      a: "Yes! Meto specifically formats prompts to fit ChatGPT's 1,500-character limit, Claude's extended Markdown format, and Gemini AI Studio's system instruction parameters.",
    },
    {
      q: "Can I create different instruction presets for work and personal use?",
      a: "Yes. Meto supports preset modes (such as Work, Research, Creative Writing, and Minimal) so you can export the exact persona you need for the task at hand.",
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
          <span className="text-[var(--text)]">Universal Custom Instructions</span>
        </nav>

        {/* Header Banner */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <Sliders className="h-3 w-3 text-amber-500" />
                Centralized Custom Instructions
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)] leading-tight">
              Universal Custom Instructions: Write Once, Use in Every AI
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Stop maintaining separate 1,500-character instruction boxes across OpenAI, Anthropic, and Google. Centralize your AI persona in Meto and export tailored prompts with one click.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Build My Instructions</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/integrations/chatgpt"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              <span>ChatGPT Guide</span>
            </Link>
          </div>
        </header>

        {/* Direct Answer Box for AEO & Search Engines */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 mb-10 border-l-2 border-l-[var(--primary)]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Direct Answer: Universal Custom Instructions
          </div>
          <p className="text-sm text-[var(--text)] font-medium leading-relaxed mb-2.5">
            <strong>Universal Custom Instructions provide a single source of truth for your AI communication guidelines.</strong> Meto translates your persona, communication tone, and negative constraints into platform-tuned system prompts for ChatGPT, Claude.ai, Google Gemini, and DeepSeek, eliminating instruction drift and manual copy-pasting.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <span className="text-emerald-500 font-medium">✓ Best for:</span>
            <span>Eliminating custom instruction fragmentation across multiple AI web and mobile apps.</span>
          </div>
        </div>

        {/* The Pain: Fragmented Settings Forms */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            The Problem: 4 Different AI Apps, 4 Different Setting Forms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <span className="text-xs font-mono text-red-500 uppercase font-semibold">The Old Way</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1.5 mb-3">
                Siloed Custom Instructions
              </h3>
              <ul className="space-y-2 text-xs text-[var(--muted)]">
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>ChatGPT limits you to two rigid 1,500-character boxes with zero version history.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>Claude.ai expects Markdown in Project instructions; Gemini expects AI Studio system instructions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>When you update your preferences in one app, the other three apps remain stuck on outdated rules.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <span className="text-xs font-mono text-amber-500 uppercase font-semibold">The Meto Way</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1.5 mb-3">
                One Universal Command Center
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>One centralized dashboard stores your persona, writing tone, and formatting constraints.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>One-click exports automatically tune token length and Markdown syntax for each platform.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Switch easily between Work mode, Creative mode, and Research mode presets.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Platform Adaptation Blueprint */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <Workflow className="h-4 w-4 text-amber-500" />
            How Meto Tunes Prompts for Each Chatbot
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <span className="text-[11px] font-mono text-amber-500 uppercase font-semibold">ChatGPT</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1 mb-2">1,500 Char Limits</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Condenses your background and style directives into high-density tokens that fit cleanly inside ChatGPT&apos;s two Personalization fields.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <span className="text-[11px] font-mono text-amber-500 uppercase font-semibold">Claude.ai</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1 mb-2">Markdown Artifacts</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Formats rich structured headers and XML tags optimized for Claude 3.7 Sonnet&apos;s deep nuance and Claude Projects memory.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <span className="text-[11px] font-mono text-amber-500 uppercase font-semibold">Google Gemini</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1 mb-2">Gems &amp; AI Studio</h3>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Generates complete system prompt configurations ready to paste directly into Gemini Gems or Google AI Studio System Instructions.
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
            Take control of your custom instructions today
          </h2>
          <p className="mt-1.5 text-xs text-[var(--muted)] max-w-md mx-auto">
            Build your universal instructions in 2 minutes. Free forever for individual users.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/solutions/personal-ai-identity"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              <span>Personal Identity Guide</span>
            </Link>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
