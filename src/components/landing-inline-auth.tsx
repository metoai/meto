"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type LandingInlineAuthProps = {
  onAuthSuccess: () => void;
};

export function LandingInlineAuth({ onAuthSuccess }: LandingInlineAuthProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/")}`,
      },
    });
    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="border-t border-[var(--color-border)] bg-[var(--color-light)]/40 px-5 py-4 sm:px-6"
      role="region"
      aria-label="Create your account"
    >
      <p className="text-sm leading-relaxed text-[var(--color-text)]">
        Love it. To save your profile and use it in Claude or ChatGPT, create
        your free account.
      </p>
      <button
        type="button"
        disabled={loading}
        onClick={() => void handleGoogle()}
        className="mt-3 w-full rounded-xl bg-[#0F6E56] px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors duration-150 hover:bg-[#1D9E75] disabled:opacity-50"
      >
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>
      {error ? (
        <p className="mt-2 text-xs text-red-500" role="alert">
          {error}
        </p>
      ) : null}
      <p className="mt-2.5 text-center text-xs text-[var(--color-muted)]">
        Already have an account?{" "}
        <Link
          href="/auth/login?next=/"
          onClick={() => onAuthSuccess()}
          className="font-medium text-[#0F6E56] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
