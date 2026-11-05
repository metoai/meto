"use client";

import { useState } from "react";
import {
  Check,
  Eye,
  EyeOff,
  Terminal,
  ShieldCheck,
  Copy,
  Radio,
  FileCode,
} from "lucide-react";
import {
  ContentConnectedCompilerFigure,
  ContentConnectedMcpRouterFigure,
  ContentConnectedPrivacyVaultFigure,
  ContentConnectedSyncTreeFigure,
} from "@/components/landing/isometric-motion-figures";

type Format = "claude" | "cursor" | "chatgpt" | "universal";

const FORMAT_PREVIEWS: Record<
  Format,
  { label: string; file: string; tokens: string; reduction: string; snippet: string }
> = {
  claude: {
    label: "Claude",
    file: "claude-project.xml",
    tokens: "1.8k tokens",
    reduction: "-62%",
    snippet: `<system_prompt>\n  <role>Senior Full-Stack Engineer</role>\n  <rules strict="true">Next.js 16, Supabase, Strict TS</rules>\n</system_prompt>`,
  },
  cursor: {
    label: "Cursor",
    file: ".cursorrules",
    tokens: "1.6k tokens",
    reduction: "-66%",
    snippet: `# Cursor Rules (Synced via Meto)\n- Prefer Server Actions over API routes\n- Enforce Zod validation on all external inputs`,
  },
  chatgpt: {
    label: "ChatGPT",
    file: "custom-instructions.txt",
    tokens: "1.9k tokens",
    reduction: "-60%",
    snippet: `You are pair-programming on Meto.\nDirect, senior tone. Show diffs first, explanation second.`,
  },
  universal: {
    label: "Universal",
    file: "context.json",
    tokens: "2.1k tokens",
    reduction: "-56%",
    snippet: `{\n  "version": "2.0",\n  "identity": "Alazar / Full-Stack",\n  "stack": ["Next.js", "Supabase", "MCP"]\n}`,
  },
};

