"use client";

import { NSection, NSectionIntro } from "@/components/n/n-section";

export function NUniversalAccess() {
  return (
    <NSection id="universal-access" compact>
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <NSectionIntro
            eyebrow="Universal Access"
            title="Bring your context anywhere"
            subtitle="One profile. Every AI workflow. Inject your context into Claude, ChatGPT, Cursor, and Perplexity seamlessly, or connect via MCP."
            align="left"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="mb-4 h-10 w-10 rounded-full bg-[var(--bg)] ring-1 ring-[var(--border)] flex items-center justify-center font-mono-brand font-bold text-[var(--text)]">C</div>
            <h4 className="text-[15px] font-medium text-[var(--text)]">Claude Integration</h4>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">Direct project context injection for web and desktop.</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="mb-4 h-10 w-10 rounded-full bg-[var(--bg)] ring-1 ring-[var(--border)] flex items-center justify-center font-mono-brand font-bold text-[var(--text)]">M</div>
            <h4 className="text-[15px] font-medium text-[var(--text)]">MCP Protocol</h4>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">Native integration for Cursor, Windsurf, and local agents.</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="mb-4 h-10 w-10 rounded-full bg-[var(--bg)] ring-1 ring-[var(--border)] flex items-center justify-center font-mono-brand font-bold text-[var(--text)]">G</div>
            <h4 className="text-[15px] font-medium text-[var(--text)]">ChatGPT Memory</h4>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">One-click synchronization with custom instructions.</p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
            <div className="mb-4 h-10 w-10 rounded-full bg-[var(--bg)] ring-1 ring-[var(--border)] flex items-center justify-center font-mono-brand font-bold text-[var(--text)]">/</div>
            <h4 className="text-[15px] font-medium text-[var(--text)]">Public API</h4>
            <p className="mt-2 text-[13px] leading-relaxed text-[var(--muted)]">Build your own integrations with REST endpoints.</p>
          </div>
        </div>
      </div>
    </NSection>
  );
}
