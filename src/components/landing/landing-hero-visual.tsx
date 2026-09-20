"use client";

import { useEffect, useState } from "react";
import { MetoMarkBadge } from "@/components/meto-mark";
import { AI_BRAND_ICON_LANDING_CLASS } from "@/lib/ai-brand-icon";
import { Plus } from "lucide-react";

type AiToolItem = {
  id: string;
  name: string;
  iconUrl?: string;
  isMore?: boolean;
};

const IDENTITY_PREVIEWS = [
  "role: senior_engineer",
  "stack: nextjs · ts · supabase",
  "rules: type_safe, modular",
  "context: developer_profile",
  "memory: cross_assistant",
  "mcp: unified_identity",
  "prefs: concise, functional",
] as const;

function TechIdentityTyper() {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState<string>(IDENTITY_PREVIEWS[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = IDENTITY_PREVIEWS[index];
    let timer: NodeJS.Timeout;

    if (!isDeleting && displayed.length < current.length) {
      timer = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length + 1));
      }, 45);
    } else if (!isDeleting && displayed.length === current.length) {
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, 1900);
    } else if (isDeleting && displayed.length > 0) {
      timer = setTimeout(() => {
        setDisplayed(current.slice(0, displayed.length - 1));
      }, 25);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setIndex((prev) => (prev + 1) % IDENTITY_PREVIEWS.length);
    }

    return () => clearTimeout(timer);
  }, [displayed, isDeleting, index]);

  return (
    <div className="mt-3.5 flex items-center gap-1.5 rounded-full border border-black/[0.08] dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.05] px-3.5 py-1 font-mono text-[11px] sm:text-[11.5px] text-[var(--text-secondary)] shadow-2xs backdrop-blur-md max-w-[270px] sm:max-w-[290px] overflow-hidden">
      <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] shrink-0 animate-pulse" />
      <span className="text-gray-400 dark:text-gray-500 font-mono select-none text-[10px]">&gt;</span>
      <span className="font-mono text-[var(--text)] font-medium tracking-tight truncate">
        {displayed}
      </span>
      <span className="inline-block w-1 h-3 bg-[var(--primary)] shrink-0 -ml-0.5 animate-pulse" />
    </div>
  );
}

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

      {/* Atmospheric warm orange glow behind Meto card */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[340px] h-[220px] rounded-full bg-gradient-to-b from-[var(--primary)]/12 to-transparent blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* 1. Meto Identity Card: Premium Glassmorphism with large centered icon logo and tech typing identity text */}
      <div className="relative z-10 flex h-[195px] w-[305px] sm:h-[205px] sm:w-[325px] flex-col items-center justify-center rounded-[24px] border border-white/80 dark:border-white/10 bg-white/45 dark:bg-white/[0.04] backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.06),inset_0_1px_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_1px_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(255,77,0,0.14)]">
        <div className="flex h-16 w-16 sm:h-[74px] sm:w-[74px] items-center justify-center rounded-[18px] sm:rounded-[20px] bg-gradient-to-br from-[var(--primary)] via-[#ff5a14] to-[#ff7332] shadow-[0_8px_24px_rgba(255,77,0,0.32)] transition-transform duration-200 hover:scale-105">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo-icon.svg"
            alt="Meto logo"
            width={44}
            height={44}
            className="h-9 w-9 sm:h-10 sm:w-10 object-contain brightness-0 invert select-none"
          />
        </div>

        {/* Minimal Tech Typing Identity Badge */}
        <TechIdentityTyper />
      </div>

      {/* 2. Connection System: 110px curved SVG Lines flowing to AI integrations */}
      <div className="relative w-full max-w-[520px] h-[95px] sm:h-[110px] hidden sm:block pointer-events-none -mt-2">
        <svg
          viewBox="0 0 520 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {TARGET_X_COORDS.map((targetX, index) => {
            const pathD =
              targetX === 260
                ? "M 260 0 L 260 110"
                : `M 260 0 C 260 ${Math.abs(targetX - 260) > 130 ? 38 : 52}, ${targetX} 58, ${targetX} 110`;

            return (
              <g key={targetX}>
                {/* Thin neutral connection line */}
                <path
                  d={pathD}
                  stroke="var(--border)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  className="opacity-75 dark:opacity-40"
                />

                {/* Subtle active orange pulse */}
                <path
                  d={pathD}
                  stroke="var(--primary)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="14 180"
                  className="meto-flow-pulse"
                  style={{
                    animationDelay: `${index * 0.2}s`,
                  }}
                />

                {/* Connection node dot */}
                <circle
                  cx={targetX}
                  cy="108"
                  r="2"
                  fill="var(--primary)"
                  className="opacity-70"
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

      {/* 3. AI Integrations Row: 64x64px rounded cards with authentic icons */}
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
                  className={`flex h-[56px] w-[56px] sm:h-[64px] sm:w-[64px] items-center justify-center rounded-[16px] transition-all duration-200 group-hover:-translate-y-1 ${
                    tool.isMore
                      ? "border border-dashed border-[var(--border-hover)] bg-[var(--surface)]/50 text-[var(--muted)] group-hover:border-[var(--primary)] group-hover:text-[var(--text)]"
                      : "border border-[var(--border)] bg-[var(--card)] shadow-2xs group-hover:border-[var(--border-hover)] group-hover:shadow-sm"
                  }`}
                >
                  {tool.isMore ? (
                    <Plus className="h-5 w-5 transition-transform duration-200 group-hover:rotate-90 text-[var(--text-secondary)]" aria-label="More AI tools supported" />
                  ) : tool.iconUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={tool.iconUrl}
                      alt={`${tool.name} integration`}
                      width={26}
                      height={26}
                      loading="lazy"
                      className={`h-[24px] w-[24px] sm:h-[26px] sm:w-[26px] object-contain transition-transform duration-200 group-hover:scale-108 ${AI_BRAND_ICON_LANDING_CLASS}`}
                    />
                  ) : null}
                </div>
                <span
                  className={`mt-2 text-[12px] sm:text-[13px] font-medium transition-colors ${
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

      {/* Subtle pulse animation */}
      <style jsx>{`
        @keyframes metoFlowAnimation {
          0% {
            stroke-dashoffset: 194;
            opacity: 0;
          }
          15% {
            opacity: 0.95;
          }
          85% {
            opacity: 0.95;
          }
          100% {
            stroke-dashoffset: 0;
            opacity: 0;
          }
        }
        .meto-flow-pulse {
          animation: metoFlowAnimation 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .meto-flow-pulse {
            animation: none !important;
            opacity: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
