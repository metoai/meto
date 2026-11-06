"use client";

import React, { useState } from "react";

type FigureBaseProps = {
  className?: string;
  intensity?: number;
  play?: boolean;
};

/* ─────────────────────────────────────────────────────────────────────────────
   PRECISE OFFICIAL-SPEC VECTOR LOGOS
───────────────────────────────────────────────────────────────────────────── */
export function ClaudeLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Claude by Anthropic">
      <path
        d="M12 2.5L13.8 8.2C14.1 9.1 14.9 9.9 15.8 10.2L21.5 12L15.8 13.8C14.9 14.1 14.1 14.9 13.8 15.8L12 21.5L10.2 15.8C9.9 14.9 9.1 14.1 8.2 13.8L2.5 12L8.2 10.2C9.1 9.9 9.9 9.1 10.2 8.2L12 2.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function CursorLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Cursor IDE">
      <path
        d="M5 3.5L18.5 12L12 14L10 20.5L5 3.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 14L17.5 19.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function OpenAILogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-label="OpenAI ChatGPT">
      <path d="M20.5 9.5a5.5 5.5 0 0 0-.4-4.2 5.6 5.6 0 0 0-4.6-2.8 5.7 5.7 0 0 0-4 1.5 5.6 5.6 0 0 0-6.8 2.2 5.5 5.5 0 0 0-.8 4.2 5.5 5.5 0 0 0 .4 4.2 5.6 5.6 0 0 0 4.6 2.8c.3 0 .7 0 1-.1a5.6 5.6 0 0 0 9.8-.7 5.5 5.5 0 0 0 .8-4.2v-2.9zm-7.5 11.5a4.1 4.1 0 0 1-2.9-1.2l.1-.1 4.3-2.5a.8.8 0 0 0 .4-.7v-5.2l1.6.9v4.7a4.1 4.1 0 0 1-3.5 4.1zm-8.3-4.1a4.1 4.1 0 0 1-.5-3.1 4.2 4.2 0 0 1 2-2.5l.1.1v5a.8.8 0 0 0 .4.7l4.5 2.6-1.6.9-4.9-2.8v-.9zm-1.1-7.9a4.1 4.1 0 0 1 2.4-2 4.2 4.2 0 0 1 3.2.1l-.1.1-4.3 2.5a.8.8 0 0 0-.4.7v5.2l-1.6-.9V7.1l.8-.1zm13.8 2.2l-4.5-2.6 1.6-.9 4.9 2.8v.9a4.1 4.1 0 0 1 .5 3.1 4.2 4.2 0 0 1-2 2.5l-.1-.1v-5a.8.8 0 0 0-.4-.7zm2.4-2.2a4.1 4.1 0 0 1-2.4 2 4.2 4.2 0 0 1-3.2-.1l.1-.1 4.3-2.5a.8.8 0 0 0 .4-.7V2.5l1.6.9v3.8l-.8.1zM9.5 13.8l-1.6-.9 4.5-2.6 1.6.9-4.5 2.6z" />
    </svg>
  );
}

export function TerminalLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Terminal CLI">
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 9.5L10.5 12L7 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="13" y1="14.5" x2="17" y2="14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function WindsurfLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Windsurf">
      <path
        d="M3 15.5C6.5 12.5 9 12.5 12 15.5C15 18.5 17.5 18.5 21 15.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M12 4.5V19.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MetoMark({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Meto">
      <polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. COMPILER FIGURE: Unslop AST Optimization Pipeline
   Clean geometry, precise model targets, zero neon fuzz.
───────────────────────────────────────────────────────────────────────────── */
type CompilerFigureProps = FigureBaseProps & {
  format?: "claude" | "cursor" | "chatgpt" | "universal";
  tokens?: string;
  reduction?: string;
};

