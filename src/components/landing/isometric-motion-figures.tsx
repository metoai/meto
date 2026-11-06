"use client";

import {
  Shield,
  Lock,
  Unlock,
  Check,
  Terminal,
  Radio,
  ArrowRight,
  Server,
  FileCode,
} from "lucide-react";

type FigureBaseProps = {
  className?: string;
  intensity?: number;
  play?: boolean;
};

/* ─────────────────────────────────────────────────────────────────────────────
   1. COMPILER FIGURE: Minimal Unslop Code Surface (No traffic lights, no nested cards)
───────────────────────────────────────────────────────────────────────────── */
type CompilerFigureProps = FigureBaseProps & {
  format?: "claude" | "cursor" | "chatgpt" | "universal";
  tokens?: string;
  reduction?: string;
};

const CODE_PREVIEWS: Record<
  "claude" | "cursor" | "chatgpt" | "universal",
  { file: string; lines: string[] }
> = {
  claude: {
    file: "claude-project.xml",
    lines: [
      "<profile id=\"meto-identity\">",
      "  <stack>Next.js 15 · TypeScript · Supabase</stack>",
      "  <rules strict=\"true\">Server Components</rules>",
      "  <telemetry>-62% PRUNED (AST optimized)</telemetry>",
      "</profile>",
    ],
  },
  cursor: {
    file: ".cursorrules",
    lines: [
      "# .cursorrules - compiled profile",
      "stack: [nextjs15, typescript, supabase-rls]",
      "directives: [prefer-server-actions, strict-types]",
      "# status: -66% PRUNED · ready",
    ],
  },
  chatgpt: {
    file: "custom-instructions.txt",
    lines: [
      "Role: Senior Fullstack Engineer",
      "Stack: Next.js 15 (App Router), Supabase, Strict TS",
      "Optimization: -60% PRUNED AST overhead",
    ],
  },
  universal: {
    file: "context.json",
    lines: [
      "{",
      "  \"stack\": [\"nextjs\", \"typescript\", \"supabase\"],",
      "  \"optimization\": \"-56% PRUNED AST\"",
      "}",
    ],
  },
};

