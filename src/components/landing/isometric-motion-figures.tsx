"use client";

import React, { useId, useState } from "react";

type FigureBaseProps = {
  className?: string;
  intensity?: number;
  play?: boolean;
};

/* ─────────────────────────────────────────────────────────────────────────────
   PRECISE BRAND LOGOS (Vector SVGs)
───────────────────────────────────────────────────────────────────────────── */
export function ClaudeLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Claude">
      <path
        d="M12 3v18M3 12h18M5.64 5.64l12.72 12.72M18.36 5.64L5.64 18.36"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

export function CursorLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Cursor">
      <path
        d="M5.5 3.5l13 8.5-6.5 2-2 6.5-4.5-17z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OpenAILogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="OpenAI">
      <path
        d="M12 2a4 4 0 0 1 3.8 2.8L12 8.5 8.2 4.8A4 4 0 0 1 12 2zm6.9 4a4 4 0 0 1 1.1 4.7l-6 1.8 1.8-6A4 4 0 0 1 18.9 6zM22 12a4 4 0 0 1-2.8 3.8L15.5 12l3.7-3.8A4 4 0 0 1 22 12zm-4 6.9a4 4 0 0 1-4.7 1.1l-1.8-6 6 1.8a4 4 0 0 1 .5 3.1zM12 22a4 4 0 0 1-3.8-2.8L12 15.5l3.8 3.7A4 4 0 0 1 12 22zm-6.9-4a4 4 0 0 1-1.1-4.7l6-1.8-1.8 6a4 4 0 0 1-.5-3.1zM2 12a4 4 0 0 1 2.8-3.8L8.5 12 4.8 15.8A4 4 0 0 1 2 12zm4-6.9a4 4 0 0 1 4.7-1.1l1.8 6-6-1.8a4 4 0 0 1-.5-3.1z"
        fill="currentColor"
      />
    </svg>
  );
}

