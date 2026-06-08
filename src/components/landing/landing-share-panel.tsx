"use client";

import { AI_BRAND_ICON_LANDING_CLASS } from "@/lib/ai-brand-icon";
import { AI_PLATFORM_ICONS } from "@/lib/ai-platform-icons";
import { SITE_DOMAIN } from "@/lib/site";

const ICONIFY = "https://api.iconify.design";

const DESTINATIONS = [
  { label: "ChatGPT", icon: AI_PLATFORM_ICONS.chatgpt.url },
  { label: "Claude", icon: AI_PLATFORM_ICONS.claude.url },
  { label: "Gemini", icon: AI_PLATFORM_ICONS.gemini.url },
  { label: "Grok", icon: AI_PLATFORM_ICONS.grok.url },
  { label: "Cursor", icon: `${ICONIFY}/simple-icons/cursor.svg` },
  { label: "Agents", icon: null },
  { label: "Team", icon: null },
] as const;

export function LandingSharePanel() {
  return (
    <div className="landing-panel">
      <div className="landing-panel-stage border-b border-[var(--landing-panel-border)] p-6 sm:p-7">
        <p className="landing-panel-label mb-3">Your link</p>
        <div className="landing-command-bar flex items-center justify-between gap-3">
          <span className="truncate">{SITE_DOMAIN}/profile/you</span>
          <span className="shrink-0 font-mono-brand text-[10px] uppercase tracking-[0.08em] text-[var(--primary)]">
            Live
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-7">
        <p className="landing-panel-label mb-4">Works everywhere</p>
        <ul className="flex flex-wrap gap-2">
          {DESTINATIONS.map((dest) => (
            <li key={dest.label} className="landing-chip rounded-md">
              {dest.icon ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dest.icon}
                  alt=""
                  width={14}
                  height={14}
                  className={`h-3.5 w-3.5 object-contain ${AI_BRAND_ICON_LANDING_CLASS}`}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <span className="flex h-3.5 w-3.5 items-center justify-center text-[9px] text-[var(--muted)]">
                  ·
                </span>
              )}
              <span>{dest.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
