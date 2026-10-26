"use client";

import { AI_BRAND_ICON_LANDING_CLASS } from "@/lib/ai-brand-icon";
import { Plus } from "lucide-react";

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
      <div className="hidden lg:flex absolute -top-3 left-3 xl:-left-3 items-end gap-2 pointer-events-none z-20">
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
        className="absolute top-8 left-1/2 -translate-x-1/2 w-[360px] h-[200px] rounded-full bg-gradient-to-b from-[var(--primary)]/15 via-[var(--primary)]/5 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* 1. Meto Identity Card: Minimalist, tactile glassmorphism following Emil Kowalski & Linear design standards */}
      <div className="relative z-10 flex h-[168px] w-[295px] sm:h-[178px] sm:w-[315px] flex-col items-center justify-center rounded-[24px] border border-white/80 dark:border-white/10 bg-white/50 dark:bg-white/[0.04] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(255,77,0,0.16)]">
        {/* Meto Core Brand Icon */}
        <div className="flex h-15 w-15 sm:h-16 sm:w-16 items-center justify-center rounded-[18px] sm:rounded-[20px] bg-gradient-to-br from-[var(--primary)] via-[#ff5a14] to-[#ff7332] shadow-[0_8px_24px_rgba(255,77,0,0.32)] transition-transform duration-200 ease-out hover:scale-105 active:scale-95">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-icon.svg"
            alt="Meto logo"
            width={40}
            height={40}
            className="h-8 w-8 sm:h-9 sm:w-9 object-contain brightness-0 invert select-none"
          />
        </div>

        {/* Clean Live Context Status Pill (Linear / Apple style) */}
        <div className="mt-3.5 flex items-center gap-2 rounded-full border border-black/[0.07] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] px-3.5 py-1 text-[11.5px] font-medium text-[var(--text-secondary)] shadow-2xs backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 duration-1000" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          <span className="text-[var(--text)] font-semibold tracking-tight">Active Context</span>
          <span className="text-[var(--muted)]">·</span>
          <span className="text-[var(--text-secondary)]">Live Sync</span>
        </div>
      </div>

      {/* 2. Connection System: GPU-accelerated SVG flow lines with normalized pathLength for perfectly uniform, smooth animation */}
      <div className="relative w-full max-w-[520px] h-[95px] sm:h-[110px] hidden sm:block pointer-events-none -mt-2">
        <svg
          viewBox="0 0 520 110"
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
                ? "M 260 0 L 260 110"
                : `M 260 0 C 260 ${Math.abs(targetX - 260) > 130 ? 38 : 52}, ${targetX} 58, ${targetX} 110`;

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
                    animationDelay: `${index * 0.22}s`,
                  }}
                />

                {/* Receiving connection node dot */}
                <circle
                  cx={targetX}
                  cy="108"
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
      <div className="sm:hidden flex flex-col items-center my-3" aria-hidden="true">
        <div className="w-[1.5px] h-7 bg-gradient-to-b from-[var(--border-hover)] to-[var(--primary)]" />
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
                  className={`flex h-[56px] w-[56px] sm:h-[64px] sm:w-[64px] items-center justify-center rounded-[18px] transition-all duration-200 ease-out group-hover:-translate-y-1 active:scale-95 ${
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
                  className={`mt-2 text-[12px] sm:text-[13px] font-medium transition-colors duration-150 ${
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
