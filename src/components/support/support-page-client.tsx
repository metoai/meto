"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  HelpCircle,
  Mail,
  Send,
  Terminal,
  Wrench,
  BookOpen,
  ArrowRight,
  Loader2,
  Bug,
  Sparkles,
  CreditCard,
  MessageSquare,
} from "lucide-react";
import { MarketingNavBar } from "@/components/marketing/marketing-nav-bar";
import { LandingPageFooter } from "@/components/landing/landing-page-footer";

export function SupportPageClient() {
  const [category, setCategory] = useState("general");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedHealth, setCopiedHealth] = useState(false);
  const [copiedSetup, setCopiedSetup] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          category,
          subject: subject.trim() || undefined,
          message: message.trim(),
          url: typeof window !== "undefined" ? window.location.href : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit request.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text: string, setCopied: (v: boolean) => void) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <MarketingNavBar />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Header Banner */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-1 text-xs text-[var(--muted)] mb-4">
            <HelpCircle className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>Developer Support & Direct Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text)]">
            How can we help you?
          </h1>
          <p className="mt-3 text-base text-[var(--text-secondary)] leading-relaxed">
            Get instant self-diagnostic commands for your editor, explore our integration guides, or send a direct inquiry to the founder.
          </p>
        </div>

        {/* 3 Quick Resolution Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {/* Card 1: CLI Diagnostic */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-[var(--primary)] mb-3">
                <Terminal className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Self-Diagnostics</h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                Audit your active project, verify .cursorrules, CLAUDE.md, and GEMINI.md in 2 seconds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("npx @metoai/cli health", setCopiedHealth)}
              className="mt-4 flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-mono text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors active:scale-[0.98]"
            >
              <span className="truncate">npx @metoai/cli health</span>
              {copiedHealth ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <Copy className="h-3.5 w-3.5 text-[var(--muted)] shrink-0" />}
            </button>
          </div>

          {/* Card 2: 1-Click MCP Setup */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-sky-500 mb-3">
                <Wrench className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Auto-Configure MCP</h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                Auto-detect installed editors (Cursor, Antigravity, Claude) and install Meto MCP server.
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("npx @metoai/cli setup-mcp", setCopiedSetup)}
              className="mt-4 flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-mono text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors active:scale-[0.98]"
            >
              <span className="truncate">npx @metoai/cli setup-mcp</span>
              {copiedSetup ? <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <Copy className="h-3.5 w-3.5 text-[var(--muted)] shrink-0" />}
            </button>
          </div>

          {/* Card 3: Guides & Docs */}
          <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 mb-3">
                <BookOpen className="h-4 w-4" />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)]">Integration Docs</h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                Step-by-step connection guides for Cursor, Claude Code, Windsurf, Copilot & Antigravity.
              </p>
            </div>
            <Link
              href="/integrations"
              className="mt-4 flex w-full items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs font-medium text-[var(--text)] hover:border-[var(--primary)]/40 transition-colors active:scale-[0.98]"
            >
              <span>Explore All Guides</span>
              <ArrowRight className="h-3.5 w-3.5 text-[var(--muted)]" />
            </Link>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="rounded-3xl border border-[var(--border-subtle)] bg-[var(--card)] p-6 sm:p-8 shadow-sm">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-[var(--text)]">Send a Direct Message</h2>
              <p className="mt-1 text-xs sm:text-sm text-[var(--muted)]">
                Direct founder response to your inbox at <span className="font-mono text-[var(--text)]">metoaipr@gmail.com</span>
              </p>
            </div>

            {success ? (
              <div className="py-10 text-center space-y-4">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                  <Check className="h-7 w-7" strokeWidth={2.5} />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text)]">Inquiry Delivered</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto">
                  Thank you! We received your message and sent a confirmation receipt to{" "}
                  <strong className="text-[var(--text)]">{email}</strong>. Alazar will follow up with you shortly.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSuccess(false);
                    setMessage("");
                    setSubject("");
                  }}
                  className="mt-4 inline-flex h-9 items-center justify-center rounded-xl bg-[var(--primary)] px-5 text-xs font-medium text-white hover:bg-[var(--primary-hover)] active:scale-95 transition-all"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error ? (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                    {error}
                  </div>
                ) : null}

                {/* Category Picker */}
                <div>
                  <label className="block text-xs font-medium text-[var(--text)] mb-1.5">
                    What can we help you with?
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
                  >
                    <option value="general">💬 General Support / Questions</option>
                    <option value="mcp_setup">🛠️ MCP or CLI Setup Assistance</option>
                    <option value="bug">🐛 Bug Report</option>
                    <option value="feature">💡 Feature Request</option>
                    <option value="billing">💳 Billing & Account</option>
                  </select>
                </div>

                {/* Email & Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="form-email" className="block text-xs font-medium text-[var(--text)] mb-1">
                      Email Address <span className="text-[var(--primary)]">*</span>
                    </label>
                    <input
                      id="form-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="form-name" className="block text-xs font-medium text-[var(--text)] mb-1">
                      Your Name
                    </label>
                    <input
                      id="form-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="form-subject" className="block text-xs font-medium text-[var(--text)] mb-1">
                    Subject
                  </label>
                  <input
                    id="form-subject"
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Cursor MCP connection timeout or rule file sync question"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors"
                  />
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="form-message" className="block text-xs font-medium text-[var(--text)] mb-1">
                    Message Details <span className="text-[var(--primary)]">*</span>
                  </label>
                  <textarea
                    id="form-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please include any error messages, operating system, or editor versions..."
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-xs font-semibold text-white shadow-xs transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Submit Inquiry to Founder</span>
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] flex items-center justify-center gap-2 text-xs text-[var(--muted)]">
              <Mail className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span>Or email directly anytime at:</span>
              <a href="mailto:metoaipr@gmail.com" className="font-mono text-[var(--text)] hover:underline">
                metoaipr@gmail.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <LandingPageFooter />
    </div>
  );
}
