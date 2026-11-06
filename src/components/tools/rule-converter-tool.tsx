"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Copy,
  FileCode,
  RefreshCw,
  Sparkles,
  Terminal,
  AlertTriangle,
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  convertRules,
  SAMPLE_CURSOR_RULE,
  type TargetFormat,
} from "@/lib/rule-converter";

export function RuleConverterTool() {
  const [inputRule, setInputRule] = useState<string>(SAMPLE_CURSOR_RULE);
  const [activeTab, setActiveTab] = useState<TargetFormat>("claude");
  const [copied, setCopied] = useState<boolean>(false);

  const result = useMemo(() => {
    return convertRules(inputRule);
  }, [inputRule]);

  const outputContent = useMemo(() => {
    switch (activeTab) {
      case "claude":
        return result.claudeMd;
      case "windsurf":
        return result.windsurfrules;
      case "copilot":
        return result.copilotInstructions;
      case "cursor":
        return result.cursorMdc;
      default:
        return result.claudeMd;
    }
  }, [activeTab, result]);

  const activeFilename = useMemo(() => {
    switch (activeTab) {
      case "claude":
        return "CLAUDE.md";
      case "windsurf":
        return ".windsurfrules";
      case "copilot":
        return ".github/copilot-instructions.md";
      case "cursor":
        return ".cursor/rules/conventions.mdc";
      default:
        return "CLAUDE.md";
    }
  }, [activeTab]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(outputContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleLoadSample = () => {
    setInputRule(SAMPLE_CURSOR_RULE);
  };

  const handleClear = () => {
    setInputRule("");
  };

  return (
    <div className="w-full space-y-8">
      {/* Top Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
          <div className="text-xs text-[var(--muted)] font-mono uppercase">Est. Tokens</div>
          <div className="text-2xl font-bold text-[var(--text)] mt-1 font-mono">
            ~{result.estimatedTokens}
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">
            {result.estimatedTokens > 1000 ? "⚠️ High prompt drag" : "✓ Within recommended budget"}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
          <div className="text-xs text-[var(--muted)] font-mono uppercase">Word Count</div>
          <div className="text-2xl font-bold text-[var(--text)] mt-1 font-mono">
            {result.wordCount}
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">Raw directive words</div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
          <div className="text-xs text-[var(--muted)] font-mono uppercase">Context Health</div>
          <div className="text-2xl font-bold text-emerald-500 mt-1 font-mono">
            {result.score}/100
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">
            {result.score >= 80 ? "Clean & Imperative" : "Needs Optimization"}
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
          <div className="text-xs text-[var(--muted)] font-mono uppercase">Sync Compatibility</div>
          <div className="text-2xl font-bold text-[var(--primary)] mt-1 font-mono">
            4 IDEs
          </div>
          <div className="text-[11px] text-[var(--muted)] mt-0.5">Claude, Cursor, Windsurf, Copilot</div>
        </div>
      </div>

      {/* Editor & Converter Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Input Source */}
        <div className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] overflow-hidden shadow-xs">
          <div className="flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-3">
            <div className="flex items-center gap-2">
              <FileCode className="h-4 w-4 text-[var(--primary)]" />
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text)]">
                Input Rule (.cursorrules or .mdc)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs font-mono text-[var(--primary)] hover:underline active:scale-[0.97] transition-all"
              >
                Sample
              </button>
              <span className="text-[var(--border)]">|</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-mono text-[var(--muted)] hover:text-[var(--text)] active:scale-[0.97] transition-all"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="relative flex-1 p-3">
            <textarea
              value={inputRule}
              onChange={(e) => setInputRule(e.target.value)}
              placeholder="Paste your .cursorrules, .cursor/rules/*.mdc, or CLAUDE.md text here..."
              rows={16}
              className="w-full resize-none rounded-xl border border-transparent bg-transparent p-3 font-mono text-xs sm:text-sm text-[var(--text)] placeholder-[var(--muted)]/50 focus:border-[var(--primary)]/40 focus:outline-hidden"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Column: Output Target */}
        <div className="flex flex-col rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] overflow-hidden shadow-xs">
          {/* Target Tabs Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-2 gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("claude")}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  activeTab === "claude"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-active)]"
                }`}
              >
                CLAUDE.md
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("windsurf")}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  activeTab === "windsurf"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-active)]"
                }`}
              >
                .windsurfrules
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("copilot")}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  activeTab === "copilot"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-active)]"
                }`}
              >
                copilot-instructions
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("cursor")}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono font-semibold transition-all ${
                  activeTab === "cursor"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-active)]"
                }`}
              >
                Cursor .mdc
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
                  <span className="text-emerald-500">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy File</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] bg-[var(--surface-code)] px-4 py-1.5 text-[11px] font-mono text-[var(--muted)]">
            <Terminal className="h-3 w-3" />
            <span>Target filename: {activeFilename}</span>
          </div>

          <div className="relative flex-1 p-3 bg-[var(--surface-code)]">
            <pre className="h-full min-h-[300px] overflow-auto p-3 font-mono text-xs sm:text-sm text-neutral-200">
              <code>{outputContent}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Linter & Audit Findings */}
      {result.issues.length > 0 && (
        <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--card)] p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[var(--text)]">
              Context Health Audit & Optimization Tips
            </span>
          </div>

          <div className="space-y-2.5">
            {result.issues.map((issue, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 rounded-xl border p-3 text-xs leading-relaxed ${
                  issue.severity === "error"
                    ? "border-red-500/30 bg-red-500/10 text-red-200"
                    : issue.severity === "warning"
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
                    : "border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--text)]"
                }`}
              >
                {issue.severity === "error" ? (
                  <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                ) : issue.severity === "warning" ? (
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                ) : (
                  <Info className="h-4 w-4 text-[var(--primary)] shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold">{issue.title}</div>
                  <div className="mt-0.5 opacity-90">{issue.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Meto Upsell / Connect Banner */}
      <div className="rounded-2xl border border-[var(--primary)]/40 bg-gradient-to-r from-[var(--primary)]/15 via-[var(--surface)] to-[var(--primary)]/5 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3 py-1 text-xs font-mono font-semibold text-[var(--primary)]">
            <Zap className="h-3.5 w-3.5" />
            Zero-Maintenance Alternative
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text)]">
            Tired of copy-pasting converted files into every repo?
          </h3>
          <p className="text-sm text-[var(--muted)] max-w-xl leading-relaxed">
            Meto serves your canonical developer rules live over Model Context Protocol (MCP).
            Connect once, and Cursor, Claude Code, and Windsurf all stay 100% in sync without manual files.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all"
          >
            Connect Meto Free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/solutions/sync-rules"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm font-medium text-[var(--text)] hover:bg-[var(--card)] active:scale-[0.97] transition-all"
          >
            How Meto Sync Works
          </Link>
        </div>
      </div>
    </div>
  );
}
