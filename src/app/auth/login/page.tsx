"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MetoLogo } from "@/components/meto-logo";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [callbackError, setCallbackError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get("error");
    if (authError) {
      setCallbackError(authError);
    }
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  const displayError = error ?? callbackError;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <MetoLogo href="/" className="text-3xl" />
          <p className="mt-3 text-sm text-brand-text-muted">
            Welcome back. Sign in to your AI identity.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm text-brand-text-muted"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full rounded-brand-md border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-primary"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm text-brand-text-muted"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full rounded-brand-md border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-primary"
              placeholder="••••••••"
            />
          </div>

          {displayError && (
            <p className="text-sm text-red-400" role="alert">
              {displayError}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-brand-md bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-brand-border" />
          <span className="text-xs text-brand-text-subtle">or</span>
          <div className="h-px flex-1 bg-brand-border" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full rounded-brand-md border border-brand-border bg-brand-card px-4 py-2.5 text-sm font-medium text-brand-text transition-colors hover:border-brand-primary disabled:opacity-50"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-brand-text-muted">
          No account?{" "}
          <Link
            href="/auth/signup"
            className="text-brand-primary hover:text-brand-primary-hover"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
