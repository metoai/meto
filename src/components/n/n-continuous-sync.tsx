"use client";

import { GitCommit, GitBranch, Code2, Workflow } from "lucide-react";
import { NSection, NSectionIntro } from "@/components/n/n-section";

const EVENTS = [
  { icon: GitBranch, title: "pushed to main", time: "2m ago" },
  { icon: Code2, title: "added new component", time: "15m ago" },
  { icon: Workflow, title: "updated routing rules", time: "1h ago" },
];

export function NContinuousSync() {
  return (
    <NSection id="continuous-sync">
      <NSectionIntro
        eyebrow="Ambient Updates"
        title="Your AI stays up to date"
        subtitle="Connect GitHub, local projects, and MCP tools so your context evolves automatically. Infrastructure that lives in the background."
        align="center"
        className="mb-16"
      />

      <div className="mx-auto max-w-[700px] overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
        <div className="border-b border-[var(--border)] bg-[var(--bg)] px-8 py-5">
          <p className="font-mono-brand text-[12px] font-semibold uppercase tracking-wider text-[var(--text)]">
            Live Event Feed
          </p>
        </div>
        
        <div className="p-8">
          <div className="relative space-y-8">
            <div className="absolute bottom-0 left-[19px] top-2 w-[2px] bg-[var(--border)]" />
            
            {EVENTS.map((event, i) => (
              <div key={i} className="relative flex items-center gap-6">
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--bg)] ring-1 ring-[var(--border)]">
                  <event.icon className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <div>
                  <p className="text-[15px] font-medium text-[var(--text)]">{event.title}</p>
                  <p className="mt-1 text-[13px] text-[var(--muted)]">{event.time} • Automatic Sync</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NSection>
  );
}
