"use client";

import { useEffect, useState } from "react";
import { AI_PLATFORM_ICONS } from "@/lib/ai-platform-icons";

const ICONIFY = "https://api.iconify.design";

export const PROBLEM_REPEATERS = [
  { id: "chatgpt", label: "ChatGPT", url: AI_PLATFORM_ICONS.chatgpt.url },
  { id: "claude", label: "Claude", url: AI_PLATFORM_ICONS.claude.url },
  { id: "gemini", label: "Gemini", url: AI_PLATFORM_ICONS.gemini.url },
  { id: "cursor", label: "Cursor", url: `${ICONIFY}/simple-icons/cursor.svg` },
  { id: "agents", label: "Future agents", url: null },
] as const;

const PROMPT = "Tell me about yourself.";
const ITEM_HEIGHT = 84;
const INTERVAL_MS = 2600;
const TRANSITION_MS = 520;

function AgentAvatar({ url, label }: { url: string | null; label: string }) {
  if (!url) {
    return (
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]">
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[var(--muted)]" fill="none" aria-hidden>
          <path
            d="M12 3v3M12 18v3M3 12h3M18 12h3"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        width={16}
        height={16}
        className={`h-4 w-4 object-contain ${url ? "opacity-90 dark:brightness-0 dark:invert" : ""}`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

export function LandingProblemFeed() {
  const count = PROBLEM_REPEATERS.length;
  const items = [...PROBLEM_REPEATERS, ...PROBLEM_REPEATERS];
  const [activeIndex, setActiveIndex] = useState(0);
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setActiveIndex((i) => i + 1);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (activeIndex !== count) return;

    const timeout = window.setTimeout(() => {
      setTransition(false);
      setActiveIndex(0);
    }, TRANSITION_MS);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, count]);

  useEffect(() => {
    if (transition || activeIndex !== 0) return;

    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setTransition(true));
    });

    return () => window.cancelAnimationFrame(frame);
  }, [transition, activeIndex]);

  const translateY = ITEM_HEIGHT - activeIndex * ITEM_HEIGHT;
  const viewportHeight = ITEM_HEIGHT * 3;

  return (
    <div className="relative">
      <div
        className="landing-panel landing-problem-feed relative overflow-hidden"
        style={{ height: viewportHeight }}
      >
        <div
          className={`landing-problem-feed__track ${
            transition ? "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" : ""
          }`}
          style={{ transform: `translateY(${translateY}px)` }}
        >
          {items.map((item, i) => {
            const distance = Math.abs(i - activeIndex);
            const isActive = distance === 0;
            const isNear = distance === 1;

            return (
              <div
                key={`${item.id}-${i}`}
                className="flex items-center gap-3.5 px-5 sm:px-6"
                style={{
                  height: ITEM_HEIGHT,
                  filter: isActive ? "none" : isNear ? "blur(1px)" : "blur(2px)",
                  opacity: isActive ? 1 : isNear ? 0.55 : 0.28,
                  transform: isActive ? "scale(1)" : "scale(0.98)",
                  transition: transition
                    ? "filter 0.5s ease, opacity 0.5s ease, transform 0.5s ease"
                    : "none",
                }}
              >
                <AgentAvatar url={item.url} label={item.label} />
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[11px] font-medium transition-colors duration-500 ${
                      isActive ? "text-[var(--text-secondary)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {item.label}
                  </p>
                  <p
                    className={`mt-1 truncate text-[13px] leading-snug transition-colors duration-500 sm:text-[14px] ${
                      isActive
                        ? "text-[var(--text)]"
                        : "text-[var(--placeholder)]"
                    }`}
                  >
                    {isActive ? (
                      <>
                        &ldquo;{PROMPT}&rdquo;
                        <span className="landing-problem-cursor ml-0.5 inline-block w-[2px] animate-pulse bg-[var(--primary)]" />
                      </>
                    ) : (
                      <span className="italic">&ldquo;{PROMPT}&rdquo;</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-4 text-center font-mono-brand text-[11px] uppercase tracking-[0.08em] text-[var(--muted)] lg:text-left">
        You answer again. And again.
      </p>
    </div>
  );
}
