"use client";

import { useState, useEffect } from "react";
import {
  Database,
  Cpu,
  Cloud,
  Check,
  Lock,
  Eye,
  EyeOff,
  GitBranch,
  ShieldCheck,
  Terminal,
  User,
} from "lucide-react";
import { MetoMarkBadge } from "@/components/meto-mark";

// Respect prefers-reduced-motion for animations
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/**
 * Precision horizontal connector line with centered SVG arrowhead and
 * guaranteed particle alignment (particle y is locked exactly to line y=8).
 */
function ConnectorLine({
  color = "#FF4D00",
  dur = "2s",
  reducedMotion = false,
  label,
  accentColor = false,
  labelKey,
}: {
  color?: string;
  dur?: string;
  reducedMotion?: boolean;
  label?: string;
  accentColor?: boolean;
  labelKey?: number;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-1 min-w-[36px] sm:min-w-[52px]">
      {label && (
        <span
          key={labelKey}
          className={`mb-1.5 text-[8.5px] sm:text-[9.5px] font-mono whitespace-nowrap transition-colors duration-150 ${
            accentColor
              ? "text-[var(--primary)] dark:text-orange-400 font-semibold meto-token-pop"
              : "text-neutral-500 dark:text-neutral-400"
          }`}
        >
          {label}
        </span>
      )}
      <div className="w-full relative flex items-center justify-center h-4">
        <svg
          className="w-full h-4 overflow-visible"
          viewBox="0 0 100 16"
          preserveAspectRatio="none"
        >
          {/* Dashed guide line */}
          <line
            x1="2"
            y1="8"
            x2="90"
            y2="8"
            stroke="currentColor"
            className="text-neutral-300 dark:text-neutral-700"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          {/* Precision Arrowhead locked to line y=8 */}
          <polygon
            points="89,5 96,8 89,11"
            className="text-neutral-400 dark:text-neutral-500 fill-current"
          />
          {/* Animated Traveling Particle — center cx animates, cy is permanently 8 */}
          {!reducedMotion && (
            <circle cx="2" cy="8" r="2.5" fill={color}>
              <animate
                attributeName="cx"
                from="2"
                to="90"
                dur={dur}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.4;1;1;0.5;0"
                keyTimes="0;0.1;0.25;0.75;0.9;1"
                dur={dur}
                repeatCount="indefinite"
              />
            </circle>
          )}
        </svg>
      </div>
    </div>
  );
}

