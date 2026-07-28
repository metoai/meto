"use client";

import { useState } from "react";
import { Check, Copy, Terminal, Zap, Cpu, Sparkles } from "lucide-react";

export function LandingHeroTerminal() {
  const [activeTab, setActiveTab] = useState<"init" | "mcp">("init");
  const [copied, setCopied] = useState(false);

  const commands = {
    init: "npx meto init",
    mcp: "npx -y meto mcp",
  };

  function handleCopy() {
    void navigator.clipboard.writeText(commands[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full max-w-[820px] mx-auto mt-10">
      {/* Outer Shell & Glow */}
      <div className="relative rounded-2xl border border-[var(--border)] bg-[#0d1117] shadow-2xl overflow-hidden text-left transition-all duration-300">
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-36 w-3/4 rounded-full bg-gradient-to-b from-[var(--primary)]/20 via-orange-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Terminal Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 bg-[#161b22] px-4 py-3 sm:px-5">
          <div className="flex items-center gap-3">
            {/* macOS Dot Controls */}
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
            </div>

            {/* Mode Selector Tabs */}
            <div className="ml-2 flex items-center gap-1 rounded-lg bg-[#0d1117] p-1 border border-gray-800">
              <button
                type="button"
                onClick={() => setActiveTab("init")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  activeTab === "init"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Zap className="h-3 w-3" />
                <span>Instant CLI (`npx meto`)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("mcp")}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                  activeTab === "mcp"
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                <Cpu className="h-3 w-3" />
                <span>MCP Server Setup</span>
              </button>
            </div>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-800/80 px-3 py-1.5 text-xs font-mono font-medium text-gray-200 transition-all hover:border-gray-600 hover:bg-gray-700 active:scale-95"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-gray-400" />
                <span>{commands[activeTab]}</span>
              </>
            )}
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed text-gray-300 overflow-x-auto select-none">
          {activeTab === "init" ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400">
                <span className="text-emerald-400 font-bold">$</span>
                <span className="text-white font-semibold">{commands.init}</span>
              </div>

              <div className="text-orange-400 font-bold mt-2">
                ⚡ METO IDENTITY ENGINE CLI v1.0.0
              </div>

              <div className="text-gray-400">
                🔍 Scanned Project: <span className="text-cyan-300 font-semibold">my-awesome-app</span>
              </div>

              <div className="text-gray-400">
                Detected Stack: <span className="text-gray-200">Next.js 15, TypeScript, Tailwind CSS, Supabase</span>
              </div>

              <div className="text-emerald-400 font-medium pt-1">
                ✨ Success! Meto context files generated:
              </div>

              <div className="pl-4 space-y-0.5 text-gray-300">
                <div><span className="text-emerald-400">✓</span> .cursorrules <span className="text-gray-500">(for Cursor Editor)</span></div>
                <div><span className="text-emerald-400">✓</span> AGENTS.md <span className="text-gray-500">(for AI Agents & Antigravity)</span></div>
                <div><span className="text-emerald-400">✓</span> CLAUDE.md <span className="text-gray-500">(for Claude Code CLI)</span></div>
              </div>

              <div className="pt-2 text-gray-400 border-t border-gray-800/80">
                💡 Want to sync across all your machines & AI assistants? <span className="text-orange-400">npx meto login</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-gray-400">
                // Add Meto MCP server to your <span className="text-cyan-300 font-semibold">cursor.json</span> or <span className="text-cyan-300 font-semibold">claude_desktop_config.json</span>
              </div>

              <pre className="rounded-lg bg-[#161b22] p-3 text-xs text-emerald-300 border border-gray-800 overflow-x-auto">
{`{
  "mcpServers": {
    "meto": {
      "command": "npx",
      "args": ["-y", "meto", "mcp"]
    }
  }
}`}
              </pre>

              <div className="text-gray-400 text-xs pt-1">
                ⚡ Gives Cursor, Claude Desktop, and Antigravity live access to your <span className="text-white">Meto Identity Profile</span>.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
