"use client";

import { useEffect, useState } from "react";
import {
  Check,
  Copy,
  HelpCircle,
  Loader2,
  Send,
  Terminal,
  X,
  Wrench,
  Bug,
  Lightbulb,
  CreditCard,
  MessageSquare,
} from "lucide-react";

export type SupportCategory = "mcp_setup" | "bug" | "billing" | "feature" | "general";

const CATEGORIES: Array<{
  id: SupportCategory;
  label: string;
  icon: typeof Wrench;
  description: string;
}> = [
  { id: "bug", label: "Bug Report", icon: Bug, description: "Something unexpected happened or broke" },
  { id: "mcp_setup", label: "MCP / CLI Setup", icon: Terminal, description: "Cursor, Claude, Antigravity, or terminal sync" },
  { id: "feature", label: "Feature Request", icon: Lightbulb, description: "Suggestions or new editor integrations" },
  { id: "billing", label: "Billing & Account", icon: CreditCard, description: "Subscriptions, invoices, or Polar issues" },
  { id: "general", label: "General Inquiry", icon: MessageSquare, description: "Questions about Meto, privacy, or API" },
];

export function SupportModal({
  isOpen,
  onClose,
  initialCategory = "general",
  prefillEmail = "",
}: {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: SupportCategory;
  prefillEmail?: string;
}) {
  const [category, setCategory] = useState<SupportCategory>(initialCategory);
  const [email, setEmail] = useState(prefillEmail);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedCli, setCopiedCli] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory, isOpen]);

  useEffect(() => {
    if (prefillEmail) {
      setEmail(prefillEmail);
    }
  }, [prefillEmail, isOpen]);

  if (!isOpen) return null;

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

  function handleCopyHealth() {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText("npx @metoai/cli health");
      setCopiedCli(true);
      setTimeout(() => setCopiedCli(false), 2000);
    }
  }

  const isBug = category === "bug";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-[560px] rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5 sm:p-6 shadow-2xl transition-all duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2.5">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                isBug
                  ? "bg-red-500/10 text-red-600 dark:text-red-400"
                  : "bg-[var(--primary)]/10 text-[var(--primary)]"
              }`}
            >
              {isBug ? (
                <Bug className="h-4 w-4" />
              ) : (
                <HelpCircle className="h-4 w-4" />
              )}
            </div>
            <div>
              <h2
                id="support-modal-title"
                className="text-[15px] font-semibold text-[var(--text)]"
              >
                {isBug ? "Report a Bug / Issue" : "Support & Assistance"}
              </h2>
              <p className="text-[12px] text-[var(--muted)]">
                {isBug
                  ? "Direct founder investigation and quick resolution"
                  : "Direct founder response via email"}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)] transition-colors active:scale-95"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Check className="h-6 w-6" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[var(--text)]">
                {isBug ? "Bug Report Submitted" : "Message Received"}
              </h3>
              <p className="mt-1 text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                Thank you. We have received your submission and sent a confirmation receipt to{" "}
                <span className="font-medium text-[var(--text)]">{email}</span>. We will follow up shortly.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSuccess(false);
                setMessage("");
                setSubject("");
                onClose();
              }}
              className="inline-flex h-9 items-center justify-center rounded-lg bg-[var(--text)] px-4 text-xs font-medium text-[var(--bg)] hover:opacity-90 active:scale-95 transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {error ? (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            ) : null}

            {/* Category Selector Chips */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-[var(--muted)] mb-2 font-medium">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all active:scale-[0.98] ${
                        isSelected
                          ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--text)] ring-1 ring-[var(--primary)]/30"
                          : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--border)]"
                      }`}
                    >
                      <Icon
                        className={`h-3.5 w-3.5 shrink-0 ${
                          isSelected ? "text-[var(--primary)]" : "text-[var(--muted)]"
                        }`}
                      />
                      <span className="text-[12px] font-medium truncate">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contextual Tip for Bug Reports */}
            {isBug ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3 text-xs text-[var(--text-secondary)]">
                <p className="font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5 mb-1">
                  <Bug className="h-3.5 w-3.5" />
                  Bug Diagnostics
                </p>
                <p className="text-[11px] leading-relaxed">
                  Please mention your active editor (Cursor, Claude, Windsurf, Antigravity) and paste any relevant terminal errors or unexpected behavior below.
                </p>
              </div>
            ) : null}

            {/* Contextual Tip for MCP / CLI Setup */}
            {category === "mcp_setup" ? (
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 text-xs text-[var(--text-secondary)] flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-semibold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5" />
                    CLI Self-Diagnostic Available
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    You can run this in your terminal to automatically audit your project config:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyHealth}
                  className="shrink-0 flex items-center gap-1.5 rounded-lg border border-orange-500/30 bg-[var(--card)] px-2.5 py-1 text-[11px] font-mono text-[var(--text)] hover:bg-orange-500/10 active:scale-95 transition-all"
                >
                  {copiedCli ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedCli ? "Copied" : "npx @metoai/cli health"}</span>
                </button>
              </div>
            ) : null}

            {/* Email & Name Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="modal-email"
                  className="block text-xs font-medium text-[var(--text)] mb-1"
                >
                  Your Email <span className="text-[var(--primary)]">*</span>
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted)]"
                />
              </div>
              <div>
                <label
                  htmlFor="modal-name"
                  className="block text-xs font-medium text-[var(--text)] mb-1"
                >
                  Your Name
                </label>
                <input
                  id="modal-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Mercer"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted)]"
                />
              </div>
            </div>

            {/* Subject Field */}
            <div>
              <label
                htmlFor="modal-subject"
                className="block text-xs font-medium text-[var(--text)] mb-1"
              >
                Subject
              </label>
              <input
                id="modal-subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  isBug
                    ? "e.g. Cursor composer hangs when invoking Meto tool"
                    : "e.g. Question regarding rule sync"
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted)]"
              />
            </div>

            {/* Message Details */}
            <div>
              <label
                htmlFor="modal-message"
                className="block text-xs font-medium text-[var(--text)] mb-1"
              >
                {isBug ? "Bug Description & Steps to Reproduce" : "Message"}
                <span className="text-[var(--primary)]">*</span>
              </label>
              <textarea
                id="modal-message"
                required
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  isBug
                    ? "What happened? What was the expected result? Steps to reproduce..."
                    : "How can we help you?"
                }
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors resize-none leading-relaxed placeholder:text-[var(--muted)]"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--surface)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[var(--primary-hover)] active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>{isBug ? "Submit Bug Report" : "Send Inquiry"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
