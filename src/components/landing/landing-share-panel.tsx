"use client";

import { useState } from "react";
import { Check, Copy, Terminal, ShieldCheck, Lock, Cpu } from "lucide-react";

type IntegrationTab = "claude" | "cursor" | "cli";

const CODE_SNIPPETS: Record<IntegrationTab, { filename: string; code: string; language: string }> = {
  claude: {
    filename: "claude_desktop_config.json",
    language: "json",
    code: `{
  "mcpServers": {
    "meto": {
      "command": "npx",
      "args": ["-y", "@meto/mcp@latest", "serve"]
    }
  }
}`,
  },
  cursor: {
    filename: "Cursor MCP / .cursorrules",
    language: "bash",
    code: `# 1. Add Meto server in Cursor Settings > Features > MCP
# Name: meto | Command: npx -y @meto/mcp@latest serve

# 2. Or initialize local project rules
npx meto init --cursor`,
  },
  cli: {
    filename: "Terminal",
    language: "bash",
    code: `# Inspect active identity and cross-model memories
$ npx meto whoami
# ✓ Alex Mercer (Senior Full-Stack Engineer)
# ✓ Synced: Claude Desktop, Cursor, Next.js 15
# ✓ 89 memories active across 4 repositories`,
  },
};

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Zero Model Training",
    description: "Your identity and codebase rules are never used to train frontier LLMs.",
  },
  {
    icon: Lock,
    title: "Local-First & Encrypted",
    description: "All MCP tokens and local configs are secured with AES-256 encryption.",
  },
  {
    icon: Cpu,
    title: "Open MCP Standard",
    description: "Fully compatible with any Model Context Protocol agent or client.",
  },
];

export function LandingSharePanel() {
  const [activeTab, setActiveTab] = useState<IntegrationTab>("claude");
  const [copied, setCopied] = useState(false);

  const currentSnippet = CODE_SNIPPETS[activeTab];

  async function handleCopy() {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentSnippet.code);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="landing-panel overflow-hidden border border-black/[0.08] dark:border-white/10 bg-white/90 dark:bg-[#111113]/90 shadow-[0_4px_24px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.5)]">
      {/* Top Header & Tab Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] px-4 sm:px-6 py-3.5 gap-3 bg-black/[0.02] dark:bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[12px] font-mono font-medium text-[var(--text)]">
            Universal MCP Integration
          </span>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.06] self-start sm:self-auto">
          {(
            [
              { id: "claude", label: "Claude Desktop" },
              { id: "cursor", label: "Cursor" },
              { id: "cli", label: "CLI" },
            ] as const
          ).map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setCopied(false);
                }}
                className={`rounded-lg px-3 py-1 text-[12px] font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-white dark:bg-[#1e1e20] text-[var(--text)] shadow-xs"
                    : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Snippet Box */}
      <div className="p-4 sm:p-6 bg-[#0a0c10] text-gray-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-800 text-[11px] font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span>{currentSnippet.filename}</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-md bg-gray-800/80 px-2.5 py-1 text-[11px] font-mono text-gray-300 transition-all hover:bg-gray-700 hover:text-white active:scale-95"
            aria-label="Copy snippet to clipboard"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3 text-gray-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <pre className="mt-3.5 overflow-x-auto font-mono text-[12.5px] sm:text-[13px] leading-relaxed text-gray-300 selection:bg-[var(--primary)] selection:text-white">
          <code>{currentSnippet.code}</code>
        </pre>
      </div>

      {/* Security & Privacy Trust Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.06] dark:divide-white/[0.08] border-t border-black/[0.06] dark:border-white/[0.08] bg-black/[0.015] dark:bg-white/[0.015]">
        {TRUST_PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div key={pillar.title} className="p-4 sm:p-5 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] mt-0.5">
                <Icon className="h-4 w-4 stroke-[2]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-[13px] font-semibold text-[var(--text)] leading-snug">
                  {pillar.title}
                </h4>
                <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--text-secondary)]">
                  {pillar.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
