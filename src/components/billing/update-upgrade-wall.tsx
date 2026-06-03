"use client";

import Link from "next/link";
import { useState } from "react";
import { openProCheckout } from "@/lib/billing-client";
import { useEntitlements } from "@/hooks/use-entitlements";

export function UpdateUpgradeWall({ children }: { children: React.ReactNode }) {
  const { entitlements, loaded, canUseUpdateChat } = useEntitlements();
  const [loading, setLoading] = useState(false);

  if (!loaded) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="skeleton h-32 w-full max-w-lg rounded-xl" />
      </div>
    );
  }

  if (canUseUpdateChat) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-xl font-semibold text-[var(--text)]">
        Quick update is a Pro feature
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--text-secondary)]">
        Your trial ended. Upgrade to tell Meto what changed in plain language —
        it updates every section that needs it. You can still edit sections
        manually on your profile.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            void openProCheckout().catch(() => setLoading(false));
          }}
          className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)] disabled:opacity-60"
        >
          {loading ? "Loading…" : "Upgrade to Pro"}
        </button>
        <Link
          href="/dashboard/profile"
          className="rounded-lg border border-[var(--border-subtle)] px-5 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)]"
        >
          Edit profile manually
        </Link>
        <Link
          href="/pricing"
          className="rounded-lg border border-[var(--border-subtle)] px-5 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text)]"
        >
          Compare plans
        </Link>
      </div>
      {entitlements?.plan === "free" ? (
        <p className="mt-6 text-xs text-[var(--muted)]">
          Heuristic context score and gap list still work on your dashboard.
        </p>
      ) : null}
    </div>
  );
}
