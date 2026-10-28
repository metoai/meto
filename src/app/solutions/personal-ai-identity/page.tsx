import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Fingerprint,
  MessageSquare,
  ShieldAlert,
  Sliders,
  Sparkles,
  UserCheck,
  XCircle,
} from "lucide-react";
import { MarketingLayout } from "@/components/marketing-layout";
import { getSiteUrl } from "@/lib/site";
import { SUPPORTED_AI_PARTNERS } from "@/lib/ai-platform-icons";

export const metadata: Metadata = {
  title: "One AI Identity for ChatGPT, Claude, Gemini & DeepSeek | Meto",
  description:
    "Stop re-introducing yourself to every AI chatbot. Save your personal context, writing style, and tone once in Meto and export it to ChatGPT, Claude, Gemini, and DeepSeek in one click.",
  alternates: {
    canonical: `${getSiteUrl()}/solutions/personal-ai-identity`,
  },
  openGraph: {
    title: "One AI Identity for ChatGPT, Claude, Gemini & DeepSeek — Meto",
    description:
      "A universal personal identity profile for all your AI assistants. Portable custom instructions, tone tuning, and zero repetitive prompting.",
    url: `${getSiteUrl()}/solutions/personal-ai-identity`,
    siteName: "Meto",
    type: "article",
  },
};

