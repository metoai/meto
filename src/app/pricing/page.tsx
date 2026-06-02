import Link from "next/link";
import { MarketingLayout } from "@/components/marketing-layout";
import {
  PRO_AI_CALL_LIMIT,
  TRIAL_AI_CALL_LIMIT,
  TRIAL_DAYS,
} from "@/lib/ai-usage-limits";

export const metadata = {
  title: "Pricing — Meto",
  description:
    "Meto Pro keeps your AI identity accurate with gap fixes, quick updates, and smart compile.",
};

const FREE_FEATURES = [
  "Manual profile editing",
  "Context score and gap list",
  "Workspace copy templates",
  "Local compile (no LLM)",
  "Public profile page",
  "1 custom section",
];

const PRO_FEATURES = [
  `${PRO_AI_CALL_LIMIT} AI actions per month`,
  "AI gap fixes and fix-all",
  "Quick update chat",
  "LLM context score refresh",
  "LLM compile for every AI tool",
  "Up to 5 custom sections",
  "Brain dump and chat onboarding",
];

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--primary)]"
      aria-hidden
    >
      <path
        d="M3.5 8.5l3 3 6-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PricingPage() {
  return (
    <MarketingLayout showFooter>
      <div className="landing-animate-in w-full max-w-3xl">
        <div className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
            Pricing
          </p>
          <h1 className="text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.5px] text-[var(--text)] sm:text-[40px]">
            Start free. Upgrade when you need AI.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-balance text-base leading-relaxed text-[var(--text-secondary)]">
            New accounts get {TRIAL_DAYS} days of Pro with {TRIAL_AI_CALL_LIMIT}{" "}
            AI actions — no card required. After that, stay on Free or subscribe
            for {PRO_AI_CALL_LIMIT} AI actions each month.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-7">
            <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[var(--muted)]">
              Free
            </p>
            <p className="mt-3 text-[36px] font-semibold leading-none tracking-[-0.5px] text-[var(--text)]">
              $0
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              After your trial ends
            </p>
            <ul className="mt-6 space-y-3">
              {FREE_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-snug text-[var(--text)]"
                >
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/auth/signup"
              className="mt-8 flex w-full items-center justify-center rounded-lg border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--text)] transition-colors duration-150 hover:border-[var(--border-hover)] hover:bg-[var(--surface)]"
            >
              Get started
            </Link>
          </div>

          <div className="relative rounded-2xl border border-[var(--primary)] bg-white p-6 sm:p-7">
            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[var(--primary-light)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.06em] text-[var(--primary)]">
              {TRIAL_DAYS}-day trial
            </span>
            <p className="text-[11px] font-medium uppercase tracking-[0.07em] text-[var(--primary)]">
              Pro
            </p>
            <p className="mt-3 text-[36px] font-semibold leading-none tracking-[-0.5px] text-[var(--text)]">
              $10
              <span className="ml-0.5 text-base font-normal text-[var(--text-secondary)]">
                /mo
              </span>
            </p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {TRIAL_AI_CALL_LIMIT} AI actions during trial, then{" "}
              {PRO_AI_CALL_LIMIT}/month
            </p>
            <ul className="mt-6 space-y-3">
              {PRO_FEATURES.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-sm leading-snug text-[var(--text)]"
                >
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-2">
              <Link
                href="/auth/signup"
                className="flex w-full items-center justify-center rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white transition-[background] duration-150 hover:bg-[var(--primary-hover)]"
              >
                Start free trial
              </Link>
              <Link
                href="/auth/login"
                className="flex w-full items-center justify-center rounded-lg px-4 py-2 text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:text-[var(--text)]"
              >
                Log in to upgrade
              </Link>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-[var(--muted)]">
          Landing try chat and public profiles stay free.
        </p>
      </div>
    </MarketingLayout>
  );
}
