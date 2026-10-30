"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, Send, X, Bug, MessageSquare } from "lucide-react";

export type SupportCategory = "bug" | "mcp_setup" | "feature" | "billing" | "general";

const CATEGORIES: Array<{ id: SupportCategory; label: string }> = [
  { id: "bug", label: "Bug" },
  { id: "mcp_setup", label: "MCP / CLI" },
  { id: "feature", label: "Feature" },
  { id: "general", label: "General" },
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
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCategory) setCategory(initialCategory);
  }, [initialCategory, isOpen]);

  useEffect(() => {
    if (prefillEmail) setEmail(prefillEmail);
  }, [prefillEmail, isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  const isBug = category === "bug";

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-150 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md max-h-[90dvh] flex flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] shadow-2xl overflow-hidden transition-all duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Header */}
        <div className="flex shrink-0 items-center justify-between px-4 py-2.5 border-b border-[var(--border-subtle)] bg-[var(--surface)]/40">
          <div className="flex items-center gap-2">
            {isBug ? (
              <Bug className="h-3.5 w-3.5 text-red-500" />
            ) : (
              <MessageSquare className="h-3.5 w-3.5 text-[var(--primary)]" />
            )}
            <h2
              id="support-modal-title"
              className="text-xs font-semibold text-[var(--text)] tracking-tight"
            >
              {isBug ? "Report a Bug" : "Send Feedback"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        {success ? (
          <div className="p-6 text-center space-y-3">
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <Check className="h-4 w-4" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-[var(--text)]">
                {isBug ? "Bug Report Sent" : "Message Sent"}
              </h3>
              <p className="mt-1 text-[11px] text-[var(--muted)] leading-relaxed">
                Receipt sent to <span className="font-mono text-[var(--text)]">{email}</span>. We&apos;ll look into it right away.
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
              className="inline-flex h-7 items-center justify-center rounded-md bg-[var(--text)] px-3 text-[11px] font-medium text-[var(--bg)] hover:opacity-90 active:scale-[0.97] transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {error ? (
                <div className="rounded-md border border-red-500/20 bg-red-500/10 px-2.5 py-1.5 text-[11px] text-red-600 dark:text-red-400">
                  {error}
                </div>
              ) : null}

              {/* Minimal Category Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
                {CATEGORIES.map((cat) => {
                  const active = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium transition-all active:scale-95 whitespace-nowrap ${
                        active
                          ? "bg-[var(--text)] text-[var(--bg)]"
                          : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="modal-email"
                  className="block text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1"
                >
                  Email
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted)]"
                />
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="modal-subject"
                  className="block text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1"
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
                      ? "e.g. Cursor composer hangs on MCP query"
                      : "e.g. Question or suggestion"
                  }
                  className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2.5 py-1.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted)]"
                />
              </div>

              {/* Description / Message */}
              <div>
                <label
                  htmlFor="modal-message"
                  className="block text-[10px] font-mono uppercase tracking-wider text-[var(--muted)] mb-1"
                >
                  {isBug ? "What happened?" : "Details"}
                </label>
                <textarea
                  id="modal-message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isBug
                      ? "Steps to reproduce, editor version (Cursor, Claude, Windsurf), or errors..."
                      : "Describe your question or feedback..."
                  }
                  className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] p-2.5 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors resize-none leading-relaxed placeholder:text-[var(--muted)]"
                />
              </div>
            </div>

            {/* Compact Action Footer */}
            <div className="flex shrink-0 items-center justify-end gap-2 px-4 py-2.5 border-t border-[var(--border-subtle)] bg-[var(--surface)]/30">
              <button
                type="button"
                onClick={onClose}
                className="rounded px-2.5 py-1 text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3 w-3" />
                    <span>{isBug ? "Submit Bug" : "Send"}</span>
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