export function ContentConnectedCompilerFigure({
  format = "claude",
  tokens = "1.8k tokens",
  reduction = "-62%",
  className = "",
}: CompilerFigureProps) {
  const current = CODE_PREVIEWS[format] || CODE_PREVIEWS.claude;

  return (
    <div className={`w-full font-mono text-[11px] sm:text-[12px] ${className}`}>
      {/* File Header Bar */}
      <div className="flex items-center justify-between py-2 border-b border-black/[0.08] dark:border-white/[0.08] text-neutral-500 dark:text-neutral-400">
        <span className="font-medium text-neutral-900 dark:text-neutral-200">
          {current.file}
        </span>
        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
          {reduction} PRUNED
        </span>
      </div>

      {/* Dense Syntax Preview */}
      <div className="py-3 space-y-1 text-neutral-800 dark:text-neutral-300 leading-relaxed overflow-x-auto">
        {current.lines.map((line, i) => (
          <div key={i} className="flex gap-3">
            <span className="text-neutral-400 dark:text-neutral-600 select-none w-3 text-right">
              {i + 1}
            </span>
            <span
              className={
                line.includes("PRUNED")
                  ? "text-emerald-600 dark:text-emerald-400 font-medium"
                  : line.startsWith("#") || line.startsWith("//")
                  ? "text-neutral-400 dark:text-neutral-500"
                  : ""
              }
            >
              {line}
            </span>
          </div>
        ))}
      </div>

      {/* Direct Stats Footer */}
      <div className="pt-2 border-t border-black/[0.08] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
        <span>RAW PROFILE: 4,850 tokens</span>
        <span className="text-neutral-900 dark:text-neutral-100 font-medium">
          → {tokens}
        </span>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   2. MCP ROUTER FIGURE: Clean Connected Connection Lines
───────────────────────────────────────────────────────────────────────────── */
export function ContentConnectedMcpRouterFigure({
  className = "",
}: FigureBaseProps) {
  const targets = [
    { name: "Cursor IDE", transport: "Live SSE", latency: "14ms", status: "SYNCED" },
    { name: "Claude Desktop", transport: "Stream", latency: "22ms", status: "SYNCED" },
    { name: "Claude Code CLI", transport: "stdio pipe", latency: "8ms", status: "ACTIVE" },
  ];

  return (
    <div className={`w-full font-mono text-[11px] sm:text-[12px] space-y-2.5 ${className}`}>
      {/* Gateway Status Line */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08] dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            METO MCP GATEWAY
          </span>
        </div>
        <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
          Routing: Cursor IDE · 14ms
        </span>
      </div>

      {/* Minimal Connected Rows */}
      <div className="space-y-1.5">
        {targets.map((t) => (
          <div
            key={t.name}
            className="flex items-center justify-between py-1.5 px-2 rounded-md bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]"
          >
            <div className="flex items-center gap-2">
              <span className="text-neutral-900 dark:text-neutral-200 font-medium font-sans text-[12px]">
                {t.name}
              </span>
              <span className="text-neutral-400 dark:text-neutral-500 text-[10.5px]">
                {t.transport}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 dark:text-neutral-400">{t.latency}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium text-[10px]">
                {t.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3. PRIVACY VAULT FIGURE: Minimal Clean Secret Inspector
───────────────────────────────────────────────────────────────────────────── */
type PrivacyVaultFigureProps = FigureBaseProps & {
  isMasked?: boolean;
};

export function ContentConnectedPrivacyVaultFigure({
  isMasked = true,
  className = "",
}: PrivacyVaultFigureProps) {
  return (
    <div className={`w-full font-mono text-[11px] sm:text-[12px] space-y-2.5 ${className}`}>
      {/* Status Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08] dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          {isMasked ? (
            <Lock className="w-3.5 h-3.5 text-rose-500" />
          ) : (
            <Unlock className="w-3.5 h-3.5 text-amber-500" />
          )}
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            {isMasked ? "ISOLATION ACTIVE" : "SHIELD LIFTED"}
          </span>
        </div>
        <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
          {isMasked ? "Shield: Enforced · Redacted" : "Shield: Inspection"}
        </span>
      </div>

      {/* Direct Key Diff Lines */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between py-1.5 px-2 rounded-md bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
          <span className="text-neutral-500 dark:text-neutral-400">
            RESTRICTED VAULT (API KEY)
          </span>
          <span className="font-semibold text-rose-600 dark:text-rose-400">
            {isMasked ? "sk-••••••••" : "sk-proj-7x9"}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 px-2 rounded-md bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
          <span className="text-neutral-500 dark:text-neutral-400">CLIENT NDA DIRECTIVES</span>
          <span className="text-neutral-400 dark:text-neutral-500">[STRIPPED]</span>
        </div>

        <div className="flex items-center justify-between py-1.5 px-2 rounded-md bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]">
          <span className="text-neutral-500 dark:text-neutral-400">PUBLIC EGRESS</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            [ALLOWED] Dev Persona & Rules
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   4. SYNC TREE FIGURE: Clean Cross-Tool Sync Matrix
───────────────────────────────────────────────────────────────────────────── */
export function ContentConnectedSyncTreeFigure({
  className = "",
}: FigureBaseProps) {
  const syncItems = [
    { target: "Cursor IDE", file: ".cursorrules", status: "In Sync" },
    { target: "Claude AI", file: "CLAUDE.md", status: "In Sync" },
    { target: "Terminal CLI", file: "MCP Gateway", status: "In Sync" },
    { target: "Windsurf", file: ".windsurfrules", status: "In Sync" },
  ];

  return (
    <div className={`w-full font-mono text-[11px] sm:text-[12px] space-y-2.5 ${className}`}>
      {/* Root Status */}
      <div className="flex items-center justify-between pb-2 border-b border-black/[0.08] dark:border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="font-semibold text-neutral-900 dark:text-neutral-100">
            METO SINGLE TRUTH (v2.4)
          </span>
        </div>
        <span className="text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
          0ms Drift
        </span>
      </div>

      {/* Grid of Targets */}
      <div className="grid grid-cols-2 gap-1.5">
        {syncItems.map((item) => (
          <div
            key={item.target}
            className="flex items-center justify-between py-1.5 px-2 rounded-md bg-black/[0.02] dark:bg-white/[0.02] border border-black/[0.04] dark:border-white/[0.05]"
          >
            <div>
              <div className="font-sans font-medium text-neutral-900 dark:text-neutral-200 text-[11.5px]">
                {item.target}
              </div>
              <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                {item.file}
              </div>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