export function TerminalLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Terminal">
      <rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="2" />
      <path d="M7 9l4 3-4 3M13 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function MetoCoreLogo({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-label="Meto">
      <polygon
        points="12,2 21,7 21,17 12,22 3,17 3,7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3.5" fill="currentColor" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   1. COMPILER FIGURE: Logo Transformation Beam + Token Pruning Motion
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
    <div className={`w-full py-4 flex flex-col items-center justify-center select-none ${className}`}>
      {/* Motion Stage */}
      <div className="relative w-full max-w-[400px] h-[130px] flex items-center justify-between px-4 sm:px-8">
        {/* Animated Connecting Energy Beam */}
        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-[2px] bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-[var(--primary,theme(colors.amber.500))] to-transparent animate-[shimmer_2s_infinite]" />
        </div>

        {/* Source Node: Raw Profile */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-sm flex items-center justify-center text-neutral-700 dark:text-neutral-300">
            <MetoCoreLogo className="w-6 h-6 text-neutral-900 dark:text-white" />
          </div>
          <span className="text-[10.5px] font-mono text-neutral-400 dark:text-neutral-500 whitespace-nowrap">
            RAW PROFILE: 4.8k
          </span>
        </div>

        {/* Center: AST Compiler Core */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className="relative w-10 h-10 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-md">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping absolute" />
            <span className="text-[10px] font-mono font-bold">AST</span>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
            {reduction} PRUNED
          </span>
        </div>

        {/* Destination Node: Active Model Logo */}
        <div className="relative z-10 flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-sm flex items-center justify-center text-neutral-900 dark:text-white transition-transform duration-300 hover:scale-105">
            {format === "claude" && <ClaudeLogo className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
            {format === "cursor" && <CursorLogo className="w-5 h-5 text-neutral-900 dark:text-white" />}
            {format === "chatgpt" && <OpenAILogo className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
            {format === "universal" && <TerminalLogo className="w-6 h-6 text-sky-600 dark:text-sky-400" />}
          </div>
          <span className="text-[10.5px] font-mono font-semibold text-neutral-900 dark:text-neutral-200 whitespace-nowrap">
            {tokens}
          </span>
        </div>
      </div>

      {/* Target Spec Tag */}
      <div className="mt-2 text-[11px] font-mono text-neutral-400 dark:text-neutral-500 flex items-center gap-2">
        <span>Target:</span>
        <span className="text-neutral-800 dark:text-neutral-200 font-medium">{activeFile}</span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. MCP ROUTER FIGURE: Central Hub Radial Pulse to Precise Tool Logos
───────────────────────────────────────────────────────────────────────────── */
export function ContentConnectedMcpRouterFigure({
  className = "",
}: FigureBaseProps) {
  return (
    <div className={`w-full py-4 flex flex-col items-center justify-center select-none ${className}`}>
      {/* Visual Radial Routing Hub */}
      <div className="relative w-full max-w-[400px] h-[130px] flex items-center justify-between px-3 sm:px-6">
        {/* Animated Flux Line */}
        <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 h-[1px] bg-neutral-200 dark:bg-neutral-800">
          <div className="w-1/3 h-full bg-emerald-500/80 animate-[shimmer_2.5s_infinite]" />
        </div>

        {/* Central Gateway */}
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex items-center justify-center shadow-md">
            <MetoCoreLogo className="w-6 h-6" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[11px] font-mono font-semibold text-neutral-900 dark:text-neutral-100">
              METO MCP GATEWAY
            </span>
            <span className="text-[9.5px] font-mono text-neutral-400 dark:text-neutral-500">
              Routing: Cursor IDE · 14ms
            </span>
          </div>
        </div>

        {/* Satellites with Precise Logos */}
        <div className="relative z-10 flex items-center gap-3 sm:gap-4">
          {/* Cursor Node */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center text-neutral-900 dark:text-white">
              <CursorLogo className="w-4 h-4" />
            </div>
            <span className="text-[9.5px] font-mono text-neutral-500">Cursor IDE</span>
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">14ms</span>
          </div>

          {/* Claude Node */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ClaudeLogo className="w-4 h-4" />
            </div>
            <span className="text-[9.5px] font-mono text-neutral-500">Claude Desktop</span>
            <span className="text-[9px] font-mono text-neutral-400">22ms</span>
          </div>

          {/* Terminal CLI Node */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center text-neutral-900 dark:text-white">
              <TerminalLogo className="w-4 h-4" />
            </div>
            <span className="text-[9.5px] font-mono text-neutral-500">Claude Code CLI</span>
            <span className="text-[9px] font-mono text-neutral-400">8ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. PRIVACY VAULT FIGURE: Minimal Vault Lock Mechanism
───────────────────────────────────────────────────────────────────────────── */
type PrivacyVaultFigureProps = FigureBaseProps & {
  isMasked?: boolean;
};

export function ContentConnectedPrivacyVaultFigure({
  isMasked = true,
  className = "",
}: PrivacyVaultFigureProps) {
  return (
    <div className={`w-full py-4 flex flex-col items-center justify-center select-none ${className}`}>
      {/* Minimal Vault Shutter */}
      <div className="relative w-full max-w-[380px] h-[130px] flex items-center justify-between px-4 sm:px-8">
        {/* Left: Restricted Vault */}
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${
              isMasked
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 border border-black/[0.06] dark:border-white/[0.06]"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            RESTRICTED VAULT
          </span>
          <span className="text-[10.5px] font-mono font-semibold text-rose-600 dark:text-rose-400">
            {isMasked ? "sk-••••••••" : "sk-proj-7x9"}
          </span>
        </div>

        {/* Center: Interactive Laser Shield Wall */}
        <div className="flex flex-col items-center gap-1.5">
          <div
            className={`w-1 h-14 rounded-full transition-all duration-300 ${
              isMasked
                ? "bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                : "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.6)]"
            }`}
          />
          <span className="text-[9.5px] font-mono font-bold tracking-wider uppercase text-neutral-900 dark:text-neutral-200">
            {isMasked ? "ISOLATION ACTIVE" : "SHIELD LIFTED"}
          </span>
        </div>

        {/* Right: Public Egress */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="m9 12 2 2 4-4" />
            </svg>
          </div>
          <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
            PUBLIC EGRESS
          </span>
          <span className="text-[10.5px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            Rules & Stack Allowed
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. SYNC TREE FIGURE: Harmonized Multi-Tool Orbital Constellation
───────────────────────────────────────────────────────────────────────────── */
export function ContentConnectedSyncTreeFigure({
  className = "",
}: FigureBaseProps) {
  const tools = [
    { name: "Cursor IDE", file: ".cursorrules", logo: <CursorLogo className="w-4 h-4" /> },
    { name: "Claude AI", file: "CLAUDE.md", logo: <ClaudeLogo className="w-4 h-4 text-amber-600 dark:text-amber-400" /> },
    { name: "Terminal CLI", file: "MCP Gateway", logo: <TerminalLogo className="w-4 h-4" /> },
    { name: "Windsurf", file: ".windsurfrules", logo: <MetoCoreLogo className="w-4 h-4 text-sky-600 dark:text-sky-400" /> },
  ];

  return (
    <div className={`w-full py-4 flex flex-col items-center justify-center select-none ${className}`}>
      {/* Orbital Constellation */}
      <div className="relative w-full max-w-[380px] h-[130px] flex items-center justify-center">
        {/* Radar Ring */}
        <div className="absolute w-28 h-28 rounded-full border border-dashed border-neutral-300 dark:border-neutral-700 animate-[spin_20s_linear_infinite]" />

        {/* Center: Single Source of Truth Node */}
        <div className="relative z-10 w-12 h-12 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 flex flex-col items-center justify-center shadow-md">
          <MetoCoreLogo className="w-5 h-5" />
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute -top-0.5 -right-0.5 animate-pulse" />
        </div>

        {/* 4 Orbiting Satellites with Precise Logos */}
        <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-6">
          {/* Left: Cursor */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center text-neutral-900 dark:text-white">
              {tools[0].logo}
            </div>
            <span className="text-[9px] font-mono text-neutral-500">{tools[0].file}</span>
          </div>

          {/* Right: Claude & Terminal */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center text-neutral-900 dark:text-white">
                {tools[1].logo}
              </div>
              <span className="text-[9px] font-mono text-neutral-500">{tools[1].file}</span>
            </div>

            <div className="flex flex-col items-center gap-1">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-neutral-900 border border-black/[0.08] dark:border-white/[0.1] shadow-2xs flex items-center justify-center text-neutral-900 dark:text-white">
                {tools[2].logo}
              </div>
              <span className="text-[9px] font-mono text-neutral-500">{tools[2].file}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Status Pill */}
      <div className="mt-2 flex items-center gap-2 text-[10.5px] font-mono">
        <span className="font-semibold text-neutral-900 dark:text-neutral-200">
          METO SINGLE TRUTH (v2.4)
        </span>
        <span className="text-neutral-400">·</span>
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">In Sync (0ms drift)</span>
      </div>
    </div>
  );
}