export function LandingHowItWorksDemo() {
  // Card 1: Compiler format state
  const [activeFormat, setActiveFormat] = useState<Format>("claude");
  const [pruneTasks, setPruneTasks] = useState(true);
  const [formatSyntax, setFormatSyntax] = useState(true);

  // Card 2: Copied feedback
  const [copiedMcp, setCopiedMcp] = useState(false);

  // Card 3: Mask secrets toggle
  const [isMasked, setIsMasked] = useState(true);

  const activeData = FORMAT_PREVIEWS[activeFormat];

  // Dynamic token calculation based on toggles
  const effectiveReduction =
    pruneTasks && formatSyntax
      ? activeData.reduction
      : pruneTasks || formatSyntax
      ? "-35%"
      : "0%";

  const effectiveTokens =
    pruneTasks && formatSyntax
      ? activeData.tokens
      : pruneTasks || formatSyntax
      ? "3.2k tokens"
      : "4.8k raw";

  function handleCopyMcp() {
    navigator.clipboard.writeText(
      JSON.stringify(
        {
          mcpServers: {
            meto: {
              url: "https://www.metoctx.com/api/mcp/alazar",
              headers: { Authorization: "Bearer meto_live_••••••••" },
            },
          },
        },
        null,
        2
      )
    );
    setCopiedMcp(true);
    setTimeout(() => setCopiedMcp(false), 2000);
  }

  // Shared card surface classes
  const cardCls =
    "rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-neutral-900/70 p-5 sm:p-7 " +
    "shadow-[0_2px_12px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-between overflow-hidden " +
    "transition-all duration-200 hover:border-black/[0.14] dark:hover:border-white/[0.15]";

  // Shared stage surface
  const stageCls =
    "rounded-xl border border-black/[0.06] dark:border-white/[0.07] bg-neutral-50/80 dark:bg-neutral-950/70 p-3.5 sm:p-4.5 w-full";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full">
      {/* ─────────────────────────────────────────────────────────────
          CARD 1 (7 Cols): Multi-Model Context Compiler
      ───────────────────────────────────────────────────────────── */}
      <div className={`lg:col-span-7 ${cardCls}`}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-[17px] sm:text-[19px] font-semibold text-neutral-950 dark:text-white tracking-tight">
              Multi-Model Context Compiler
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {effectiveReduction} token overhead
            </span>
          </div>
          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-xl mb-4 sm:mb-5">
            Meto formats and compresses your structured profile into model-specific prompts, cutting token overhead by up to 60%.
          </p>
        </div>

        <div className={`${stageCls} space-y-3.5`}>
          {/* Top Bar: Model Tabs + Compression Pill */}
          <div className="flex items-center justify-between gap-2 border-b border-black/[0.05] dark:border-white/[0.06] pb-2.5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {(["claude", "cursor", "chatgpt", "universal"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setActiveFormat(fmt)}
                  className={`px-2.5 py-1 rounded-md text-[11px] sm:text-[12px] font-medium transition-all duration-150 active:scale-[0.97] ${
                    activeFormat === fmt
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {FORMAT_PREVIEWS[fmt].label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500 hidden sm:inline">
              Output: <strong className="text-neutral-900 dark:text-neutral-200">{effectiveTokens}</strong>
            </span>
          </div>

          {/* Interactive Code Preview & Pointer-Reactive Custom Isometric Figure */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Left: Code Snippet */}
            <div className="md:col-span-7 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.08] p-3 font-mono text-[11px] sm:text-[11.5px] text-neutral-700 dark:text-neutral-300 overflow-x-auto min-h-[140px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-black/[0.04] dark:border-white/[0.04] text-[10px] text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-neutral-500" />
                    {activeData.file}
                  </span>
                  <span>UTF-8 · Ready</span>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">{activeData.snippet}</pre>
              </div>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-black/[0.04] dark:border-white/[0.04] text-[10px] text-neutral-400">
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={pruneTasks}
                    onChange={(e) => setPruneTasks(e.target.checked)}
                    className="rounded border-neutral-300 dark:border-neutral-600 text-[var(--primary)] focus:ring-0"
                  />
                  <span>Prune tasks</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formatSyntax}
                    onChange={(e) => setFormatSyntax(e.target.checked)}
                    className="rounded border-neutral-300 dark:border-neutral-600 text-[var(--primary)] focus:ring-0"
                  />
                  <span>Optimize syntax</span>
                </label>
              </div>
            </div>

            {/* Right: Content-Connected Exploded Compiler Isometric Figure */}
            <div className="md:col-span-5 flex flex-col items-center justify-center p-2 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-black/[0.04] dark:border-white/[0.06] relative group">
              <span className="text-[9.5px] font-mono text-neutral-400 dark:text-neutral-500 mb-1 tracking-wider uppercase">
                Compiler Layers
              </span>
              <div className="w-full max-w-[210px] aspect-[5/4]">
                <ContentConnectedCompilerFigure
                  format={activeFormat}
                  tokens={effectiveTokens}
                  reduction={effectiveReduction}
                  intensity={0.6}
                  play={true}
                />
              </div>
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                Move pointer to open layers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2 (5 Cols): Route to Any IDE or Model (Live MCP)
      ───────────────────────────────────────────────────────────── */}
      <div className={`lg:col-span-5 ${cardCls}`}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-[17px] sm:text-[19px] font-semibold text-neutral-950 dark:text-white tracking-tight">
              Route to Any IDE or Model
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live MCP
            </span>
          </div>
          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
            Broadcast your developer identity and project context across every AI tool via live MCP or 1-click clipboard presets.
          </p>
        </div>

        <div className={`${stageCls} space-y-3`}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Left: Connected Targets */}
            <div className="sm:col-span-7 space-y-1.5 font-mono text-[11px]">
              {[
                { name: "Cursor IDE", ping: "14ms", status: "Active" },
                { name: "Claude Desktop", ping: "22ms", status: "Active" },
                { name: "Claude Code CLI", ping: "8ms", status: "Active" },
              ].map((client) => (
                <div
                  key={client.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.05] dark:border-white/[0.06]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Terminal className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span className="text-neutral-800 dark:text-neutral-200 font-medium truncate">
                      {client.name}
                    </span>
                  </div>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] flex items-center gap-1 shrink-0">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    {client.status}
                  </span>
                </div>
              ))}

              <div className="pt-1.5">
                <button
                  type="button"
                  onClick={handleCopyMcp}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 font-sans text-[11px] font-medium shadow-xs transition-transform active:scale-[0.97]"
                >
                  {copiedMcp ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMcp ? "Config Copied!" : "Copy MCP Quick-Connect"}</span>
                </button>
              </div>
            </div>

            {/* Right: Content-Connected MCP Router Hub Isometric Figure */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-black/[0.04] dark:border-white/[0.06] relative group">
              <span className="text-[9.5px] font-mono text-neutral-400 dark:text-neutral-500 mb-1 tracking-wider uppercase">
                Dynamic Hub Sync
              </span>
              <div className="w-full max-w-[190px] aspect-[5/4]">
                <ContentConnectedMcpRouterFigure copied={copiedMcp} intensity={0.7} play={true} />
              </div>
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                Hover to illuminate links
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3 (6 Cols): Granular Privacy & Secret Isolation
      ───────────────────────────────────────────────────────────── */}
      <div className={`lg:col-span-6 ${cardCls}`}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-[17px] sm:text-[19px] font-semibold text-neutral-950 dark:text-white tracking-tight">
              Granular Privacy & Secret Isolation
            </h3>
            <button
              type="button"
              onClick={() => setIsMasked(!isMasked)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all active:scale-[0.96]"
            >
              {isMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isMasked ? "Reveal secrets" : "Mask secrets"}</span>
            </button>
          </div>
          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
            Control exactly what each AI sees. Private client projects, internal credentials, and sensitive notes are strictly isolated before handoff.
          </p>
        </div>

        <div className={`${stageCls} space-y-3`}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Left: Stored vs Exported Isolation */}
            <div className="sm:col-span-7 space-y-2">
              <div className="rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.05] dark:border-white/[0.06] p-2.5 space-y-1.5 font-mono text-[10.5px]">
                <div className="flex items-center justify-between p-1 rounded bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-neutral-700 dark:text-neutral-300 truncate">Client NDA</span>
                  <span className="text-[9px] px-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    Private
                  </span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-neutral-700 dark:text-neutral-300 truncate">API Credentials</span>
                  <span className="text-[9px] px-1 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                    Secret
                  </span>
                </div>
                <div className="flex items-center justify-between p-1 rounded bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-neutral-700 dark:text-neutral-300 truncate">Coding Standards</span>
                  <span className="text-[9px] px-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Public
                  </span>
                </div>
              </div>

              {/* Safe Payload Preview */}
              <div className="rounded-lg bg-neutral-900 dark:bg-black p-2 font-mono text-[10px] text-neutral-300 border border-black/10 dark:border-white/10">
                <span className="text-neutral-500 block text-[9px] uppercase">Exported to AI:</span>
                <div>NDA: <span className="text-amber-400 font-semibold">[STRIPPED]</span></div>
                <div>KEY: {isMasked ? "sk-••••••••" : "sk-proj-7x9..."}</div>
              </div>
            </div>

            {/* Right: Content-Connected Privacy Vault Isometric Figure */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-black/[0.04] dark:border-white/[0.06] relative group">
              <span className="text-[9.5px] font-mono text-neutral-400 dark:text-neutral-500 mb-1 tracking-wider uppercase">
                Hardware Vault
              </span>
              <div className="w-full max-w-[190px] aspect-[5/4]">
                <ContentConnectedPrivacyVaultFigure isMasked={isMasked} intensity={0.7} play={true} />
              </div>
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                Circle pointer to turn dial
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 4 (6 Cols): Cross-Tool Rule & Identity Sync
      ───────────────────────────────────────────────────────────── */}
      <div className={`lg:col-span-6 ${cardCls}`}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-[17px] sm:text-[19px] font-semibold text-neutral-950 dark:text-white tracking-tight">
              Cross-Tool Rule & Identity Sync
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-black/[0.06] dark:border-white/[0.08]">
              <Radio className="w-3 h-3 text-[var(--primary)]" />
              1 Source of Truth
            </span>
          </div>
          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
            Switch seamlessly between Cursor, Claude Code, Windsurf, and terminal agents without losing your coding rules, architectural guidelines, or tech stack.
          </p>
        </div>

        <div className={`${stageCls} space-y-3`}>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            {/* Left: Active Enforced Rule and Sync Targets */}
            <div className="sm:col-span-7 space-y-2">
              <div className="p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.05] dark:border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
                    Enforced Everywhere
                  </span>
                  <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                    ● Synced
                  </span>
                </div>

                <div className="rounded bg-neutral-50 dark:bg-neutral-800/80 p-1.5 font-mono text-[10.5px] text-neutral-700 dark:text-neutral-300">
                  <code>&quot;Use Server Actions; named exports only.&quot;</code>
                </div>
              </div>

              {/* Sync Targets Grid */}
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px]">
                <div className="p-1.5 rounded bg-white dark:bg-neutral-900 border border-black/[0.04] dark:border-white/[0.06] text-center truncate">
                  <span className="text-neutral-400 block text-[8.5px]">Cursor</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">.cursorrules</span>
                </div>
                <div className="p-1.5 rounded bg-white dark:bg-neutral-900 border border-black/[0.04] dark:border-white/[0.06] text-center truncate">
                  <span className="text-neutral-400 block text-[8.5px]">Claude</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">CLAUDE.md</span>
                </div>
                <div className="p-1.5 rounded bg-white dark:bg-neutral-900 border border-black/[0.04] dark:border-white/[0.06] text-center truncate">
                  <span className="text-neutral-400 block text-[8.5px]">Terminal</span>
                  <span className="font-medium text-neutral-800 dark:text-neutral-200">MCP Live</span>
                </div>
              </div>
            </div>

            {/* Right: Content-Connected Cross-Tool Sync Tree Isometric Figure */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-2 rounded-lg bg-white/70 dark:bg-neutral-900/60 border border-black/[0.04] dark:border-white/[0.06] relative group">
              <span className="text-[9.5px] font-mono text-neutral-400 dark:text-neutral-500 mb-1 tracking-wider uppercase">
                Live Commit Graph
              </span>
              <div className="w-full max-w-[190px] aspect-[5/4]">
                <ContentConnectedSyncTreeFigure intensity={0.7} play={true} />
              </div>
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                Hover to elevate branch nodes
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
