import { Sparkles, XCircle, CheckCircle2 } from "lucide-react";

export function LandingHeroComparison() {
  return (
    <div className="landing-animate-in mx-auto mt-20 w-full max-w-[1000px]" style={{ animationDelay: "0.15s" }}>
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] sm:grid-cols-2">
        {/* Without Meto */}
        <div className="flex flex-col border-b border-[var(--border)] bg-[var(--surface-hover)] sm:border-b-0 sm:border-r">
          <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
            <XCircle className="h-4 w-4 text-red-500/80" />
            <span className="text-[13px] font-medium text-[var(--muted)]">Fragmented Context</span>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 font-mono text-[13px]">
            <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-[var(--muted)] shadow-sm">
              <span className="text-[var(--text-secondary)] font-medium">You</span>
              <span className="leading-relaxed">I am building a Next.js 14 app. I use Tailwind CSS. My database has a users table and a projects table. Please remember to use server components by default... [Read More]</span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-[var(--muted)] shadow-sm">
              <span className="text-[var(--text-secondary)] font-medium">AI</span>
              <span className="opacity-70">Understood. I will keep this context in mind for our session. How can I help you today?</span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 text-[var(--muted)] opacity-50 shadow-sm">
              <span className="text-[var(--text-secondary)] font-medium">You</span>
              <span>Build a landing page.</span>
            </div>
          </div>
        </div>

        {/* With Meto */}
        <div className="flex flex-col bg-[var(--card)] relative overflow-hidden">
          {/* Subtle gradient glow in background */}
          <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-[var(--primary)] opacity-[0.03] blur-3xl"></div>
          
          <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-3 relative z-10">
            <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" />
            <span className="text-[13px] font-medium text-[var(--text)]">Persistent Memory</span>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-6 font-mono text-[13px] relative z-10">
            <div className="flex items-center gap-2 text-[var(--primary)]">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Meto Context Injected</span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-3 text-[var(--text)] shadow-sm">
              <span className="font-medium">You</span>
              <span>Build a landing page.</span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] p-3 text-[var(--text)] shadow-sm">
              <span className="font-medium text-[var(--primary)]">AI</span>
              <span className="leading-relaxed">Using your Next.js 14 and Supabase stack. Generating server components with Tailwind styling...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
