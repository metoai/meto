"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  Send,
  Terminal,
  Loader2,
  LifeBuoy,
  ChevronDown,
  Wrench,
  Layers,
  ShieldCheck,
  Cpu,
  ArrowDown,
} from "lucide-react";
import { MarketingNavBar } from "@/components/marketing/marketing-nav-bar";
import { LandingPageFooter } from "@/components/landing/landing-page-footer";

const INQUIRY_CATEGORIES = [
  { id: "general", label: "General Support" },
  { id: "mcp_setup", label: "MCP / CLI Setup" },
  { id: "bug", label: "Bug Report" },
  { id: "feature", label: "Feature Request" },
  { id: "billing", label: "Billing & Account" },
];

type GuideCategory = "all" | "mcp" | "rules" | "cli" | "privacy";

interface TroubleshootingGuide {
  id: string;
  category: "mcp" | "rules" | "cli" | "privacy";
  title: string;
  tag: string;
  symptom: string;
  resolution: string[];
  snippet?: string;
}

const TROUBLESHOOTING_GUIDES: TroubleshootingGuide[] = [
  {
    id: "cursor-mcp-timeout",
    category: "mcp",
    title: "Cursor MCP: Connection Timeout or 'Server Disconnected'",
    tag: "Cursor & IDEs",
    symptom:
      "Cursor Composer does not show Meto tools, or Cursor Settings → Features → MCP displays a red/orange dot with 'timeout after 10000ms'.",
    resolution: [
      "Ensure Node.js 18+ is available on your system PATH (`node -v`).",
      "Check your user or workspace MCP configuration file (`~/.cursor/mcp.json` or `.cursor/mcp.json`).",
      "If running inside WSL2 or a remote container, ensure npx is installed inside the Linux distro rather than executing Windows npx.exe.",
      "Run the automated setup command to re-link and verify your MCP configuration.",
    ],
    snippet: `// ~/.cursor/mcp.json
{
  "mcpServers": {
    "meto": {
      "command": "npx",
      "args": ["-y", "@metoai/mcp-server"]
    }
  }
}`,
  },
  {
    id: "claude-code-mcp",
    category: "mcp",
    title: "Claude Code CLI & Claude Desktop Connection",
    tag: "Claude",
    symptom:
      "Claude Code terminal assistant doesn't recall project stack or fails to query Meto memory tools during terminal coding sessions.",
    resolution: [
      "For Claude Code CLI, add the Meto MCP server in one command: `claude mcp add meto npx @metoai/mcp-server`.",
      "Inside Claude Code, run `/mcp` to inspect connected servers and verify 'meto' is listed as Connected.",
      "For Claude Desktop app, edit the configuration file at `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\\Claude\\claude_desktop_config.json` (Windows).",
    ],
    snippet: `claude mcp add meto npx @metoai/mcp-server`,
  },
  {
    id: "windsurf-cascade",
    category: "mcp",
    title: "Windsurf (Cascade) MCP Integration",
    tag: "Windsurf",
    symptom:
      "Cascade agent does not discover tools from Meto server or reports 'MCP server failed to spawn'.",
    resolution: [
      "Open your Windsurf MCP configuration file located at `~/.codeium/windsurf/mcp_config.json`.",
      "Add the Meto MCP server entry with command `npx` and args `[\"-y\", \"@metoai/mcp-server\"]`.",
      "Restart Windsurf completely to reload the Cascade agent's MCP process pool.",
    ],
    snippet: `// ~/.codeium/windsurf/mcp_config.json
{
  "mcpServers": {
    "meto": {
      "command": "npx",
      "args": ["-y", "@metoai/mcp-server"]
    }
  }
}`,
  },
  {
    id: "rule-sync-priority",
    category: "rules",
    title: "Rule Synchronization & Conflict Hierarchy",
    tag: "Rule Files",
    symptom:
      "Understanding how .cursorrules, CLAUDE.md, .windsurfrules, and GEMINI.md are updated, or preserving custom manual edits.",
    resolution: [
      "Hierarchy: Local Repository Directives take top precedence over Team ADRs, which override Global Directives.",
      "Preserving custom sections: You can protect manual file blocks by surrounding them with `<!-- meto:keep-start -->` and `<!-- meto:keep-end -->`.",
      "To inspect the exact merged rules for your active repository, run `npx @metoai/cli health` in your project root.",
    ],
    snippet: `<!-- meto:keep-start -->
# Custom Project Rules
- Always use bun for testing
<!-- meto:keep-end -->`,
  },
  {
    id: "chat-rot-mitigation",
    category: "rules",
    title: "Preventing 'Chat Rot' & Context Window Degradation",
    tag: "Context Health",
    symptom:
      "After 20+ messages in Cursor or Claude, the AI starts hallucinating, ignoring architectural rules, or degrading in quality.",
    resolution: [
      "LLM attention naturally degrades as chat windows swell with noisy terminal output and past conversation turns.",
      "Meto is designed for context wiping: You can safely reset or clear your chat thread at any moment.",
      "On the very first prompt in your fresh thread, the AI queries Meto's live MCP tools to restore verified tech stack rules without prompt re-typing.",
    ],
  },
  {
    id: "privacy-source-code",
    category: "privacy",
    title: "Zero-Source-Code Policy & Privacy Guarantee",
    tag: "Security",
    symptom:
      "Verifying whether Meto accesses, scans, clones, or stores your private source code repository.",
    resolution: [
      "Meto strictly stores developer directives, coding preferences, architectural decision records (ADRs), and your public context profile.",
      "Meto never clones, scans, uploads, or stores your private source code repository files.",
      "All MCP tools query metadata and directives locally or through encrypted HTTPS endpoints with zero repository telemetry.",
    ],
  },
];

