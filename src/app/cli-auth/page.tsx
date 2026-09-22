"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, ShieldCheck, Terminal, ArrowRight, Sparkles, AlertCircle, Loader2 } from "lucide-react";

function CliAuthContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code")?.trim().toUpperCase() || "";

  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuthorize = async () => {
    if (!code) {
      setError("No device authorization code found in URL.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/cli/auth/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("You must be logged in to Meto to authorize CLI access.");
        }
        throw new Error(data.error || "Failed to authorize CLI session.");
      }

      setApproved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authorization failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[460px] rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl backdrop-blur-xl text-center">
      {/* Badge */}
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--text)]">
        <Terminal className="h-3.5 w-3.5 text-[var(--primary)]" />
        <span>Meto CLI Authentication</span>
      </div>

      {!approved ? (
        <>
          <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">
            Authorize Meto CLI
          </h1>
          <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
            An active terminal session is requesting permission to sync your Meto identity profile, preferences, and MCP rules.
          </p>

          <div className="my-6 rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/80 p-4 text-left font-mono text-xs text-[var(--muted)]">
            <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2 mb-2">
              <span className="text-[var(--text-secondary)] font-semibold">Device Code</span>
              <span className="text-emerald-500 font-medium">
                {code ? "Ready" : "Missing"}
              </span>
            </div>
            <div>Code: <span className="text-[var(--text)] font-semibold">{code || "None provided"}</span></div>
            <div>Scope: <span className="text-[var(--text)]">Profile Read & Sync</span></div>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-left text-xs text-red-400">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              type="button"
              disabled={loading || !code}
              onClick={handleAuthorize}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--primary-hover)] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Authorizing...</span>
                </>
              ) : (
                <>
                  <span>Authorize Terminal Access</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <Link
              href="/"
              className="flex h-11 w-full items-center justify-center text-sm font-medium text-[var(--muted)] hover:text-[var(--text)]"
            >
              Cancel
            </Link>
          </div>
        </>
      ) : (
        <div className="py-4">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
            <Check className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text)]">Terminal Authorized!</h2>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            Your terminal has received your authentication token. You may return to your terminal.
          </p>

          <Link
            href="/"
            className="mt-6 inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--text)] hover:bg-[var(--card)]"
          >
            <span>Back to Meto Home</span>
            <Sparkles className="h-3.5 w-3.5 text-[var(--primary)]" />
          </Link>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex items-center justify-center gap-2 text-xs text-[var(--muted)]">
        <ShieldCheck className="h-3.5 w-3.5 text-sky-500" />
        <span>Encrypted 256-bit OAuth Token Exchange</span>
      </div>
    </div>
  );
}

export default function CliAuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-12">
      <Suspense fallback={<div className="text-xs text-[var(--muted)]">Loading device authorization...</div>}>
        <CliAuthContent />
      </Suspense>
    </div>
  );
}