export default function PersonalAiIdentityPage() {
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/solutions/personal-ai-identity`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Solutions", item: `${siteUrl}/solutions` },
      { "@type": "ListItem", position: 3, name: "Personal AI Identity", item: pageUrl },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "One AI Identity for ChatGPT, Claude, Gemini, and DeepSeek: Stopping Chatbot Re-Introduction",
    description:
      "How everyday AI users manage a single portable identity profile for writing tone, professional context, and communication preferences across multiple AI chatbots.",
    author: { "@type": "Organization", name: "Meto", url: siteUrl },
    publisher: { "@type": "Organization", name: "Meto", url: siteUrl },
    url: pageUrl,
  };

  const faqList = [
    {
      q: "Why do I need a universal AI identity if ChatGPT already has memory?",
      a: "ChatGPT memory only works inside ChatGPT. The moment you switch to Claude.ai for document writing, Google Gemini for Workspace integration, or DeepSeek for deep reasoning, that memory vanishes. Meto gives you a portable identity that you own and can carry into any AI model on day one.",
    },
    {
      q: "How do I transfer my Meto identity into ChatGPT or Claude?",
      a: "In your Meto workspace, click 'Copy for ChatGPT' or 'Copy for Claude'. Meto instantly copies a tailored prompt formatted specifically for that chatbot's character limits and system prompt rules. You paste it once into Custom Instructions or Project Settings.",
    },
    {
      q: "What kind of preferences can I save in Meto?",
      a: "You can save your job role, industry background, preferred writing style (concise, analytical, executive, creative), response formatting rules (bullet points, markdown), and negative preferences (e.g. 'Never use corporate buzzwords or say 'Certainly!'').",
    },
    {
      q: "Can I update my profile from my phone?",
      a: "Yes! Meto is fully optimized for mobile. You can open Meto on your phone and simply send a message like 'I just started a new job as a product manager'—Meto updates your identity automatically.",
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
          <span className="text-[var(--text)]">Personal AI Identity</span>
        </nav>

        {/* Header Banner */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-8 mb-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <Fingerprint className="h-3 w-3 text-amber-500" />
                Universal Consumer AI Profile
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)] leading-tight">
              One Profile for All Your AIs. Stop Re-Introducing Yourself.
            </h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
              Your background, writing tone, and personal preferences in continuous sync across ChatGPT, Claude.ai, Google Gemini, and DeepSeek. Set it once in Meto—export it anywhere in one click.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1">
            <Link
              href="/auth/signup"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <span>Create Free Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              <span>Free Forever Plan</span>
            </Link>
          </div>
        </header>

        {/* Direct Answer Box for AEO & Search Engines */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5 mb-10 border-l-2 border-l-[var(--primary)]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1.5">
            Direct Answer: Universal AI Identity
          </div>
          <p className="text-sm text-[var(--text)] font-medium leading-relaxed mb-2.5">
            <strong>A universal AI identity is a single, portable profile that stores your personal context, writing style, role, and communication guidelines.</strong> Instead of retyping custom instructions across ChatGPT, Claude, Gemini, and DeepSeek individually, Meto generates tailored prompts that carry your identity into every major AI chatbot with zero repetition.
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[var(--muted)]">
            <span className="text-emerald-500 font-medium">✓ Best for:</span>
            <span>Writers, students, marketers, and researchers who switch between multiple AI tools.</span>
          </div>
        </div>

        {/* Supported AI Logos Bar */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4 mb-10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-xs font-mono text-[var(--muted)] uppercase tracking-wider">
            Works Seamlessly With:
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {SUPPORTED_AI_PARTNERS.map((partner) => (
              <div key={partner.id} className="flex items-center gap-1.5 text-xs font-medium text-[var(--text)]">
                {partner.url ? (
                  <img src={partner.url} alt={partner.label} className="h-4 w-4 shrink-0" />
                ) : null}
                <span>{partner.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* The Problem: Repeating Yourself Across Chatbots */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            The Friction of Using Multiple AI Assistants
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
              <span className="text-xs font-mono text-red-500 uppercase font-semibold">Without Meto</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1.5 mb-3">
                Fragmented Identity &amp; Constant Repetition
              </h3>
              <ul className="space-y-2 text-xs text-[var(--muted)]">
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>You spend the first 3 prompts of every new chat explaining your role and writing tone.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>ChatGPT knows your background, but Claude.ai and Gemini treat you like a stranger.</span>
                </li>
                <li className="flex items-start gap-2">
                  <XCircle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5" />
                  <span>When your job, project, or tone preferences change, you have to rewrite instructions in 4 apps.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <span className="text-xs font-mono text-amber-500 uppercase font-semibold">With Meto</span>
              <h3 className="text-sm font-semibold text-[var(--text)] mt-1.5 mb-3">
                One Portable Profile Everywhere
              </h3>
              <ul className="space-y-2 text-xs text-[var(--text-secondary)]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Every AI starts with full knowledge of your communication style and goals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Switch freely between ChatGPT, Claude 3.7, Gemini 2.5, and DeepSeek with 1-click exports.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Update your profile naturally from your phone anytime by simply chatting with Meto.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4 Core Features for General Users */}
        <section className="mb-12">
          <h2 className="text-base font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-amber-500" />
            What You Can Personalize in Meto
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sliders className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Writing Style &amp; Tone</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Define whether you prefer direct and concise answers, deep analytical breakdowns, or engaging storytelling. All models match your exact communication frequency.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Negative Rules (Anti-Fluff)</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Eliminate annoying AI habits: ban phrases like &quot;Certainly!&quot;, &quot;Great question!&quot;, unsolicited moralizing, or fluffy conclusions.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-[var(--text)]">Conversational Updates</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                No complex settings forms. Just tell Meto: &quot;I&apos;m currently writing a newsletter on clean energy&quot;—Meto incorporates it into your active context immediately.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Copy className="h-4 w-4 text-amber-500" />
                <h3 className="text-sm font-semibold text-[var(--text)]">1-Click Platform Presets</h3>
              </div>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Switch between Work mode, Creative mode, and Research mode with one click. Meto optimizes the prompt specifically for the target chatbot.
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
            Create your universal AI identity in 2 minutes
          </h2>
          <p className="mt-1.5 text-xs text-[var(--muted)] max-w-md mx-auto">
            Free forever for personal use. Never re-introduce yourself to an AI chatbot again.
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
              href="/pricing"
              className="inline-flex items-center gap-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3.5 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text)] active:scale-[0.97] transition-all duration-150"
            >
              <span>View Free Plan</span>
            </Link>
          </div>
        </div>
      </article>
    </MarketingLayout>
  );
}
