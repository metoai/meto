"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, Terminal, ArrowRight, Sparkles } from "lucide-react";

export default function CliAuthPage() {
  const [approved, setApproved] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg)] px-4 py-12">
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
                <span className="text-[var(--text-secondary)] font-semibold">Session Request</span>
                <span className="text-emerald-500 font-medium">Active</span>
              </div>
              <div>CLI Command: <span className="text-[var(--text)] font-semibold">npx meto login</span></div>
              <div>Scope: <span className="text-[var(--text)]">Profile Read & Sync</span></div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => setApproved(true)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] text-sm font-semibold text-white shadow-md transition-all hover:bg-[var(--primary-hover)] active:scale-[0.99]"
              >
                <span>Authorize Terminal Access</span>
                <ArrowRight className="h-4 w-4" />
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
              You can now return to your terminal window. Run <code className="rounded bg-[var(--surface)] px-1.5 py-0.5 font-mono text-xs text-[var(--primary)]">npx meto sync</code> to finish syncing.
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
    </div>
  );
}
