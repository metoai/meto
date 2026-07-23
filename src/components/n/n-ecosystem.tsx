"use client";

import { NSection, NSectionIntro } from "@/components/n/n-section";

const LOGOS = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "Gemini",
  "Copilot",
  "Perplexity",
  "DeepSeek",
];

export function NEcosystem() {
  return (
    <NSection id="ecosystem" compact>
      <NSectionIntro
        eyebrow="Integration Layer"
        title="Works across your AI workflow"
        subtitle="Meto powers the layer beneath the ecosystem, supplying context to every tool."
        align="center"
        className="mb-16"
      />

      <div className="relative mx-auto max-w-[900px]">
        {/* Soft fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--bg)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--bg)] to-transparent" />

        <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale transition-all duration-700 hover:grayscale-0 sm:gap-12 md:gap-16">
          {LOGOS.map((name) => (
            <div
              key={name}
              className="flex items-center justify-center font-mono-brand text-[15px] font-semibold tracking-tight text-[var(--text)] transition-colors hover:text-[var(--primary)]"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </NSection>
  );
}