export function ContentConnectedCompilerFigure({
  format = "claude",
  tokens = "1.8k tokens",
  reduction = "-62%",
  className = "",
}: CompilerFigureProps) {
  const fileNames: Record<string, string> = {
    claude: "claude-project.xml",
    cursor: ".cursorrules",
    chatgpt: "custom-instructions.txt",
    universal: "context.json",
  };
  const activeFile = fileNames[format] || "claude-project.xml";

  return (
    <div className={`w-full py-2.5 select-none ${className}`}>
      {/* High-Precision Pipeline Conduits */}
      <div className="relative w-full flex items-center justify-between gap-3 px-2 sm:px-6 py-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
        {/* Subtle Static Path with Micro Progress Diode */}
        <div className="absolute inset-x-8 sm:inset-x-12 top-1/2 -translate-y-1/2 h-[1px] bg-black/[0.08] dark:bg-white/[0.1] -z-0">
          <div className="w-1/4 h-full bg-emerald-500/80 transition-all duration-300" />
        </div>

        {/* Input Stage: Raw Developer Context */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 min-w-[70px]">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center text-neutral-800 dark:text-neutral-200">
            <MetoMark className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            RAW PROFILE
          </span>
          <span className="text-[9.5px] font-mono text-neutral-400 dark:text-neutral-500">
            4.8k tokens
          </span>
        </div>

        {/* Central Core: AST Pruning Engine */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className="w-8 h-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center shadow-xs">
            <span className="text-[9px] font-mono font-bold tracking-tight">AST</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {reduction} PRUNED
          </span>
        </div>

        {/* Output Stage: Model Target Logo */}
        <div className="relative z-10 flex flex-col items-center gap-1.5 min-w-[70px]">
          <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center text-neutral-900 dark:text-white transition-transform duration-150 active:scale-[0.97]">
            {format === "claude" && <ClaudeLogo className="w-5 h-5 text-amber-600 dark:text-amber-500" />}
            {format === "cursor" && <CursorLogo className="w-4 h-4 text-neutral-900 dark:text-white" />}
            {format === "chatgpt" && <OpenAILogo className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
            {format === "universal" && <TerminalLogo className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />}
          </div>
          <span className="text-[10px] font-mono font-medium text-neutral-800 dark:text-neutral-200">
            {activeFile}
          </span>
          <span className="text-[9.5px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            {tokens}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. MCP ROUTER FIGURE: Live Bus Conduits to Precise Client Logos
───────────────────────────────────────────────────────────────────────────── */
export function ContentConnectedMcpRouterFigure({
  className = "",
}: FigureBaseProps) {
  const clients = [
    {
      name: "Cursor IDE",
      ping: "14ms",
      logo: <CursorLogo className="w-4 h-4 text-neutral-900 dark:text-white" />,
    },
    {
      name: "Claude Desktop",
      ping: "22ms",
      logo: <ClaudeLogo className="w-4 h-4 text-amber-600 dark:text-amber-500" />,
    },
    {
      name: "Claude Code CLI",
      ping: "8ms",
      logo: <TerminalLogo className="w-4 h-4 text-neutral-800 dark:text-neutral-200" />,
    },
  ];

  return (
    <div className={`w-full py-2.5 select-none ${className}`}>
      <div className="w-full flex flex-col gap-3 px-3 sm:px-5 py-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
        {/* Router Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-mono font-semibold text-neutral-900 dark:text-neutral-100">
              METO MCP GATEWAY
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
            localhost:3000 · SSE
          </span>
        </div>

        {/* Client Bus Matrix */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-between sm:flex-col sm:items-start p-2.5 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.08] shadow-2xs hover:border-black/[0.12] dark:hover:border-white/[0.14] transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded flex items-center justify-center">
                  {client.logo}
                </div>
                <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                  {client.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 sm:mt-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                  {client.ping}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. PRIVACY VAULT FIGURE: Mechanical Hardware Isolation Wall
───────────────────────────────────────────────────────────────────────────── */
type PrivacyVaultFigureProps = FigureBaseProps & {
  isMasked?: boolean;
};

export function ContentConnectedPrivacyVaultFigure({
  isMasked = true,
  className = "",
}: PrivacyVaultFigureProps) {
  return (
    <div className={`w-full py-2.5 select-none ${className}`}>
      <div className="w-full flex flex-col gap-3 px-3 sm:px-5 py-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
        {/* Status Line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                isMasked ? "bg-rose-500" : "bg-emerald-500"
              }`}
            />
            <span className="text-[11px] font-mono font-semibold text-neutral-900 dark:text-neutral-100">
              {isMasked ? "ISOLATION ACTIVE" : "SHIELD LIFTED"}
            </span>
          </div>
          <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
            Hardware Guard
          </span>
        </div>

        {/* Dual Chamber Comparison */}
        <div className="grid grid-cols-2 gap-2">
          {/* Chamber 1: Restricted Vault */}
          <div
            className={`p-2.5 rounded-lg border transition-colors duration-200 ${
              isMasked
                ? "bg-rose-500/[0.04] border-rose-500/20 text-rose-700 dark:text-rose-400"
                : "bg-white dark:bg-neutral-900 border-black/[0.06] dark:border-white/[0.08] text-neutral-800 dark:text-neutral-200"
            }`}
          >
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              RESTRICTED VAULT
            </div>
            <div className="text-[11px] font-mono font-medium truncate">
              {isMasked ? "sk-••••••••" : "sk-proj-7x9"}
            </div>
          </div>

          {/* Chamber 2: Public Egress */}
          <div className="p-2.5 rounded-lg bg-emerald-500/[0.04] border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider mb-1">
              PUBLIC EGRESS
            </div>
            <div className="text-[11px] font-mono font-medium">
              Rules & Persona
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. SYNC TREE FIGURE: Precise Multi-Agent Single Truth Matrix
───────────────────────────────────────────────────────────────────────────── */
export function ContentConnectedSyncTreeFigure({
  className = "",
}: FigureBaseProps) {
  const syncTargets = [
    {
      name: "Cursor",
      file: ".cursorrules",
      logo: <CursorLogo className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />,
    },
    {
      name: "Claude",
      file: "CLAUDE.md",
      logo: <ClaudeLogo className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" />,
    },
    {
      name: "Terminal",
      file: "MCP Gateway",
      logo: <TerminalLogo className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200" />,
    },
    {
      name: "Windsurf",
      file: ".windsurfrules",
      logo: <WindsurfLogo className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
    },
  ];

  return (
    <div className={`w-full py-2.5 select-none ${className}`}>
      <div className="w-full flex flex-col gap-3 px-3 sm:px-5 py-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/[0.06]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-mono font-semibold text-neutral-900 dark:text-neutral-100">
              METO SINGLE TRUTH (v2.4)
            </span>
          </div>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
            In Sync · 0ms drift
          </span>
        </div>

        {/* 4 Tool Nodes */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {syncTargets.map((target) => (
            <div
              key={target.name}
              className="p-2 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.06] dark:border-white/[0.08] shadow-2xs flex flex-col gap-1"
            >
              <div className="flex items-center justify-between">
                <div className="w-5 h-5 rounded flex items-center justify-center">
                  {target.logo}
                </div>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </div>
              <span className="text-[10.5px] font-mono font-medium text-neutral-800 dark:text-neutral-200 truncate">
                {target.file}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
