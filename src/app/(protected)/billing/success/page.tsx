"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MetoMarkBadge } from "@/components/meto-mark";

export default function BillingSuccessPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/billing/sync", { method: "POST" })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error ?? "Could not activate Pro.");
        }
        if (cancelled) return;
        router.replace("/dashboard");
        router.refresh();
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Could not activate Pro.");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--card)] px-4 text-center">
      <MetoMarkBadge size="lg" />
      <p className="mt-4 text-sm font-medium text-[var(--text)]">
        {error ? "Something went wrong" : "Activating Meto Pro…"}
      </p>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        {error ?? "This only takes a moment."}
      </p>
      {error ? (
        <button
          type="button"
          onClick={() => router.replace("/dashboard")}
          className="mt-6 rounded-lg bg-[var(--primary)] px-4 py-2.5 text-sm font-medium text-white hover:bg-[var(--primary-hover)]"
        >
          Continue to dashboard
        </button>
      ) : null}
    </div>
  );
}
