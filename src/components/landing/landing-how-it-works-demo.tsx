"use client";

import { useState } from "react";
import {
  FileCode2,
  Database,
  Cpu,
  Server,
  Cloud,
  Check,
  Layers,
  Lock,
  GitBranch,
  ShieldCheck,
  Terminal,
} from "lucide-react";
import { MetoMarkBadge } from "@/components/meto-mark";

export function LandingHowItWorksDemo() {
  const [activeTab, setActiveTab] = useState<"context" | "directives" | "secrets">("context");
  const [activeFilter1, setActiveFilter1] = useState(true);
  const [activeFilter2, setActiveFilter2] = useState(true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 w-full">
      {/* ─────────────────────────────────────────────────────────────
          CARD 1: Reduce Context Bloat (Streamline Context Injection)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-neutral-900/80 p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.14]">
        <div>
          <h3 className="text-[19px] sm:text-[21px] font-semibold text-neutral-950 dark:text-white tracking-tight">
            Reduce Context Bloat
          </h3>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-lg mb-6">
            Filter inactive rules and deduplicate project context before injection, cutting prompt token overhead by up to 60%.
          </p>
        </div>

        {/* Recessed Diagram Stage */}
        <div className="rounded-xl sm:rounded-2xl border border-black/[0.06] dark:border-white/[0.07] bg-neutral-50/80 dark:bg-neutral-950/70 p-4 sm:p-6 w-full flex flex-col justify-between relative overflow-hidden">
          {/* Subtle dot matrix background */}
          <div
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(currentColor 0.75px, transparent 0.75px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Top Mini Navigation Bar (matching reference image) */}
          <div className="relative z-10 flex items-center justify-between border-b border-black/[0.05] dark:border-white/[0.06] pb-3 mb-6 text-[11px] sm:text-[12px]">
            <div className="flex items-center gap-3 sm:gap-4 font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("context")}
                className={`pb-1 transition-colors ${
                  activeTab === "context"
                    ? "text-neutral-950 dark:text-white border-b-2 border-[var(--primary)] font-semibold"
                    : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                Context
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("directives")}
                className={`pb-1 transition-colors ${
                  activeTab === "directives"
                    ? "text-neutral-950 dark:text-white border-b-2 border-[var(--primary)] font-semibold"
                    : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                Directives
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("secrets")}
                className={`pb-1 transition-colors ${
                  activeTab === "secrets"
                    ? "text-neutral-950 dark:text-white border-b-2 border-[var(--primary)] font-semibold"
                    : "text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                }`}
              >
                Secrets
              </button>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-[10px] text-neutral-400 dark:text-neutral-500">
              <span className="hidden sm:inline">128k</span>
              <span className="hidden sm:inline">64k</span>
              <span className="hidden sm:inline">32k</span>
              <span className="px-1.5 py-0.5 rounded bg-black/[0.05] dark:bg-white/[0.08] text-neutral-900 dark:text-white font-semibold">
                8k (Live)
              </span>
            </div>
          </div>

          {/* Diagram Flow */}
          <div className="relative z-10 flex items-center justify-between gap-2 sm:gap-4 py-2 overflow-x-auto">
            {/* Source Node */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-neutral-800/90 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center">
                <FileCode2 className="w-6 h-6 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
              </div>
              <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-2">
                Workspace
              </span>
            </div>

            {/* Connector 1: 120k tokens */}
            <div className="flex-1 flex flex-col items-center relative min-w-[70px] sm:min-w-[90px]">
              <span className="mb-1 text-[9.5px] font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                120k tokens
              </span>
              <div className="w-full flex items-center">
                <div className="w-full border-t border-dashed border-neutral-300 dark:border-neutral-700" />
                <span className="text-[10px] text-neutral-400 -ml-1">▸</span>
              </div>
            </div>

            {/* Processing Box: FILTER */}
            <div className="shrink-0 rounded-xl bg-white dark:bg-neutral-800/95 border border-black/[0.08] dark:border-white/[0.1] shadow-sm p-3 min-w-[130px] sm:min-w-[145px]">
              <span className="block text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-2">
                Filter
              </span>
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => setActiveFilter1(!activeFilter1)}
                  className="flex items-center gap-2 w-full text-left cursor-pointer group"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                      activeFilter1
                        ? "bg-[var(--primary)] text-white"
                        : "border border-neutral-300 dark:border-neutral-600 bg-transparent"
                    }`}
                  >
                    {activeFilter1 && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                  </span>
                  <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                    Drop Logs
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveFilter2(!activeFilter2)}
                  className="flex items-center gap-2 w-full text-left cursor-pointer group"
                >
                  <span
                    className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                      activeFilter2
                        ? "bg-[var(--primary)] text-white"
                        : "border border-neutral-300 dark:border-neutral-600 bg-transparent"
                    }`}
                  >
                    {activeFilter2 && <Check className="w-2.5 h-2.5 stroke-[2.5]" />}
                  </span>
                  <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                    Dedupe Specs
                  </span>
                </button>
              </div>
            </div>

            {/* Connector 2: 48k tokens */}
            <div className="flex-1 flex flex-col items-center relative min-w-[65px] sm:min-w-[80px]">
              <span className="mb-1 text-[9.5px] font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                48k tokens
              </span>
              <div className="w-full flex items-center">
                <div className="w-full border-t border-dashed border-neutral-300 dark:border-neutral-700" />
                <span className="text-[10px] text-neutral-400 -ml-1">▸</span>
              </div>
            </div>

            {/* Destination Node: Active AI / Meto Badge */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-neutral-800/90 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center">
                <MetoMarkBadge size="sm" />
              </div>
              <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-2">
                Active AI
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 2: Route to Any AI Assistant (Routing Architecture)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-neutral-900/80 p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.14]">
        <div>
          <h3 className="text-[19px] sm:text-[21px] font-semibold text-neutral-950 dark:text-white tracking-tight">
            Route to Any AI Assistant
          </h3>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-lg mb-6">
            Broadcast compliance data and context rules to cloud models or local IDE extensions for real-time analysis.
          </p>
        </div>

        {/* Recessed Diagram Stage */}
        <div className="rounded-xl sm:rounded-2xl border border-black/[0.06] dark:border-white/[0.07] bg-neutral-50/80 dark:bg-neutral-950/70 p-4 sm:p-6 w-full min-h-[220px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle dot matrix background */}
          <div
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(currentColor 0.75px, transparent 0.75px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Diagram Flow: 1 to 2 Routing */}
          <div className="relative z-10 w-full flex items-center justify-between gap-3 sm:gap-5">
            {/* Left Source: Telemetry / Meto Store */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-neutral-800/90 shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center">
                <Database className="w-6 h-6 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
              </div>
              <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-2">
                Telemetry
              </span>
            </div>

            {/* Inbound Line: 18.6 GB/s */}
            <div className="flex-1 flex flex-col items-center min-w-[55px] sm:min-w-[70px]">
              <span className="mb-1 text-[9.5px] font-mono text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                18.6 GB/s
              </span>
              <div className="w-full flex items-center">
                <div className="w-full border-t border-dashed border-neutral-300 dark:border-neutral-700" />
                <span className="text-[10px] text-neutral-400 -ml-1">▸</span>
              </div>
            </div>

            {/* Central Router Processor with Lime badge "1" */}
            <div className="shrink-0 relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-neutral-800 border border-black/[0.1] dark:border-white/[0.1] shadow-sm flex items-center justify-center">
                <Cpu className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.7]" />
              </div>
              {/* Lime badge with "1" matching reference image */}
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E5FF7F] text-neutral-950 font-bold text-[9.5px] flex items-center justify-center shadow-xs border border-white dark:border-neutral-900">
                1
              </span>
            </div>

            {/* Branched SVG Connector */}
            <div className="shrink-0 w-16 sm:w-20 h-28 relative flex items-center justify-center">
              <svg
                className="w-full h-full text-neutral-300 dark:text-neutral-700 overflow-visible"
                viewBox="0 0 80 112"
                fill="none"
              >
                <path
                  d="M 0 56 C 35 56, 45 18, 80 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 0 56 C 35 56, 45 94, 80 94"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              </svg>

              {/* Metric tags along branches */}
              <span className="absolute top-1 right-2 text-[9px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/90 dark:bg-neutral-800/90 px-1.5 py-0.5 rounded shadow-2xs">
                6.4 GB/s
              </span>
              <span className="absolute bottom-1 right-2 text-[9px] font-mono text-neutral-500 dark:text-neutral-400 bg-white/90 dark:bg-neutral-800/90 px-1.5 py-0.5 rounded shadow-2xs">
                12.2 GB/s
              </span>
            </div>

            {/* Two Output Nodes */}
            <div className="flex flex-col gap-3 shrink-0">
              {/* Output 1: o11y / SIEM */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-neutral-800/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center">
                  <Server className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
                </div>
                <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                  o11y / SIEM
                </span>
              </div>

              {/* Output 2: S3 / Cloud Storage */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-neutral-800/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center">
                  <Cloud className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
                </div>
                <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                  S3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 3: Mask or Encrypt Sensitive Data (Privacy Engine)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-neutral-900/80 p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.14]">
        <div>
          <h3 className="text-[19px] sm:text-[21px] font-semibold text-neutral-950 dark:text-white tracking-tight">
            Mask or Encrypt Sensitive Data
          </h3>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-lg mb-6">
            Remove or encrypt sensitive data before it leaves your servers, making compliance and security simple.
          </p>
        </div>

        {/* Recessed Diagram Stage */}
        <div className="rounded-xl sm:rounded-2xl border border-black/[0.06] dark:border-white/[0.07] bg-neutral-50/80 dark:bg-neutral-950/70 p-4 sm:p-6 w-full min-h-[220px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle dot matrix background */}
          <div
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(currentColor 0.75px, transparent 0.75px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Diagram Flow: List of Data -> Processor -> Masked Data */}
          <div className="relative z-10 w-full flex items-center justify-between gap-3 sm:gap-4 overflow-x-auto py-2">
            {/* Left Card: LIST OF DATA */}
            <div className="shrink-0 rounded-xl bg-white dark:bg-neutral-800/95 border border-black/[0.08] dark:border-white/[0.1] shadow-sm p-3 min-w-[125px] sm:min-w-[140px]">
              <span className="block text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-2">
                List of Data
              </span>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </span>
                  <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                    SSN
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </span>
                  <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                    Address
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded bg-[var(--primary)] text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                  </span>
                  <span className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200">
                    Credit Card
                  </span>
                </div>
              </div>
            </div>

            {/* Inbound arrow into processor */}
            <div className="flex-1 flex items-center justify-center min-w-[28px] sm:min-w-[40px]">
              <div className="w-full border-t border-dashed border-neutral-300 dark:border-neutral-700" />
              <span className="text-[10px] text-neutral-400 -ml-1">▸</span>
            </div>

            {/* Center Processor Chip with Lime badge "1" */}
            <div className="shrink-0 relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-neutral-800 border border-black/[0.1] dark:border-white/[0.1] shadow-sm flex items-center justify-center">
                <Cpu className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.7]" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E5FF7F] text-neutral-950 font-bold text-[9.5px] flex items-center justify-center shadow-xs border border-white dark:border-neutral-900">
                1
              </span>
            </div>

            {/* Outbound arrow from processor */}
            <div className="flex-1 flex items-center justify-center min-w-[28px] sm:min-w-[40px]">
              <div className="w-full border-t border-dashed border-neutral-300 dark:border-neutral-700" />
              <span className="text-[10px] text-neutral-400 -ml-1">▸</span>
            </div>

            {/* Right Card: MASKED DATA */}
            <div className="shrink-0 rounded-xl bg-white dark:bg-neutral-800/95 border border-black/[0.08] dark:border-white/[0.1] shadow-sm p-3 min-w-[125px] sm:min-w-[140px]">
              <span className="block text-[9px] font-mono font-bold tracking-wider uppercase text-neutral-400 dark:text-neutral-500 mb-2">
                Masked Data
              </span>
              <div className="space-y-1.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
                <div className="py-0.5">*** ** ****</div>
                <div className="py-0.5">**************</div>
                <div className="py-0.5">**** **** ****</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          CARD 4: Platform Migration (Continuous Memory & Rule Sync)
      ───────────────────────────────────────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-neutral-900/80 p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.03)] dark:shadow-none flex flex-col justify-between transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.04] hover:border-black/[0.12] dark:hover:border-white/[0.14]">
        <div>
          <h3 className="text-[19px] sm:text-[21px] font-semibold text-neutral-950 dark:text-white tracking-tight">
            Platform Migration
          </h3>
          <p className="mt-1.5 text-[13.5px] sm:text-[14px] leading-relaxed text-neutral-500 dark:text-neutral-400 max-w-lg mb-6">
            Meto simplifies and accelerates the migration to new observability and SIEM platforms as the needs of your business change.
          </p>
        </div>

        {/* Recessed Diagram Stage */}
        <div className="rounded-xl sm:rounded-2xl border border-black/[0.06] dark:border-white/[0.07] bg-neutral-50/80 dark:bg-neutral-950/70 p-4 sm:p-6 w-full min-h-[220px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle dot matrix background */}
          <div
            className="absolute inset-0 opacity-[0.4] dark:opacity-[0.25] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(currentColor 0.75px, transparent 0.75px)",
              backgroundSize: "16px 16px",
            }}
          />

          {/* Diagram Flow: Matrix Grid -> Telescope/Migration Engine -> Legacy / Next-Gen */}
          <div className="relative z-10 w-full flex items-center justify-between gap-3 sm:gap-5">
            {/* Left: 6x4 Matrix Grid (matching reference image) */}
            <div className="shrink-0 p-2 rounded-xl bg-white dark:bg-neutral-800/90 border border-black/[0.08] dark:border-white/[0.08] shadow-sm">
              <div className="grid grid-cols-6 gap-1 w-[96px] h-[64px]">
                {/* 24 subtle checkered cells */}
                <span className="rounded-xs bg-neutral-200/90 dark:bg-neutral-700/80" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-300/80 dark:bg-neutral-600/80" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-200 dark:bg-neutral-700" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />

                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-300 dark:bg-neutral-600" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-200 dark:bg-neutral-700" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-300/70 dark:bg-neutral-600/70" />

                <span className="rounded-xs bg-neutral-200/80 dark:bg-neutral-700/80" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-200 dark:bg-neutral-700" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-300 dark:bg-neutral-600" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />

                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-200 dark:bg-neutral-700" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-300/90 dark:bg-neutral-600/90" />
                <span className="rounded-xs bg-neutral-100 dark:bg-neutral-800" />
                <span className="rounded-xs bg-neutral-200/90 dark:bg-neutral-700/80" />
              </div>
            </div>

            {/* Inbound Chevrons into Migration Engine */}
            <div className="flex-1 flex items-center justify-center min-w-[35px] sm:min-w-[50px]">
              <div className="w-full flex items-center justify-center gap-0.5 text-neutral-300 dark:text-neutral-700">
                <span className="text-[12px] font-bold">›</span>
                <span className="text-[12px] font-bold">›</span>
                <span className="text-[12px] font-bold">›</span>
              </div>
            </div>

            {/* Center Migration Engine Node with Lime badge "1" */}
            <div className="shrink-0 relative">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-neutral-800 border border-black/[0.1] dark:border-white/[0.1] shadow-sm flex items-center justify-center">
                <GitBranch className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.7]" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#E5FF7F] text-neutral-950 font-bold text-[9.5px] flex items-center justify-center shadow-xs border border-white dark:border-neutral-900">
                1
              </span>
            </div>

            {/* Outbound Chevrons to Targets */}
            <div className="shrink-0 w-14 sm:w-18 h-28 relative flex items-center justify-center">
              <svg
                className="w-full h-full text-neutral-300 dark:text-neutral-700 overflow-visible"
                viewBox="0 0 70 112"
                fill="none"
              >
                <path
                  d="M 0 56 C 30 56, 40 18, 70 18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
                <path
                  d="M 0 56 C 30 56, 40 94, 70 94"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>

            {/* Two Output Nodes: Legacy SIEM and Next-Gen SIEM */}
            <div className="flex flex-col gap-3 shrink-0">
              {/* Output 1: Legacy SIEM / Cursor */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-neutral-800/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center">
                  <Terminal className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
                </div>
                <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 mt-1 whitespace-nowrap">
                  Legacy SIEM
                </span>
              </div>

              {/* Output 2: Next-Gen SIEM / Modern Agents */}
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white dark:bg-neutral-800/90 shadow-[0_2px_8px_rgba(0,0,0,0.05)] border border-black/[0.08] dark:border-white/[0.08] flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-neutral-700 dark:text-neutral-300 stroke-[1.6]" />
                </div>
                <span className="text-[10px] font-medium text-neutral-600 dark:text-neutral-400 mt-1 whitespace-nowrap">
                  Next-Gen SIEM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
