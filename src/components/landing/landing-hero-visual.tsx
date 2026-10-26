"use client";

import { useState } from "react";
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
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

      {/* Atmospheric warm orange ambient motion glow behind Meto card */}
      <div
        className="absolute top-6 left-1/2 -translate-x-1/2 w-[440px] h-[260px] rounded-full bg-gradient-to-b from-[var(--primary)]/16 via-[var(--primary)]/5 to-transparent blur-3xl pointer-events-none meto-motion-gradient-hero"
        aria-hidden="true"
      />

      {/* 1. Universal Developer Identity Card — Minimal & Human */}
      <div className="relative z-10 w-full max-w-[400px] sm:max-w-[420px] rounded-2xl border border-black/[0.06] dark:border-white/10 bg-white/80 dark:bg-[#111113]/90 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.05),inset_0_1px_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_1px_1px_0_rgba(255,255,255,0.06)] p-4 sm:p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(255,77,0,0.12)]">
        {/* Subtle top bar: Window dots & quiet Synced indicator */}
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.05] dark:border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-black/15 dark:bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-black/15 dark:bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-black/15 dark:bg-white/20" />
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Synced</span>
          </div>
        </div>

        {/* Identity & Role */}
        <div className="pt-3.5 flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] via-[#ff5a14] to-[#ff7332] shadow-[0_4px_14px_rgba(255,77,0,0.25)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/logo-icon.svg"
              alt="Meto logo"
              width={24}
              height={24}
              className="h-5 w-5 object-contain brightness-0 invert select-none"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-[14px] text-[var(--text)] tracking-tight leading-none">
              Alex Mercer
            </h3>
            <p className="mt-1 text-[12px] text-[var(--text-secondary)]">
              Senior Full-Stack Engineer
            </p>
          </div>
        </div>

        {/* Stack Chips */}
        <div className="pt-3 flex flex-wrap gap-1.5">
          {["TypeScript", "Next.js", "Supabase", "Tailwind"].map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-black/[0.05] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.03] px-2.5 py-0.5 text-[11px] text-[var(--text-secondary)]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Human Instruction Note */}
        <div className="mt-3.5 rounded-xl border border-black/[0.04] dark:border-white/[0.05] bg-black/[0.02] dark:bg-white/[0.02] px-3.5 py-2.5">
          <p className="text-[12px] leading-relaxed text-[var(--text)] italic">
            &ldquo;Prefer clean TypeScript and modular code. Skip conversational filler.&rdquo;
          </p>
        </div>
      </div>

      {/* 2. Connection System: Whisper-quiet, calm ambient pulse with interactive hover connections */}
      <div className="relative w-full max-w-[520px] h-[85px] sm:h-[95px] hidden sm:block pointer-events-none -mt-1.5">
        <svg
          viewBox="0 0 520 95"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          <defs>
            {/* Feathered beam gradient: zero opacity at both ends for soft, organic flow */}
            <linearGradient id="beamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
              <stop offset="25%" stopColor="var(--primary)" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#ff7a3d" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ff7a3d" stopOpacity="0" />
            </linearGradient>

            {/* Subtle glow filter for the hovered connection */}
            <filter id="hoverGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central top origin port dot */}
          <circle
            cx="260"
            cy="0"
            r="2.5"
            className="fill-[var(--primary)] opacity-40"
          />

          {TARGET_X_COORDS.map((targetX, index) => {
            const isHovered = hoveredIndex === index;
            const hasAnyHover = hoveredIndex !== null;
            const distanceFromCenter = Math.abs(index - 3);

            const pathD =
              targetX === 260
                ? "M 260 0 L 260 95"
                : `M 260 0 C 260 ${Math.abs(targetX - 260) > 130 ? 32 : 44}, ${targetX} 50, ${targetX} 95`;

            return (
              <g key={targetX}>
                {/* Static neutral connection track */}
                <path
                  d={pathD}
                  stroke={isHovered ? "var(--primary)" : "currentColor"}
                  strokeWidth={isHovered ? "1.75" : "1"}
                  strokeLinecap="round"
                  filter={isHovered ? "url(#hoverGlow)" : undefined}
                  className={`transition-all duration-200 ${
                    isHovered
                      ? "opacity-100"
                      : hasAnyHover
                      ? "text-black/5 dark:text-white/5 opacity-40"
                      : "text-black/10 dark:text-white/10 opacity-70"
                  }`}
                />

                {/* Calm, rhythmic ambient pulse (active only when not hovering an item) */}
                <path
                  d={pathD}
                  pathLength={100}
                  stroke="url(#beamGradient)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeDasharray="26 120"
                  className={`meto-smooth-beam transition-opacity duration-300 ${
                    hasAnyHover ? "opacity-0" : "opacity-100"
                  }`}
                  style={{
                    animationDelay: `${distanceFromCenter * 0.16}s`,
                  }}
                />

                {/* Receiving connection node dot */}
                <circle
                  cx={targetX}
                  cy="93"
                  r={isHovered ? "3" : "1.75"}
                  className={`transition-all duration-200 ${
                    isHovered
                      ? "fill-[var(--primary)] opacity-100"
                      : "fill-black/20 dark:fill-white/25"
                  }`}
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
            const isHovered = hoveredIndex === index;
            return (
              <div
                key={tool.id}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group flex flex-col items-center text-center cursor-default ${
                  isLastMobile ? "col-span-3 sm:col-span-1" : ""
                }`}
              >
                <div
                  className={`flex h-[54px] w-[54px] sm:h-[62px] sm:w-[62px] items-center justify-center rounded-[18px] transition-all duration-200 ease-out group-hover:-translate-y-1 active:scale-95 ${
                    tool.isMore
                      ? "border border-dashed border-[var(--border-hover)] bg-[var(--surface)]/50 text-[var(--muted)] group-hover:border-[var(--primary)] group-hover:text-[var(--text)] group-hover:shadow-sm"
                      : isHovered
                      ? "border-[var(--primary)]/60 bg-[var(--card)] shadow-md -translate-y-0.5"
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
                      : isHovered
                      ? "text-[var(--text)] font-semibold"
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

      {/* Calm, product-grade animation with generous rest interval */}
      <style jsx>{`
        @keyframes metoSmoothPulse {
          0% {
            stroke-dashoffset: 140;
            opacity: 0;
          }
          8% {
            opacity: 0.65;
          }
          32% {
            opacity: 0.65;
          }
          44% {
            stroke-dashoffset: -30;
            opacity: 0;
          }
          100% {
            stroke-dashoffset: -30;
            opacity: 0;
          }
        }

        .meto-smooth-beam {
          animation: metoSmoothPulse 5.4s cubic-bezier(0.25, 0.1, 0.25, 1) infinite;
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