export function LandingHowItWorksDemo() {
  const reducedMotion = usePrefersReducedMotion();

  // Card 1 state: format tab + compiler toggles
  const [activeFormat, setActiveFormat] = useState<"claude" | "cursor" | "chatgpt" | "universal">("claude");
  const [pruneInactive, setPruneInactive] = useState(true);
  const [formatSyntax, setFormatSyntax] = useState(true);
  const [tokenFlash, setTokenFlash] = useState(0);

  // Card 3 state: Masking toggle
  const [isMasked, setIsMasked] = useState(true);

  // Dynamic token calculation for Card 1
  const outputTokens =
    pruneInactive && formatSyntax
      ? "1.8k tokens"
      : pruneInactive || formatSyntax
      ? "3.1k tokens"
      : "4.8k tokens";

  const reductionPercent =
    pruneInactive && formatSyntax
      ? "-62%"
      : pruneInactive || formatSyntax
      ? "-35%"
      : "0%";

  function togglePrune() {
    setPruneInactive((v) => !v);
    setTokenFlash((f) => f + 1);
  }
  function toggleFormat() {
    setFormatSyntax((v) => !v);
    setTokenFlash((f) => f + 1);
  }

  // Shared card classes — GPU-safe transitions
  const cardCls =
    "rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-neutral-900/80 p-6 sm:p-7 shadow-[0_2px_14px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-between overflow-hidden " +
    "transition-[transform,box-shadow,border-color] duration-200 ease-out " +
    "hover:-translate-y-[3px] hover:shadow-[0_8px_32px_rgba(0,0,0,0.07)] hover:border-black/[0.13] dark:hover:border-white/[0.15]";

  // Shared recessed stage
  const stageCls =
    "rounded-xl sm:rounded-2xl border border-black/[0.05] dark:border-white/[0.07] bg-neutral-50/70 dark:bg-neutral-950/60 p-4 sm:p-5 w-full relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]";

  // Shared icon node classes with hover lift + active tap
  const iconNodeCls =
    "rounded-2xl bg-white dark:bg-neutral-800/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center shrink-0 " +
    "transition-[transform,box-shadow] duration-[160ms] ease-out hover:scale-110 hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)] active:scale-95";

  // Processor node (CPU / Lock / GitBranch)
  const processorNodeCls =
    "rounded-xl bg-white dark:bg-neutral-800 border border-black/[0.1] dark:border-white/[0.1] shadow-sm flex items-center justify-center shrink-0 " +
    "transition-[transform,box-shadow] duration-150 ease-out hover:scale-[1.08] active:scale-95";

  // Small output node
  const smallIconNodeCls =
    "rounded-xl bg-white dark:bg-neutral-800/90 shadow-[0_2px_6px_rgba(0,0,0,0.05)] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center shrink-0 " +
    "transition-[transform,box-shadow] duration-[160ms] ease-out hover:scale-110 hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] active:scale-95";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 w-full">
      {/* ─────────────────────────────────────────────────────────────
          CARD 1 (7 Cols): Multi-Model Context Compiler (Wide Pipeline)
      ───────────────────────────────────────────────────────────── */}
      <div className={`lg:col-span-7 ${cardCls}`}>
        <div>
          <h3 className="text-[19px] sm:text-[21px] font-semibold text-neutral-950 dark:text-white tracking-tight">
            Multi-Model Context Compiler
          </h3>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-lg mb-5">
            Meto formats and compresses your structured profile into model-specific prompts, cutting token overhead by up to 60%.
          </p>
        </div>

        <div className={`${stageCls} flex flex-col justify-between`}>
          {/* Platform Format Tabs */}
          <div className="relative z-10 flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.06] pb-2.5 mb-5 text-[11px] sm:text-[12px]">
            <div className="flex items-center gap-3 sm:gap-4 font-medium">
              {(["claude", "cursor", "chatgpt", "universal"] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setActiveFormat(fmt)}
                  className={`pb-1 capitalize transition-colors duration-150 active:scale-[0.95] ${
                    activeFormat === fmt
                      ? "text-neutral-950 dark:text-white border-b-2 border-[var(--primary)] font-semibold"
                      : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                  }`}
                >
                  {fmt === "chatgpt" ? "ChatGPT" : fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
              <span className="hidden sm:inline">Raw: 4.8k</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.08] text-neutral-900 dark:text-white font-semibold">
                {!reducedMotion && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
                {reductionPercent}
              </span>
            </div>
          </div>

          {/* Pipeline Flow */}
          <div className="relative z-10 w-full flex items-center justify-between gap-1 sm:gap-2 py-1">
            {/* Source: User Profile */}
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-11 h-11 sm:w-13 sm:h-13 ${iconNodeCls}`}>
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-1.5 text-center whitespace-nowrap">
                User Profile
              </span>
            </div>

            {/* Inbound stream */}
            <ConnectorLine
              color="#FF4D00"
              dur="2.4s"
              reducedMotion={reducedMotion}
              label="4.8k tokens"
            />

            {/* Center: Context Compiler box */}
            <div className="shrink-0 rounded-xl bg-white dark:bg-neutral-800/95 border border-black/[0.08] dark:border-white/[0.1] shadow-sm p-2.5 sm:p-3 min-w-[125px] sm:min-w-[155px]">
              <span className="block text-[8.5px] sm:text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-1.5 sm:mb-2">
                Context Compiler
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={togglePrune}
                  className="flex items-center gap-1.5 sm:gap-2 w-full text-left cursor-pointer select-none active:scale-[0.97] transition-transform duration-150"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all duration-150 ${
                      pruneInactive
                        ? "bg-[var(--primary)] text-white shadow-2xs scale-100"
                        : "border border-neutral-300 dark:border-neutral-600 bg-transparent scale-90"
                    }`}
                  >
                    {pruneInactive && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                    Prune Inactive Tasks
                  </span>
                </button>
                <button
                  type="button"
                  onClick={toggleFormat}
                  className="flex items-center gap-1.5 sm:gap-2 w-full text-left cursor-pointer select-none active:scale-[0.97] transition-transform duration-150"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-all duration-150 ${
                      formatSyntax
                        ? "bg-[var(--primary)] text-white shadow-2xs scale-100"
                        : "border border-neutral-300 dark:border-neutral-600 bg-transparent scale-90"
                    }`}
                  >
                    {formatSyntax && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-medium text-neutral-800 dark:text-neutral-200 whitespace-nowrap">
                    Format Model Syntax
                  </span>
                </button>
              </div>
            </div>

            {/* Outbound stream */}
            <ConnectorLine
              color="#FF4D00"
              dur="2s"
              reducedMotion={reducedMotion}
              label={outputTokens}
              accentColor
              labelKey={tokenFlash}
            />

            {/* Destination: Active AI */}
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-11 h-11 sm:w-13 sm:h-13 ${iconNodeCls}`}>
                <MetoMarkBadge size="sm" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-1.5 text-center whitespace-nowrap">
                Active AI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2 (5 Cols): Route to Any IDE or Model
      ───────────────────────────────────────────────────────────── */}
      <div className={`lg:col-span-5 ${cardCls}`}>
        <div>
          <h3 className="text-[19px] sm:text-[21px] font-semibold text-neutral-950 dark:text-white tracking-tight">
            Route to Any IDE or Model
          </h3>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-5">
            Broadcast your developer identity and project context across every AI tool via live MCP or 1-click clipboard presets.
          </p>
        </div>

        <div className={`${stageCls} min-h-[210px] flex items-center justify-center`}>
          <div className="relative z-10 w-full flex items-center justify-between gap-1 sm:gap-2">
            {/* Source: Meto Vault */}
            <div className="flex flex-col items-center shrink-0">
              <div className={`w-11 h-11 sm:w-13 sm:h-13 ${iconNodeCls}`}>
                <Database className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-1.5 whitespace-nowrap">
                Meto Vault
              </span>
            </div>

            {/* Live sync line */}
            <ConnectorLine
              color="#E5FF7F"
              dur="2s"
              reducedMotion={reducedMotion}
              label="Live Sync"
            />

            {/* Router Processor */}
            <div className="shrink-0 relative">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 ${processorNodeCls}`}>
                <Cpu className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.7]" />
              </div>
              <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E5FF7F] text-neutral-950 font-bold text-[9px] flex items-center justify-center shadow-xs border border-white dark:border-neutral-900 ${reducedMotion ? "" : "ring-2 ring-[#E5FF7F]/40 animate-pulse"}`}>
                1
              </span>
            </div>

            {/* Curved Routing Branches */}
            <div className="shrink-0 w-16 sm:w-20 h-[105px] relative flex items-center justify-center">
              {/* Protocol tags — positioned clearly above & below curves */}
              <span className="absolute top-0 right-1 text-[8.5px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/95 dark:bg-neutral-800/95 border border-black/[0.06] dark:border-white/[0.08] px-1.5 py-0.5 rounded shadow-2xs pointer-events-none z-10">
                MCP SSE
              </span>
              <span className="absolute bottom-0 right-1 text-[8.5px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/95 dark:bg-neutral-800/95 border border-black/[0.06] dark:border-white/[0.08] px-1.5 py-0.5 rounded shadow-2xs pointer-events-none z-10">
                REST / Web
              </span>

              <svg
                className="w-full h-full text-neutral-300 dark:text-neutral-700 overflow-visible"
                viewBox="0 0 70 100"
                fill="none"
              >
                {/* Upper branch to Cursor & Windsurf */}
                <path d="M 0 50 C 30 50, 38 20, 64 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="63,17 70,20 63,23" className="text-neutral-400 dark:text-neutral-500 fill-current" />

                {/* Lower branch to Claude & ChatGPT */}
                <path d="M 0 50 C 30 50, 38 80, 64 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="63,77 70,80 63,83" className="text-neutral-400 dark:text-neutral-500 fill-current" />

                {!reducedMotion && (
                  <>
                    <circle cx="0" cy="0" r="2.5" fill="#93C5FD">
                      <animateMotion path="M 0 50 C 30 50, 38 20, 64 20" dur="2.2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;0.3;1;1;0.4;0" keyTimes="0;0.1;0.25;0.75;0.9;1" dur="2.2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="0" cy="0" r="2.5" fill="#FDE047">
                      <animateMotion path="M 0 50 C 30 50, 38 80, 64 80" dur="2.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;0.3;1;1;0.4;0" keyTimes="0;0.1;0.25;0.75;0.9;1" dur="2.5s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </svg>
            </div>

            {/* Output Nodes */}
            <div className="flex flex-col gap-3 shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${smallIconNodeCls}`}>
                  <Terminal className="w-4 h-4 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
                </div>
                <span className="text-[9px] sm:text-[9.5px] font-medium text-neutral-600 dark:text-neutral-400 mt-1 whitespace-nowrap">
                  Cursor & Windsurf
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${smallIconNodeCls}`}>
                  <Cloud className="w-4 h-4 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
                </div>
                <span className="text-[9px] sm:text-[9.5px] font-medium text-neutral-600 dark:text-neutral-400 mt-1 whitespace-nowrap">
                  Claude & ChatGPT
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3 (6 Cols): Granular Privacy & Secret Isolation
      ───────────────────────────────────────────────────────────── */}
      <div className={`lg:col-span-6 ${cardCls}`}>
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[19px] sm:text-[21px] font-semibold text-neutral-950 dark:text-white tracking-tight">
              Granular Privacy & Secret Isolation
            </h3>
            <button
              type="button"
              onClick={() => setIsMasked(!isMasked)}
              title={isMasked ? "Show clear text" : "Mask secrets"}
              className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-[color,background-color,transform] duration-150 active:scale-[0.92]"
            >
              {isMasked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
          </div>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-5">
            Control exactly what each AI sees. Private client projects, internal credentials, and sensitive notes are strictly isolated before handoff.
          </p>
        </div>

        <div className={`${stageCls} min-h-[210px] flex items-center justify-center`}>
          <div className="relative z-10 w-full flex items-center justify-between gap-1 sm:gap-2">
            {/* Left: Profile Sections */}
            <div className="w-[130px] sm:w-[155px] shrink-0 rounded-xl bg-white dark:bg-neutral-800/95 border border-black/[0.08] dark:border-white/[0.1] shadow-sm p-2.5 sm:p-3">
              <span className="block text-[8.5px] sm:text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-2">
                Profile Sections
              </span>
              <div className="space-y-1.5">
                {[
                  { label: "Client NDA", tag: "Private" },
                  { label: "OPENAI_KEY", tag: "Secret" },
                  { label: "Coding Style", tag: "Public" },
                ].map(({ label, tag }) => (
                  <div key={label} className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-3.5 h-3.5 rounded bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {label}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono text-neutral-400 shrink-0">
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inbound stream to privacy filter */}
            <ConnectorLine
              color="#FF4D00"
              dur="1.8s"
              reducedMotion={reducedMotion}
            />

            {/* Center: Privacy Filter node */}
            <div className="shrink-0 relative">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 ${processorNodeCls}`}>
                <Lock className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.7]" />
              </div>
              <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E5FF7F] text-neutral-950 font-bold text-[9px] flex items-center justify-center shadow-xs border border-white dark:border-neutral-900 ${reducedMotion ? "" : "ring-2 ring-[#E5FF7F]/40 animate-pulse"}`}>
                1
              </span>
            </div>

            {/* Outbound stream from privacy filter */}
            <ConnectorLine
              color="#34D399"
              dur="1.8s"
              reducedMotion={reducedMotion}
            />

            {/* Right: Export Payload — perfectly formatted without truncation */}
            <div className="w-[130px] sm:w-[155px] shrink-0 rounded-xl bg-white dark:bg-neutral-800/95 border border-black/[0.08] dark:border-white/[0.1] shadow-sm p-2.5 sm:p-3">
              <span className="block text-[8.5px] sm:text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-2">
                Export Payload
              </span>
              <div
                key={isMasked ? "masked" : "clear"}
                className="space-y-1.5 font-mono text-[9.5px] sm:text-[10.5px] text-neutral-600 dark:text-neutral-400 meto-mask-reveal"
              >
                <div className="truncate">
                  {isMasked ? "NDA: [HIDDEN]" : "NDA: Acme Corp"}
                </div>
                <div className="truncate">
                  {isMasked ? "KEY: sk-••••••••" : "KEY: sk-proj-9x"}
                </div>
                <div className="truncate text-emerald-600 dark:text-emerald-400 font-sans font-medium">
                  TypeScript · Strict
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 4 (6 Cols): Cross-Tool Rule & Identity Sync
      ───────────────────────────────────────────────────────────── */}
      <div className={`lg:col-span-6 ${cardCls}`}>
        <div>
          <h3 className="text-[19px] sm:text-[21px] font-semibold text-neutral-950 dark:text-white tracking-tight">
            Cross-Tool Rule & Identity Sync
          </h3>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400 mb-5">
            Switch seamlessly between Cursor, Claude Code, Windsurf, and terminal agents without losing your coding rules, architectural guidelines, or tech stack.
          </p>
        </div>

        <div className={`${stageCls} min-h-[210px] flex items-center justify-center`}>
          <div className="relative z-10 w-full flex items-center justify-between gap-1 sm:gap-2">
            {/* Left: Context Matrix Grid */}
            <div className="shrink-0 p-2 sm:p-2.5 rounded-xl bg-white dark:bg-neutral-800/90 border border-black/[0.08] dark:border-white/[0.08] shadow-sm flex flex-col items-center">
              <div className="grid grid-cols-6 gap-1 w-[85px] sm:w-[105px] h-[55px] sm:h-[65px]">
                {[
                  "bg-neutral-200/90 dark:bg-neutral-700/80",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-300/80 dark:bg-neutral-600/80",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-200 dark:bg-neutral-700",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-300 dark:bg-neutral-600",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-200 dark:bg-neutral-700",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-300/70 dark:bg-neutral-600/70",
                  "bg-neutral-200/80 dark:bg-neutral-700/80",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-200 dark:bg-neutral-700",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-300 dark:bg-neutral-600",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-200 dark:bg-neutral-700",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-300/90 dark:bg-neutral-600/90",
                  "bg-neutral-100 dark:bg-neutral-800",
                  "bg-neutral-200/90 dark:bg-neutral-700/80",
                ].map((bg, i) => (
                  <span
                    key={i}
                    style={reducedMotion ? {} : { animationDelay: `${i * 30}ms` }}
                    className={`rounded-xs ${bg} hover:bg-[var(--primary)]/70 hover:scale-110 transition-[background-color,transform] duration-150 ease-out meto-matrix-cell`}
                  />
                ))}
              </div>
              <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-500 mt-1.5 whitespace-nowrap">
                Context Matrix
              </span>
            </div>

            {/* Inbound stream to sync engine */}
            <ConnectorLine
              color="#E5FF7F"
              dur="2s"
              reducedMotion={reducedMotion}
            />

            {/* Sync Engine Node */}
            <div className="shrink-0 relative">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 ${processorNodeCls}`}>
                <GitBranch className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.7]" />
              </div>
              <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E5FF7F] text-neutral-950 font-bold text-[9px] flex items-center justify-center shadow-xs border border-white dark:border-neutral-900 ${reducedMotion ? "" : "ring-2 ring-[#E5FF7F]/40 animate-pulse"}`}>
                1
              </span>
            </div>

            {/* Curved Routing Branches */}
            <div className="shrink-0 w-14 sm:w-18 h-[105px] relative flex items-center justify-center">
              <svg
                className="w-full h-full text-neutral-300 dark:text-neutral-700 overflow-visible"
                viewBox="0 0 60 100"
                fill="none"
              >
                {/* Upper branch to .cursorrules */}
                <path d="M 0 50 C 26 50, 32 20, 54 20" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="53,17 60,20 53,23" className="text-neutral-400 dark:text-neutral-500 fill-current" />

                {/* Lower branch to CLAUDE.md */}
                <path d="M 0 50 C 26 50, 32 80, 54 80" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                <polygon points="53,77 60,80 53,83" className="text-neutral-400 dark:text-neutral-500 fill-current" />

                {!reducedMotion && (
                  <>
                    <circle cx="0" cy="0" r="2.5" fill="#A78BFA">
                      <animateMotion path="M 0 50 C 26 50, 32 20, 54 20" dur="2.1s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;0.3;1;1;0.4;0" keyTimes="0;0.1;0.25;0.75;0.9;1" dur="2.1s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="0" cy="0" r="2.5" fill="#34D399">
                      <animateMotion path="M 0 50 C 26 50, 32 80, 54 80" dur="2.4s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0;0.3;1;1;0.4;0" keyTimes="0;0.1;0.25;0.75;0.9;1" dur="2.4s" repeatCount="indefinite" />
                    </circle>
                  </>
                )}
              </svg>
            </div>

            {/* Output Nodes */}
            <div className="flex flex-col gap-3 shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${smallIconNodeCls}`}>
                  <Terminal className="w-4 h-4 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
                </div>
                <span className="text-[9px] sm:text-[9.5px] font-medium text-neutral-600 dark:text-neutral-400 mt-1 whitespace-nowrap">
                  .cursorrules
                </span>
              </div>
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 ${smallIconNodeCls}`}>
                  <ShieldCheck className="w-4 h-4 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
                </div>
                <span className="text-[9px] sm:text-[9.5px] font-medium text-neutral-600 dark:text-neutral-400 mt-1 whitespace-nowrap">
                  CLAUDE.md
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
