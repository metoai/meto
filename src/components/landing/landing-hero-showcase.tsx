"use client";

import { useState } from "react";
import { Check, Code2, Cpu, Copy, Palette, Rocket, ShieldCheck, Terminal, Zap } from "lucide-react";
import { SUPPORTED_AI_PARTNERS } from "@/lib/ai-platform-icons";

export type RoleProfile = {
  id: string;
  role: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  stack: string[];
  directives: string;
  project: string;
};

export const ROLE_PROFILES: RoleProfile[] = [
  {
    id: "fullstack",
    label: "Fullstack Dev",
    role: "Senior Fullstack Engineer",
    icon: Code2,
    stack: ["Next.js 15", "TypeScript", "Tailwind CSS", "Supabase"],
    directives: "Write clean, type-safe code. Prefer server components and functional patterns. Never swallow errors.",
    project: "Building Meto — identity & context infrastructure for AI-native workflows.",
  },
  {
    id: "design",
    label: "Design Engineer",
    role: "Lead Design Engineer",
    icon: Palette,
    stack: ["React 19", "Tailwind v4", "Figma", "Framer Motion"],
    directives: "Prioritize micro-animations, glassmorphism, dark mode balance, and accessible contrast guidelines.",
    project: "Designing next-gen developer tools & interactive UI design systems.",
  },
  {
    id: "ai",
    label: "AI Developer",
    role: "AI & ML Systems Engineer",
    icon: Cpu,
    stack: ["Python 3.12", "LangChain", "OpenAI API", "Vector DBs"],
    directives: "Enforce strict schema validation, structured outputs, efficient embedding retrieval, and low latency.",
    project: "Building autonomous subagents and persistent context engines for team workflows.",
  },
  {
    id: "founder",
    label: "Solo Founder",
    role: "Technical Founder",
    icon: Rocket,
    stack: ["Next.js", "Stripe", "PostHog", "Vercel"],
    directives: "Move fast, focus on core value propositions, build frictionless onboarding, and measure key funnels.",
    project: "Bootstrapping an AI productivity SaaS product to 10k MRR.",
  },
];

