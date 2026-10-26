"use client";

import { AI_BRAND_ICON_LANDING_CLASS } from "@/lib/ai-brand-icon";
import { Plus, Terminal } from "lucide-react";

type AiToolItem = {
  id: string;
  name: string;
  iconUrl?: string;
  isMore?: boolean;
};

const AI_TOOLS: AiToolItem[] = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    iconUrl: "https://api.iconify.design/logos/openai-icon.svg",
  },
  {
    id: "claude",
    name: "Claude",
    iconUrl: "https://api.iconify.design/simple-icons/claude.svg",
  },
  {
    id: "gemini",
    name: "Gemini",
    iconUrl: "https://api.iconify.design/simple-icons/googlegemini.svg",
  },
  {
    id: "cursor",
    name: "Cursor",
    iconUrl: "https://api.iconify.design/simple-icons/cursor.svg",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    iconUrl: "https://api.iconify.design/simple-icons/deepseek.svg",
  },
  {
    id: "copilot",
    name: "Copilot",
    iconUrl: "https://api.iconify.design/simple-icons/githubcopilot.svg",
  },
  {
    id: "more",
    name: "+ more",
    isMore: true,
  },
];

// Symmetrical 7-node coordinates across a 520px coordinate box
const TARGET_X_COORDS = [38, 112, 186, 260, 334, 408, 482];

