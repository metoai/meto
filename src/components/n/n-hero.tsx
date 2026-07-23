"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function NHero() {
  return (
    <section className="relative flex min-h-[95svh] flex-col justify-between px-4 pt-36 pb-20 sm:px-8 md:px-12 lg:px-16">
      {/* Barely-there noise/grain overlay */}
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }}
      />

      {/* Main content: left-aligned, not centered */}
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="max-w-[760px]">
          <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-medium leading-[1.0] tracking-[-0.04em] text-[var(--text)]">
            Every AI<br />
            <span className="text-[var(--text-secondary)]">should already</span><br />
            know you.
          </h1>

          <div className="mt-10 flex flex-col gap-8 sm:flex-row sm:items-start sm:gap-16">
            <p className="max-w-[380px] text-[17px] leading-[1.65] text-[var(--text-secondary)]">
              One profile. Persistent context across ChatGPT, Claude, Cursor, Gemini — and every AI tool that comes next.
            </p>
            
            <div className="flex flex-col gap-4">
              <button className="inline-flex w-fit items-center gap-2.5 rounded-xl bg-[var(--text)] px-7 py-4 text-[15px] font-medium text-[var(--bg)] transition-transform active:scale-95">
                Create your profile
                <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                href="#transformation"
                className="text-[14px] text-[var(--muted)] underline-offset-4 hover:underline"
              >
                See how it works ↓
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom trust strip — restrained, not a checklist */}
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-[13px] tracking-wide text-[var(--muted)]">
          Free to start &nbsp;·&nbsp; MCP compatible &nbsp;·&nbsp; Connect GitHub, Cursor, Claude &nbsp;·&nbsp; Your data stays yours
        </p>
      </div>
    </section>
  );
}
