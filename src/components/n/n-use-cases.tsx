"use client";

import { NSection, NSectionIntro } from "@/components/n/n-section";

const USE_CASES = [
  {
    title: "General AI users",
    description:
      "Stop rewriting your preferences, goals, and projects every time you open a new AI chat.",
  },
  {
    title: "Developers",
    description:
      "Persistent context across Cursor, MCP clients, coding agents, and AI development workflows.",
  },
  {
    title: "Teams & creators",
    description:
      "Keep brand voice, workflows, and institutional knowledge consistent across every AI tool.",
  },
];

export function NUseCases() {
  return (
    <NSection id="use-cases">
      <NSectionIntro
        eyebrow="Built For You"
        title="Built for how people actually use AI"
        align="left"
        className="mb-16"
      />

      <div className="grid gap-6 md:grid-cols-3">
        {USE_CASES.map((useCase) => (
          <div
            key={useCase.title}
            className="group flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-sm transition-all duration-300 hover:border-[var(--primary)] hover:shadow-md"
          >
            <div>
              <p className="font-mono-brand text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--primary)] opacity-80 group-hover:opacity-100">
                {useCase.title}
              </p>
              <h3 className="mt-8 text-[1.125rem] font-medium leading-[1.6] text-[var(--text)]">
                {useCase.description}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </NSection>
  );
}