export function LandingHeroVisual() {
  return (
    <div className="relative w-full max-w-[540px] xl:max-w-[580px] mx-auto flex flex-col items-center select-none pt-1 sm:pt-2 lg:pt-3">
      {/* Editorial Annotation: Above/left of Meto card with comfortable clearance */}
      <div className="hidden lg:flex absolute -top-4 left-2 xl:-left-4 items-end gap-2 pointer-events-none z-20">
        <span className="font-serif italic text-[13px] leading-tight text-[var(--muted)] tracking-wide">
          Your identity<br />lives here
        </span>
        <svg
          width="30"
          height="26"
          viewBox="0 0 30 26"
          fill="none"
          className="text-[var(--primary)] opacity-80"
          aria-hidden="true"
        >
          <path
            d="M 2 4 C 11 2, 20 9, 22 22"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 16 19 L 22 23 L 25 17"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {/* Atmospheric warm orange ambient glow behind Meto card */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[420px] h-[240px] rounded-full bg-gradient-to-b from-[var(--primary)]/14 via-[var(--primary)]/4 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* 1. Universal Developer Identity Card (Linear x Stripe Craftsmanship) */}
      <div className="relative z-10 w-full max-w-[430px] sm:max-w-[460px] rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white/75 dark:bg-[#111113]/85 backdrop-blur-2xl shadow-[0_12px_44px_rgba(0,0,0,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.6),inset_0_1px_1px_0_rgba(255,255,255,0.06)] overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_64px_rgba(255,77,0,0.14)]">
        {/* Card Header Bar (IDE / macOS Terminal Style) */}
        <div className="flex items-center justify-between border-b border-black/[0.06] dark:border-white/[0.08] px-4 py-2.5 bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-black/15 dark:bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/15 dark:bg-white/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-black/15 dark:bg-white/20" />
            </div>
            <div className="ml-2 flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted)]">
              <Terminal className="h-3 w-3 text-[var(--muted)]" />
              <span>identity.meto.json</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10.5px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>MCP Active</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 sm:p-4.5 space-y-3.5">
          {/* Identity & Role Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] via-[#ff5a14] to-[#ff7332] shadow-[0_4px_16px_rgba(255,77,0,0.28)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo-icon.svg"
                alt="Meto logo"
                width={26}
                height={26}
                className="h-6 w-6 object-contain brightness-0 invert select-none"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-[var(--text)] tracking-tight">
                  Alex Mercer
                </span>
                <span className="text-xs font-mono text-[var(--muted)]">@alex</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] truncate">
                Staff Software Engineer · <span className="text-[var(--primary)] font-mono text-[11px]">89 memories</span>
              </p>
            </div>
          </div>

          {/* Stack & Context Pills */}
          <div className="flex flex-wrap gap-1.5">
            {["Next.js 15", "TypeScript", "Supabase", "Tailwind", "MCP Hub"].map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.03] dark:bg-white/[0.04] px-2 py-0.5 text-[11px] font-mono font-medium text-[var(--text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Active Rules Injected into Assistants */}
          <div className="rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-black/[0.03] dark:bg-black/40 px-3 py-2 font-mono text-[11px] leading-relaxed">
            <div className="flex items-center justify-between text-[10px] text-[var(--muted)] mb-1">
              <span className="font-semibold uppercase tracking-wider">Injected Agent Rules</span>
              <span className="text-[var(--primary)] font-mono">universal_sync</span>
            </div>
            <p className="text-[var(--text)] line-clamp-2">
              <span className="text-[var(--primary)] font-bold mr-1">&gt;</span>
              Strict TypeScript · Modular App Router · Concise, no apologies.
            </p>
          </div>
        </div>
      </div>

      {/* 2. Connection System: GPU-accelerated SVG flow lines with normalized pathLength for perfectly uniform, smooth animation */}
      <div className="relative w-full max-w-[520px] h-[85px] sm:h-[95px] hidden sm:block pointer-events-none -mt-1.5">
        <svg
          viewBox="0 0 520 95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
              <stop offset="50%" stopColor="var(--primary)" stopOpacity="1" />
              <stop offset="100%" stopColor="#ff7a3d" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {TARGET_X_COORDS.map((targetX, index) => {
            const pathD =
              targetX === 260
                ? "M 260 0 L 260 95"
                : `M 260 0 C 260 ${Math.abs(targetX - 260) > 130 ? 32 : 44}, ${targetX} 50, ${targetX} 95`;

            return (
              <g key={targetX}>
                {/* Static neutral connection track */}
                <path
                  d={pathD}
                  stroke="var(--border)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className="opacity-70 dark:opacity-30"
                />

                {/* Smooth flowing data beam — pathLength=100 ensures identical velocity on all curves */}
                <path
                  d={pathD}
                  pathLength={100}
                  stroke="url(#beamGradient)"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeDasharray="20 100"
                  className="meto-smooth-beam"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                />

                {/* Receiving connection node dot */}
                <circle
                  cx={targetX}
                  cy="93"
                  r="2.25"
                  fill="var(--primary)"
                  className="opacity-80 transition-opacity duration-300"
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Mobile Vertical Connector */}
      <div className="sm:hidden flex flex-col items-center my-2.5" aria-hidden="true">
        <div className="w-[1.5px] h-6 bg-gradient-to-b from-[var(--border-hover)] to-[var(--primary)]" />
      </div>

      {/* 3. AI Integrations Row: Tactile micro-interactions (Emil Kowalski craftsmanship) */}
      <div className="relative w-full max-w-[520px] px-2 sm:px-0">
        <div className="grid grid-cols-3 sm:grid-cols-7 gap-y-4 gap-x-3 sm:gap-2 items-start justify-items-center">
          {AI_TOOLS.map((tool, index) => {
            const isLastMobile = index === 6; // '+ more' continuation node
            return (
              <div
                key={tool.id}
                className={`group flex flex-col items-center text-center cursor-default ${
                  isLastMobile ? "col-span-3 sm:col-span-1" : ""
                }`}
              >
                <div
                  className={`flex h-[54px] w-[54px] sm:h-[62px] sm:w-[62px] items-center justify-center rounded-[18px] transition-all duration-200 ease-out group-hover:-translate-y-1 active:scale-95 ${
                    tool.isMore
                      ? "border border-dashed border-[var(--border-hover)] bg-[var(--surface)]/50 text-[var(--muted)] group-hover:border-[var(--primary)] group-hover:text-[var(--text)] group-hover:shadow-sm"
                      : "border border-[var(--border)] bg-[var(--card)] shadow-2xs group-hover:border-[var(--border-hover)] group-hover:shadow-md"
                  }`}
                >
                  {tool.isMore ? (
                    <Plus className="h-5 w-5 transition-transform duration-200 ease-out group-hover:rotate-90 text-[var(--text-secondary)]" aria-label="More AI tools supported" />
                  ) : tool.iconUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={tool.iconUrl}
                      alt={`${tool.name} integration`}
                      width={26}
                      height={26}
                      loading="lazy"
                      className={`h-[24px] w-[24px] sm:h-[26px] sm:w-[26px] object-contain transition-transform duration-200 ease-out group-hover:scale-110 ${AI_BRAND_ICON_LANDING_CLASS}`}
                    />
                  ) : null}
                </div>
                <span
                  className={`mt-2 text-[11.5px] sm:text-[12.5px] font-medium transition-colors duration-150 ${
                    tool.isMore
                      ? "text-[var(--muted)] group-hover:text-[var(--text)]"
                      : "text-[var(--text-secondary)] group-hover:text-[var(--text)]"
                  }`}
                >
                  {tool.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physics-accurate smooth beam animation */}
      <style jsx>{`
        @keyframes metoSmoothBeam {
          0% {
            stroke-dashoffset: 120;
            opacity: 0;
          }
          15% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -20;
            opacity: 0;
          }
        }

        .meto-smooth-beam {
          animation: metoSmoothBeam 2.4s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .meto-smooth-beam {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