export function SupportPageClient() {
  const [selectedInquiryCat, setSelectedInquiryCat] = useState("general");
  const [activeGuideFilter, setActiveGuideFilter] = useState<GuideCategory>("all");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [copiedMap, setCopiedMap] = useState<Record<string, boolean>>({});

  function handleCopy(id: string, text: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedMap((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedMap((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    }
  }

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
          category: selectedInquiryCat,
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

  const filteredGuides =
    activeGuideFilter === "all"
      ? TROUBLESHOOTING_GUIDES
      : TROUBLESHOOTING_GUIDES.filter((g) => g.category === activeGuideFilter);

  const isBug = selectedInquiryCat === "bug";

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <MarketingNavBar />

      <main className="flex-1 mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        {/* Navigation Breadcrumb */}
        <nav
          className="mb-6 flex items-center gap-1.5 text-xs font-mono text-[var(--muted)]"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-[var(--text)] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[var(--text)]">Support</span>
        </nav>

        {/* Hero Section Banner - Clean, minimal developer interface */}
        <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b border-[var(--border-subtle)] pb-6 mb-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 font-mono text-[11px] text-[var(--text-secondary)]">
                <LifeBuoy className="h-3 w-3 text-amber-500" />
                Developer Support &amp; Knowledge Base
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[var(--text)] leading-tight">
              Support &amp; Troubleshooting
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Diagnostic terminal commands, common MCP connection resolutions, architectural rule sync guides, and direct founder assistance.
            </p>
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-1">
            <a
              href="#inquiry-form"
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 py-2 text-xs font-medium text-white shadow-xs hover:opacity-90 active:scale-[0.97] transition-all duration-150"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              <span>Inquiry Form</span>
            </a>
            <Link
              href="/integrations"
              className="inline-flex items-center gap-1 text-[11px] font-mono text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              <span>Integration Docs &rarr;</span>
            </Link>
          </div>
        </header>

        {/* Self-Diagnostic Toolkit Bar */}
        <section
          aria-label="Diagnostic Commands"
          className="mb-10 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-4 sm:p-5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-subtle)]/70 text-xs">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--muted)]">
              <Terminal className="h-3.5 w-3.5 text-amber-500" />
              <span className="font-semibold text-[var(--text)]">CLI Diagnostic Toolkit</span>
            </div>
            <span className="text-[11px] font-mono text-[var(--muted)]">
              Run directly in your repository root
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
            {/* Command 1: health */}
            <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2.5">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Audit Rules &amp; Sync Status
                </div>
                <code className="text-xs font-mono text-[var(--text)] truncate block mt-0.5">
                  npx @metoai/cli health
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("cmd-health", "npx @metoai/cli health")}
                className="inline-flex items-center justify-center h-7 w-7 rounded border border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] active:scale-95 transition-all shrink-0"
                title="Copy command"
                aria-label="Copy health command"
              >
                {copiedMap["cmd-health"] ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Command 2: setup-mcp */}
            <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2.5">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Auto-Configure MCP in All IDEs
                </div>
                <code className="text-xs font-mono text-[var(--text)] truncate block mt-0.5">
                  npx @metoai/cli setup-mcp
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("cmd-setup", "npx @metoai/cli setup-mcp")}
                className="inline-flex items-center justify-center h-7 w-7 rounded border border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] active:scale-95 transition-all shrink-0"
                title="Copy command"
                aria-label="Copy setup-mcp command"
              >
                {copiedMap["cmd-setup"] ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Command 3: pull */}
            <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2.5">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Pull Latest Context Into Files
                </div>
                <code className="text-xs font-mono text-[var(--text)] truncate block mt-0.5">
                  npx @metoai/cli pull
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("cmd-pull", "npx @metoai/cli pull")}
                className="inline-flex items-center justify-center h-7 w-7 rounded border border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] active:scale-95 transition-all shrink-0"
                title="Copy command"
                aria-label="Copy pull command"
              >
                {copiedMap["cmd-pull"] ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>

            {/* Command 4: login */}
            <div className="flex items-center justify-between gap-3 rounded-md border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2.5">
              <div className="min-w-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[var(--muted)]">
                  Authenticate / Refresh CLI Token
                </div>
                <code className="text-xs font-mono text-[var(--text)] truncate block mt-0.5">
                  npx @metoai/cli login
                </code>
              </div>
              <button
                type="button"
                onClick={() => handleCopy("cmd-login", "npx @metoai/cli login")}
                className="inline-flex items-center justify-center h-7 w-7 rounded border border-[var(--border-subtle)] text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] active:scale-95 transition-all shrink-0"
                title="Copy command"
                aria-label="Copy login command"
              >
                {copiedMap["cmd-login"] ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>
            </div>
          </div>
        </section>

        {/* Detailed Troubleshooting Knowledge Base */}
        <section aria-label="Troubleshooting Guides" className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--text)]">
                Troubleshooting &amp; Knowledge Base
              </h2>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                Step-by-step checklists for MCP configuration, rule sync, and editor setups.
              </p>
            </div>

            {/* Guide Filter Chips */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: "all", label: "All" },
                { id: "mcp", label: "MCP & IDEs" },
                { id: "rules", label: "Rule Sync" },
                { id: "privacy", label: "Privacy" },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setActiveGuideFilter(f.id as GuideCategory)}
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all active:scale-95 ${
                    activeGuideFilter === f.id
                      ? "bg-[var(--text)] text-[var(--bg)] shadow-xs"
                      : "border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text)]"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredGuides.map((guide) => (
              <details
                key={guide.id}
                className="group rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-4 transition-colors open:bg-[var(--surface)]/90"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-xs font-semibold text-[var(--text)] select-none list-none">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="inline-flex rounded border border-[var(--border-subtle)] bg-[var(--card)] px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-secondary)] shrink-0">
                      {guide.tag}
                    </span>
                    <span className="truncate">{guide.title}</span>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200 group-open:rotate-180" />
                </summary>

                <div className="mt-3 pt-3 border-t border-[var(--border-subtle)]/70 text-xs space-y-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold">
                      Symptom
                    </span>
                    <p className="mt-1 text-[var(--text-secondary)] leading-relaxed">
                      {guide.symptom}
                    </p>
                  </div>

                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold">
                      Resolution Checklist
                    </span>
                    <ul className="mt-1 space-y-1.5 text-[var(--text)]">
                      {guide.resolution.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-emerald-500 font-mono text-[11px] shrink-0 font-bold">
                            {idx + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {guide.snippet ? (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--muted)] font-semibold">
                          Configuration Snippet
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopy(guide.id, guide.snippet!)}
                          className="flex items-center gap-1 text-[10px] font-mono text-[var(--muted)] hover:text-[var(--text)] active:scale-95 transition-all"
                        >
                          {copiedMap[guide.id] ? (
                            <Check className="h-3 w-3 text-emerald-500" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedMap[guide.id] ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                      <pre className="overflow-x-auto rounded-md border border-[var(--border-subtle)] bg-[var(--card)] p-2.5 font-mono text-[11px] text-[var(--text)] leading-relaxed">
                        <code>{guide.snippet}</code>
                      </pre>
                    </div>
                  ) : null}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Direct Inquiry & Bug Report Form */}
        <section
          id="inquiry-form"
          aria-label="Direct Inquiry Form"
          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-5 sm:p-6"
        >
          <div className="mb-6 pb-4 border-b border-[var(--border-subtle)]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold text-[var(--text)]">
                {isBug ? "Submit a Bug Report" : "Send an Inquiry"}
              </h2>
              <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                Direct founder response to your inbox with instant automated receipt confirmation.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[var(--muted)] shrink-0">
              Avg. reply: under 4 hours
            </span>
          </div>

          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Check className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <h3 className="text-sm font-semibold text-[var(--text)]">
                {isBug ? "Bug Report Delivered" : "Inquiry Delivered"}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] max-w-md mx-auto">
                Thank you. We received your submission and sent an automated confirmation receipt to{" "}
                <strong className="text-[var(--text)]">{email}</strong>. The founder will follow up with you shortly.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setMessage("");
                  setSubject("");
                }}
                className="mt-3 inline-flex h-8 items-center justify-center rounded-md bg-[var(--surface)] border border-[var(--border-subtle)] px-3 text-xs font-medium text-[var(--text)] hover:bg-[var(--card)] active:scale-95 transition-all"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error ? (
                <div className="rounded-md border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                  {error}
                </div>
              ) : null}

              {/* Minimal Category Selector Tabs */}
              <div>
                <label className="block text-xs font-medium text-[var(--text)] mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {INQUIRY_CATEGORIES.map((cat) => {
                    const active = selectedInquiryCat === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedInquiryCat(cat.id)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all active:scale-95 ${
                          active
                            ? "bg-[var(--text)] text-[var(--bg)] shadow-xs"
                            : "border border-[var(--border-subtle)] bg-[var(--card)] text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--border)]"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email & Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="form-email"
                    className="block text-xs font-medium text-[var(--text)] mb-1"
                  >
                    Email Address <span className="text-[var(--primary)]">*</span>
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted)]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="form-name"
                    className="block text-xs font-medium text-[var(--text)] mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted)]"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label
                  htmlFor="form-subject"
                  className="block text-xs font-medium text-[var(--text)] mb-1"
                >
                  Subject
                </label>
                <input
                  id="form-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    isBug
                      ? "e.g. Cursor composer hangs when calling Meto tool"
                      : "e.g. MCP connection timeout or rule file sync question"
                  }
                  className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors placeholder:text-[var(--muted)]"
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="form-message"
                  className="block text-xs font-medium text-[var(--text)] mb-1"
                >
                  {isBug ? "Bug Description & Steps to Reproduce" : "Message Details"}
                  <span className="text-[var(--primary)]">*</span>
                </label>
                <textarea
                  id="form-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    isBug
                      ? "What happened? What was the expected result? Please mention your editor (Cursor, Claude, Windsurf, Antigravity) and any terminal logs..."
                      : "Please include any error messages, terminal logs, operating system, or editor versions..."
                  }
                  className="w-full rounded-md border border-[var(--border-subtle)] bg-[var(--card)] p-3 text-xs text-[var(--text)] outline-none focus:border-[var(--primary)] transition-colors resize-none leading-relaxed placeholder:text-[var(--muted)]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-[var(--primary)] hover:opacity-90 text-xs font-medium text-white shadow-xs transition-all active:scale-[0.97] disabled:opacity-50 px-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Sending inquiry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>{isBug ? "Submit Bug Report" : "Submit Inquiry"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      </main>

      <LandingPageFooter />
    </div>
  );
}
