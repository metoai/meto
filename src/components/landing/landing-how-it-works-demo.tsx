"use client";

import { useState } from "react";
import { Eye, EyeOff, Radio } from "lucide-react";
import {
  ContentConnectedCompilerFigure,
  ContentConnectedMcpRouterFigure,
  ContentConnectedPrivacyVaultFigure,
  ContentConnectedSyncTreeFigure,
} from "@/components/landing/isometric-motion-figures";

type Format = "claude" | "cursor" | "chatgpt" | "universal";

const FORMAT_PREVIEWS: Record<
  Format,
  { label: string; file: string; tokens: string; reduction: string }
> = {
  claude: {
    label: "Claude",
    file: "claude-project.xml",
    tokens: "1.8k tokens",
    reduction: "-62%",
  },
  cursor: {
    label: "Cursor",
    file: ".cursorrules",
    tokens: "1.6k tokens",
    reduction: "-66%",
  },
  chatgpt: {
    label: "ChatGPT",
    file: "custom-instructions.txt",
    tokens: "1.9k tokens",
    reduction: "-60%",
  },
  universal: {
    label: "Universal",
    file: "context.json",
    tokens: "2.1k tokens",
    reduction: "-56%",
  },
};

export function LandingHowItWorksDemo() {
  // Card 1: Compiler format state
  const [activeFormat, setActiveFormat] = useState<Format>("claude");

  // Card 3: Mask secrets toggle
  const [isMasked, setIsMasked] = useState(true);

  const activeData = FORMAT_PREVIEWS[activeFormat];

  // Shared card surface classes
  const cardCls =
    "rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-neutral-900/70 p-5 sm:p-7 " +
    "shadow-[0_2px_16px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-between overflow-hidden " +
    "transition-all duration-200 hover:border-black/[0.14] dark:hover:border-white/[0.15]";

  // Shared stage surface
  const stageCls =
    "rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-neutral-50/80 dark:bg-neutral-950/80 p-3.5 sm:p-5 w-full flex flex-col items-center justify-center relative overflow-hidden";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 w-full">
      {/* ─────────────────────────────────────────────────────────────
          CARD 1: Multi-Model Context Compiler
      ───────────────────────────────────────────────────────────── */}
      <div className={cardCls}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-[17px] sm:text-[19px] font-semibold text-neutral-950 dark:text-white tracking-tight">
              Multi-Model Context Compiler
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {activeData.reduction} token overhead
            </span>
          </div>
          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-xl mb-4 sm:mb-5">
            Meto formats and compresses your structured profile into model-specific prompts, cutting token overhead by up to 60%.
          </p>
        </div>

        <div className={stageCls}>
          {/* Top Bar: Model Tabs + Output Metric */}
          <div className="flex items-center justify-between gap-2 border-b border-black/[0.05] dark:border-white/[0.06] pb-2.5 mb-2 w-full">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {(["claude", "cursor", "chatgpt", "universal"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setActiveFormat(fmt)}
                  className={`px-2.5 py-1 rounded-md text-[11px] sm:text-[12px] font-medium transition-all duration-150 active:scale-[0.97] ${
                    activeFormat === fmt
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-950 shadow-xs font-semibold"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.04]"
                  }`}
                >
                  {FORMAT_PREVIEWS[fmt].label}
                </button>
              ))}
            </div>

            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-500">
              Output: <strong className="text-neutral-900 dark:text-neutral-200">{activeData.tokens}</strong>
            </span>
          </div>

          {/* Centered Agency Isometric Figure */}
          <div className="w-full max-w-[440px] aspect-[16/10] flex items-center justify-center">
            <ContentConnectedCompilerFigure
              format={activeFormat}
              tokens={activeData.tokens}
              reduction={activeData.reduction}
              intensity={0.65}
              play={true}
            />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: Route to Any IDE or Model (Live MCP)
      ───────────────────────────────────────────────────────────── */}
      <div className={cardCls}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-[17px] sm:text-[19px] font-semibold text-neutral-950 dark:text-white tracking-tight">
              Route to Any IDE or Model
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live MCP
            </span>
          </div>
          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
            Broadcast your developer identity and project context across every AI tool via live MCP or 1-click clipboard presets.
          </p>
        </div>

        <div className={stageCls}>
          {/* Centered Agency Isometric Figure */}
          <div className="w-full max-w-[440px] aspect-[16/10] flex items-center justify-center">
            <ContentConnectedMcpRouterFigure intensity={0.7} play={true} />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3: Granular Privacy & Secret Isolation
      ───────────────────────────────────────────────────────────── */}
      <div className={cardCls}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-[17px] sm:text-[19px] font-semibold text-neutral-950 dark:text-white tracking-tight">
              Granular Privacy & Secret Isolation
            </h3>
            <button
              type="button"
              onClick={() => setIsMasked(!isMasked)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.06] text-neutral-700 dark:text-neutral-300 hover:text-neutral-950 dark:hover:text-white transition-all active:scale-[0.96] border border-black/[0.06] dark:border-white/[0.08]"
            >
              {isMasked ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{isMasked ? "Reveal secrets" : "Mask secrets"}</span>
            </button>
          </div>
          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
            Control exactly what each AI sees. Private client projects, internal credentials, and sensitive notes are strictly isolated before handoff.
          </p>
        </div>

        <div className={stageCls}>
          {/* Centered Agency Isometric Figure */}
          <div className="w-full max-w-[440px] aspect-[16/10] flex items-center justify-center">
            <ContentConnectedPrivacyVaultFigure isMasked={isMasked} intensity={0.7} play={true} />
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 4: Cross-Tool Rule & Identity Sync
      ───────────────────────────────────────────────────────────── */}
      <div className={cardCls}>
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <h3 className="text-[17px] sm:text-[19px] font-semibold text-neutral-950 dark:text-white tracking-tight">
              Cross-Tool Rule & Identity Sync
            </h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-black/[0.06] dark:border-white/[0.08]">
              <Radio className="w-3 h-3 text-[var(--primary)]" />
              1 Source of Truth
            </span>
          </div>
          <p className="text-[13px] sm:text-[13.5px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-4 sm:mb-5">
            Switch seamlessly between Cursor, Claude Code, Windsurf, and terminal agents without losing your coding rules, architectural guidelines, or tech stack.
          </p>
        </div>

        <div className={stageCls}>
          {/* Centered Agency Isometric Figure */}
          <div className="w-full max-w-[440px] aspect-[16/10] flex items-center justify-center">
            <ContentConnectedSyncTreeFigure intensity={0.7} play={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
