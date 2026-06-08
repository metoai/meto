"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { Check, Link2 } from "lucide-react";
import { AI_BRAND_ICON_LANDING_CLASS } from "@/lib/ai-brand-icon";
import { AI_PLATFORM_ICONS } from "@/lib/ai-platform-icons";
import { MetoMarkBadge } from "@/components/meto-mark";

const STEPS = [
  {
    id: "chat",
    label: "Chat",
    title: "Tell Meto who you are",
    description:
      "Share your work, projects, goals, and style in a natural conversation.",
  },
  {
    id: "build",
    label: "Build",
    title: "Meto structures your profile",
    description:
      "Everything you share becomes a living profile — organized and always editable.",
  },
  {
    id: "share",
    label: "Share",
    title: "Every AI already knows you",
    description:
      "Connect your profile once. Use it with ChatGPT, Claude, agents, and collaborators.",
  },
] as const;

const INTERVAL_MS = 3400;
const FADE_MS = 400;

const SHARE_PLATFORMS = [
  { id: "chatgpt", label: "ChatGPT", url: AI_PLATFORM_ICONS.chatgpt.url },
  { id: "claude", label: "Claude", url: AI_PLATFORM_ICONS.claude.url },
  { id: "gemini", label: "Gemini", url: AI_PLATFORM_ICONS.gemini.url },
] as const;

const PROFILE_SECTIONS = [
  { label: "Work", value: "Product designer, early-stage SaaS" },
  { label: "Projects", value: "Meto, design system, landing rebuild" },
  { label: "Style", value: "Direct, iterative, ships fast" },
] as const;

function ChatPreview() {
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <p className="max-w-[88%] rounded-xl landing-panel-glass px-3.5 py-2 text-[13px] leading-snug text-[var(--text)]">
          I&apos;m a product designer building Meto — a profile every AI can read.
        </p>
      </div>
      <div className="flex gap-3">
        <MetoMarkBadge size="sm" />
        <div className="min-w-0 flex-1">
          <p className="mb-1 text-[11px] font-medium text-[var(--text)]">Meto</p>
          <p className="text-[13px] leading-[1.55] text-[var(--text-secondary)]">
            Got it. What are you working on right now?
          </p>
        </div>
      </div>
    </div>
  );
}

function BuildPreview() {
  return (
    <div className="space-y-2">
      {PROFILE_SECTIONS.map((section, index) => (
        <div
          key={section.label}
          className="flex items-start gap-3 rounded-xl landing-panel-glass px-3.5 py-2.5"
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--primary-light)] text-[10px] font-semibold text-[var(--primary)]">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              {section.label}
            </p>
            <p className="mt-1 text-[13px] leading-snug text-[var(--text)]">{section.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function SharePreview() {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center gap-3 rounded-xl landing-panel-glass px-3.5 py-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-light)] text-[var(--primary)]">
          <Link2 className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
            Your link
          </p>
          <p className="mt-0.5 truncate font-mono-brand text-[13px] text-[var(--text)]">
            meto.app/u/alex
          </p>
        </div>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
          Connected
        </p>
        <div className="flex flex-wrap gap-2">
          {SHARE_PLATFORMS.map((platform) => (
            <span
              key={platform.id}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--accent-border)] bg-[var(--primary-light)]/40 px-3 py-1.5 text-[12px] text-[var(--text)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={platform.url}
                alt=""
                width={14}
                height={14}
                className={`h-3.5 w-3.5 object-contain ${AI_BRAND_ICON_LANDING_CLASS}`}
              />
              {platform.label}
              <Check className="h-3 w-3 text-[var(--primary)]" strokeWidth={2.5} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

const PREVIEWS = [ChatPreview, BuildPreview, SharePreview] as const;

export function LandingHowItWorksDemo() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % STEPS.length);
      setProgressKey((k) => k + 1);
    }, INTERVAL_MS);

    return () => window.clearInterval(id);
  }, []);

  const active = STEPS[activeIndex];

  const ActivePreview = PREVIEWS[activeIndex];

  return (
    <div className="landing-panel">
      <div className="flex items-center gap-1 border-b border-[var(--landing-panel-border)] px-4 py-2.5 sm:px-5">
        {STEPS.map((step, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setProgressKey((k) => k + 1);
              }}
              className={`relative overflow-hidden rounded-md px-3 py-1.5 font-mono-brand text-[11px] font-medium uppercase tracking-[0.08em] transition-[color,background-color] duration-200 ${
                isActive
                  ? "bg-[var(--surface)] text-[var(--text)]"
                  : "text-[var(--muted)] hover:text-[var(--text-secondary)]"
              }`}
            >
              {step.label}
              {isActive ? (
                <span
                  key={progressKey}
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left bg-[var(--primary)] motion-safe:animate-[landing-how-progress_var(--progress-duration)_linear_forwards]"
                  style={{ "--progress-duration": `${INTERVAL_MS}ms` } as CSSProperties}
                  aria-hidden
                />
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-start lg:divide-x lg:divide-[var(--landing-panel-border)]">
        <div className="landing-panel-stage p-4 sm:p-5">
          <div
            key={activeIndex}
            className="transition-opacity duration-[var(--fade-ms)]"
            style={{ "--fade-ms": `${FADE_MS}ms` } as CSSProperties}
          >
            <ActivePreview />
          </div>
        </div>

        <div className="border-t border-[var(--landing-panel-border)] p-4 sm:p-5 lg:border-t-0">
          <p className="landing-panel-label">
            Step {String(activeIndex + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-1.5 text-balance text-[1.0625rem] font-semibold leading-[1.2] tracking-[-0.02em] text-[var(--text)] sm:text-lg">
            {active.title}
          </h3>
          <p className="mt-1.5 text-[13px] leading-[1.6] text-[var(--text-secondary)] sm:text-[14px]">
            {active.description}
          </p>
        </div>
      </div>
    </div>
  );
}
