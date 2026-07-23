"use client";

import { NSection, NSectionIntro } from "@/components/n/n-section";
import { Check } from "lucide-react";

export function NPricing() {
  return (
    <NSection id="pricing">
      <NSectionIntro
        eyebrow="Simple Pricing"
        title="Start free. Upgrade when you need AI."
        subtitle="Build your core identity for free. Upgrade to Pro for automated context syncing, API access, and advanced memory retention."
        align="center"
        className="mb-16"
      />

      <div className="mx-auto grid max-w-[900px] gap-6 md:grid-cols-2">
        {/* Free Plan */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-10 shadow-sm">
          <h3 className="text-[1.25rem] font-medium text-[var(--text)]">Free</h3>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-[2.5rem] font-medium tracking-tight text-[var(--text)]">$0</span>
            <span className="text-[15px] text-[var(--muted)]">/month</span>
          </div>
          <p className="mt-4 text-[14px] text-[var(--text-secondary)]">
            For individuals establishing their AI identity.
          </p>

          <div className="my-8 h-px w-full bg-[var(--border)]" />

          <ul className="space-y-4">
            {["1 Profile", "Manual Context Sync", "Basic Integrations", "Standard Support"].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-[var(--text)]" />
                <span className="text-[14px] text-[var(--text-secondary)]">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button className="mt-10 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-6 py-3.5 text-[14px] font-medium text-[var(--text)] transition-colors hover:bg-[var(--border)]">
            Start for free
          </button>
        </div>

        {/* Pro Plan */}
        <div className="relative overflow-hidden rounded-3xl border border-[var(--primary)] bg-[var(--surface)] p-10 shadow-lg">
          {/* Subtle glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full bg-[var(--primary)] opacity-[0.05] blur-[50px]" />
          
          <div className="flex items-center justify-between">
            <h3 className="text-[1.25rem] font-medium text-[var(--text)]">Pro</h3>
            <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-[var(--primary)]">
              Most Popular
            </span>
          </div>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-[2.5rem] font-medium tracking-tight text-[var(--text)]">$12</span>
            <span className="text-[15px] text-[var(--muted)]">/month</span>
          </div>
          <p className="mt-4 text-[14px] text-[var(--text-secondary)]">
            Automated context that evolves with your workflow.
          </p>

          <div className="my-8 h-px w-full bg-[var(--border)]" />

          <ul className="space-y-4">
            {["Unlimited Profiles", "Automatic MCP Sync", "GitHub Integration", "Priority Support", "API Access"].map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <Check className="h-4 w-4 text-[var(--primary)]" />
                <span className="text-[14px] text-[var(--text-secondary)]">{feature}</span>
              </li>
            ))}
          </ul>
          
          <button className="mt-10 w-full rounded-xl bg-[var(--text)] px-6 py-3.5 text-[14px] font-medium text-[var(--bg)] shadow-sm transition-transform active:scale-95">
            Upgrade to Pro
          </button>
        </div>
      </div>
    </NSection>
  );
}
