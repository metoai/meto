"use client";

import { MetoMarkBadge } from "@/components/meto-mark";

export function LandingHowItWorksDemo() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 w-full">
      {/* Step 1: Capture */}
      <div className="landing-panel flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)]/10 font-mono text-[12px] font-bold text-[var(--primary)]">
              01
            </span>
            <span className="font-mono-brand text-[10.5px] uppercase tracking-[0.12em] text-[var(--muted)]">
              Capture
            </span>
          </div>

          <h3 className="text-[17px] font-semibold text-[var(--text)] tracking-tight">
            Tell Meto who you are
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
            Share your work, tech stack, rules, and preferences in natural conversation.
          </p>
        </div>

        {/* Mini Chat Visual Mockup */}
        <div className="mt-6 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-3.5 space-y-3">
          <div className="flex justify-end">
            <p className="max-w-[90%] rounded-lg border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-white/[0.06] px-3 py-1.5 text-[12px] leading-snug text-[var(--text)] shadow-2xs">
              I build Next.js apps with Supabase. Skip conversational fluff.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <MetoMarkBadge size="sm" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium text-[var(--text)]">Meto</p>
              <p className="text-[12px] leading-snug text-[var(--text-secondary)]">
                Stored. Injected strict TypeScript & concise style into your assistants.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Structure */}
      <div className="landing-panel flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)]/10 font-mono text-[12px] font-bold text-[var(--primary)]">
              02
            </span>
            <span className="font-mono-brand text-[10.5px] uppercase tracking-[0.12em] text-[var(--muted)]">
              Structure
            </span>
          </div>

          <h3 className="text-[17px] font-semibold text-[var(--text)] tracking-tight">
            Meto indexes your identity
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
            Everything becomes a living semantic profile — organized and always editable.
          </p>
        </div>

        {/* Structured Data Visual Mockup */}
        <div className="mt-6 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-3.5 space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-black/[0.05] dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.04] px-3 py-1.5 shadow-2xs">
            <span className="text-[11px] font-mono text-[var(--muted)] uppercase">Stack</span>
            <span className="text-[12px] font-medium text-[var(--text)]">TypeScript, Next.js, Supabase</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-black/[0.05] dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.04] px-3 py-1.5 shadow-2xs">
            <span className="text-[11px] font-mono text-[var(--muted)] uppercase">Style</span>
            <span className="text-[12px] font-medium text-[var(--text)]">Modular, clean, no apologies</span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-black/[0.05] dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.04] px-3 py-1.5 shadow-2xs">
            <span className="text-[11px] font-mono text-[var(--muted)] uppercase">Score</span>
            <span className="text-[12px] font-semibold text-emerald-600 dark:text-emerald-400">94% complete</span>
          </div>
        </div>
      </div>

      {/* Step 3: Deploy */}
      <div className="landing-panel flex flex-col justify-between p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
        <div>
          <div className="flex items-center justify-between mb-5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--primary)]/10 font-mono text-[12px] font-bold text-[var(--primary)]">
              03
            </span>
            <span className="font-mono-brand text-[10.5px] uppercase tracking-[0.12em] text-[var(--muted)]">
              Deploy
            </span>
          </div>

          <h3 className="text-[17px] font-semibold text-[var(--text)] tracking-tight">
            Every AI already knows you
          </h3>
          <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--text-secondary)]">
            Connect once via MCP. Your context travels with you to every assistant.
          </p>
        </div>

        {/* Live Sync Status Visual Mockup */}
        <div className="mt-6 rounded-xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.02] p-3.5 space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-black/[0.05] dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.04] px-3 py-1.5 shadow-2xs">
            <span className="text-[12px] font-medium text-[var(--text)]">Claude Desktop</span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-black/[0.05] dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.04] px-3 py-1.5 shadow-2xs">
            <span className="text-[12px] font-medium text-[var(--text)]">Cursor (.cursorrules)</span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced
            </span>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-black/[0.05] dark:border-white/[0.07] bg-white/80 dark:bg-white/[0.04] px-3 py-1.5 shadow-2xs">
            <span className="text-[12px] font-medium text-[var(--text)]">ChatGPT</span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