export function LandingHeroShowcase() {
  const [viewMode, setViewMode] = useState<"web" | "cli">("web");
  const [activeRoleTab, setActiveRoleTab] = useState<string>("fullstack");
  const [copied, setCopied] = useState(false);

  const currentProfile = ROLE_PROFILES.find((p) => p.id === activeRoleTab) || ROLE_PROFILES[0];

  function handleCopyPrompt() {
    const text = `[Meto Profile: ${currentProfile.role}]\nStack: ${currentProfile.stack.join(", ")}\nDirectives: ${currentProfile.directives}\nProject: ${currentProfile.project}`;
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleCopyCli() {
    void navigator.clipboard.writeText("npx meto init");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="w-full max-w-[920px] mx-auto">
      {/* Outer Shell */}
      <div className="relative rounded-2xl border border-[var(--border)] bg-[var(--card)]/90 p-1 shadow-xl backdrop-blur-xl transition-all duration-300">
        <div className="relative z-10 rounded-xl bg-[var(--bg)]/95 border border-[var(--border-subtle)] overflow-hidden">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)] bg-[var(--surface)]/50 px-4 py-2.5 sm:px-5">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              </div>

              {/* View Selector */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setViewMode("web")}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    viewMode === "web"
                      ? "bg-[var(--primary)] text-white shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <ShieldCheck className="h-3 w-3" />
                  <span>Web Context</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("cli")}
                  className={`flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                    viewMode === "cli"
                      ? "bg-[var(--primary)] text-white shadow-xs"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <Terminal className="h-3 w-3" />
                  <span>CLI Mode</span>
                </button>
              </div>
            </div>

            {/* Role Options */}
            {viewMode === "web" && (
              <div className="flex items-center gap-1">
                {ROLE_PROFILES.map((p) => {
                  const Icon = p.icon;
                  const isActive = p.id === activeRoleTab;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveRoleTab(p.id)}
                      className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[var(--card)] text-[var(--text)] border border-[var(--border)]"
                          : "text-[var(--muted)] hover:text-[var(--text)]"
                      }`}
                    >
                      <Icon className={`h-3 w-3 ${isActive ? "text-[var(--primary)]" : "text-[var(--muted)]"}`} />
                      <span className="hidden sm:inline">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Minimal Content Body */}
          {viewMode === "web" ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--border-subtle)]">
              {/* Left Column: Context Summary */}
              <div className="md:col-span-7 p-5 sm:p-6 text-left flex flex-col justify-between gap-4">
                <div>
                  {/* Explanatory Header Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--primary-light)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--primary)]">
                      <ShieldCheck className="h-3 w-3" />
                      Persistent AI Memory Profile
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono-brand text-emerald-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Auto-Injected
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-mono-brand uppercase tracking-wider text-[var(--muted)]">Role & Project Focus</div>
                    <h3 className="text-sm font-bold text-[var(--text)] tracking-tight">
                      {currentProfile.role}
                    </h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {currentProfile.project}
                    </p>
                  </div>

                  {/* Stack Badges */}
                  <div className="mt-3.5 space-y-1">
                    <div className="text-[10px] font-mono-brand uppercase tracking-wider text-[var(--muted)]">Active Tech Stack</div>
                    <div className="flex flex-wrap gap-1.5">
                      {currentProfile.stack.map((item) => (
                        <span
                          key={item}
                          className="rounded border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 text-[11px] font-medium text-[var(--text)]"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Directives Preview */}
                  <div className="mt-3.5 space-y-1">
                    <div className="text-[10px] font-mono-brand uppercase tracking-wider text-[var(--primary)] font-semibold">AI System Directives</div>
                    <div className="rounded-md border-l-2 border-[var(--primary)] bg-[var(--surface)]/60 p-2.5">
                      <p className="text-[11px] font-mono-brand text-[var(--text-secondary)] italic leading-relaxed">
                        &ldquo;{currentProfile.directives}&rdquo;
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-[11px] text-[var(--muted)]">
                  <span>Injected into system prompts</span>
                  <button
                    type="button"
                    onClick={handleCopyPrompt}
                    className="flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-medium text-[var(--text)] hover:border-[var(--accent-border)]"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3 text-[var(--muted)]" />}
                    <span>{copied ? "Copied!" : "Copy Rules"}</span>
                  </button>
                </div>
              </div>

              {/* Right Column: Sleek Partner Logo Grid */}
              <div className="md:col-span-5 p-5 sm:p-6 text-left bg-[var(--surface)]/30 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-[var(--text)]">Syncs across AI Tools</p>
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {SUPPORTED_AI_PARTNERS.slice(0, 6).map((partner) => (
                      <div
                        key={partner.id}
                        className="flex items-center gap-2 rounded-md border border-[var(--border-subtle)] bg-[var(--card)] px-2.5 py-1.5 text-xs"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={partner.url}
                          alt={partner.label}
                          width={14}
                          height={14}
                          className="h-3.5 w-3.5 object-contain"
                        />
                        <span className="font-medium text-[var(--text)] text-[11px]">{partner.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-[var(--muted)]">
                  <Zap className="h-3 w-3 text-[var(--primary)]" />
                  <span>One memory profile for every assistant</span>
                </div>
              </div>
            </div>
          ) : (
            /* Minimal CLI View */
            <div className="bg-[#0d1117] p-5 text-left font-mono text-xs sm:text-sm leading-relaxed text-gray-300">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">$</span>
                  <span className="text-white font-semibold">npx meto init</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCli}
                  className="flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-xs text-gray-200 hover:bg-gray-700"
                >
                  {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3 text-gray-400" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="text-orange-400 font-bold">⚡ METO IDENTITY ENGINE CLI v1.0.0</div>
                <div className="text-gray-400">🔍 Scanned Project: <span className="text-cyan-300">my-awesome-app</span></div>
                <div className="text-emerald-400">✨ Context rules generated: .cursorrules, AGENTS.md, CLAUDE.md</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
