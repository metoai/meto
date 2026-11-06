"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  FileCode,
  Layers,
  Terminal,
  Zap,
} from "lucide-react";
import type { RuleItem } from "@/lib/rules-data";

type Props = {
  rule: RuleItem;
};

export function RuleDetailClient({ rule }: Props) {
  const [activeTab, setActiveTab] = useState<"cursor" | "claude">("cursor");
  const [copied, setCopied] = useState<boolean>(false);

  const activeContent =
    activeTab === "cursor" ? rule.cursorMdcContent : rule.claudeMdContent;

  const activeFilename =
    activeTab === "cursor"
      ? `.cursor/rules/${rule.slug}.mdc`
      : "CLAUDE.md";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="space-y-8">
      {/* Code Viewer Card with Tabs */}
      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] overflow-hidden shadow-xs">
        {/* Tab Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2.5 gap-2">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("cursor")}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                activeTab === "cursor"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-active)]"
              }`}
            >
              Cursor .mdc Format
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("claude")}
              className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                activeTab === "claude"
                  ? "bg-[var(--primary)] text-white shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-active)]"
              }`}
            >
              Claude Code CLAUDE.md
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-mono font-semibold text-[var(--text)] hover:bg-[var(--card)] active:scale-[0.97] transition-all"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-emerald-500">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy Rule Content</span>
              </>
            )}
          </button>
        </div>

        {/* File Path Indicator */}
        <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-code)] px-4 py-1.5 text-[11px] font-mono text-[var(--muted)]">
          <Terminal className="h-3 w-3" />
          <span>Recommended location: {activeFilename}</span>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-[var(--surface-code)] overflow-x-auto">
          <pre className="font-mono text-xs sm:text-sm text-neutral-200 leading-relaxed">
            <code>{activeContent}</code>
          </pre>
        </div>
      </div>

      {/* Meto Automated Alternative Banner */}
      <div className="rounded-2xl border border-[var(--primary)]/40 bg-gradient-to-r from-[var(--primary)]/15 via-[var(--surface)] to-[var(--primary)]/5 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-mono font-semibold text-[var(--primary)]">
            <Zap className="h-3.5 w-3.5" />
            1-Click Sync Alternative
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
            Tired of copy-pasting this rule into every new repository?
          </h3>
          <p className="text-sm text-[var(--muted)] max-w-xl leading-relaxed">
            Meto serves this rule live to Cursor, Claude Code, and Windsurf over Model Context Protocol (MCP).
            Update your conventions once, and every project reflects the change instantly without manual file drift.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all"
          >
            Sync to Cursor via Meto
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/integrations/cursor"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--card)] active:scale-[0.97] transition-all"
          >
            Cursor MCP Setup Guide
          </Link>
        </div>
      </div>
    </div>
  );
}
