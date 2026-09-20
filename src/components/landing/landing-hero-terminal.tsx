"use client";

import { useState } from "react";
import { Check, Copy, Terminal, Zap, Cpu, Sparkles } from "lucide-react";

export function LandingHeroTerminal() {
  const [activeTab, setActiveTab] = useState<"init" | "mcp">("init");
  const [copied, setCopied] = useState(false);

  const commands = {
    init: "npx @metoai/cli init",
    mcp: "npx -y @metoai/cli mcp",
  };

  function handleCopy() {
    void navigator.clipboard.writeText(commands[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full max-w-[740px] mx-auto mt-3 sm:mt-4">
      {/* Outer Shell & Ambient Glow */}
      <div className="relative rounded-2xl border border-gray-800/80 bg-[#0d1117] shadow-2xl overflow-hidden text-left transition-all duration-300">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-32 w-3/4 rounded-full bg-gradient-to-b from-[var(--primary)]/15 via-orange-500/5 to-transparent blur-2xl pointer-events-none" />

        {/* Terminal Header Bar */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-gray-800/80 bg-[#161b22]/90 px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-3">
            {/* macOS Window Controls */}
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56]/90 transition-opacity hover:opacity-100" />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]/90 transition-opacity hover:opacity-100" />
              <div className="h-3 w-3 rounded-full bg-[#27c93f]/90 transition-opacity hover:opacity-100" />
            </div>

            {/* Mode Selector Tabs */}
            <div className="ml-2 flex items-center gap-1 rounded-lg bg-[#0d1117] p-1 border border-gray-800/60">
              <button
                type="button"
                onClick={() => setActiveTab("init")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  activeTab === "init"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Zap className="h-3 w-3" />
                <span>Instant CLI</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("mcp")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                  activeTab === "mcp"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Cpu className="h-3 w-3" />
                <span>MCP Server</span>
              </button>
            </div>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-gray-700/80 bg-gray-800/60 px-2.5 py-1 text-xs font-mono text-gray-300 transition-all hover:border-gray-600 hover:bg-gray-700 hover:text-white active:scale-95"
            aria-label="Copy command"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-gray-400 hover:text-gray-200">{commands[activeTab]}</span>
              </>
            )}
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-5 font-mono text-xs sm:text-[13px] leading-relaxed text-gray-300 overflow-x-auto select-none">
          {activeTab === "init" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="text-white font-semibold">{commands.init}</span>
                <span className="inline-block h-3.5 w-1.5 bg-[var(--primary)] animate-pulse" />
              </div>

              <div className="text-orange-400 font-semibold pt-1">
                ⚡ METO IDENTITY ENGINE CLI v1.1.0
              </div>

              <div className="text-gray-400">
                🔍 Scanned Project: <span className="text-cyan-300 font-medium">my-awesome-app</span>
              </div>

              <div className="text-gray-400">
                Detected Stack: <span className="text-gray-200">Next.js 15, TypeScript, Tailwind CSS, Supabase</span>
              </div>

              <div className="text-emerald-400 font-medium pt-1">
                ✨ Success! Generated unified context rules:
              </div>

              <div className="pl-4 space-y-1 text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-white font-medium">.cursorrules</span>
                  <span className="text-gray-500">(Active for Cursor Editor)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-white font-medium">AGENTS.md</span>
                  <span className="text-gray-500">(Active for AI Agents & Antigravity)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-white font-medium">CLAUDE.md</span>
                  <span className="text-gray-500">(Active for Claude Code CLI)</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-gray-400 border-t border-gray-800/80">
                💡 Want to sync across all machines & AI assistants? <span className="text-orange-400 font-medium">npx meto login</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-gray-400 text-xs">
                // Add Meto MCP server to your <span className="text-cyan-300 font-medium">cursor.json</span> or <span className="text-cyan-300 font-medium">claude_desktop_config.json</span>
              </div>

              <pre className="rounded-lg bg-[#161b22] p-3.5 text-xs text-emerald-300 border border-gray-800 overflow-x-auto leading-relaxed">
{`{
  "mcpServers": {
    "meto": {
      "command": "npx",
      "args": ["-y", "@metoai/cli", "mcp"]
    }
  }
}`}
              </pre>

              <div className="text-gray-400 text-xs pt-1">
                ⚡ Gives Cursor, Claude Desktop, and Antigravity live access to your <span className="text-white font-medium">Meto Identity Profile</span>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
