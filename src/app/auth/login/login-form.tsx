"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AuthDivider,
  AuthField,
  AuthPage,
  AuthPrimaryButton,
  AuthSocialRow,
} from "@/components/auth/auth-card";
import { createClient } from "@/lib/supabase/client";
import { fetchPostAuthRedirect } from "@/lib/post-auth-redirect-client";

export function LoginForm() {
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

    const path = await fetchPostAuthRedirect("/dashboard");
    router.push(path);
    router.refresh();
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setError(null);

    const pendingSave =
      localStorage.getItem("meto_landing_pending_save") === "true";
    const next = pendingSave ? "/" : "/dashboard";

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });

    if (oauthError) {
      setError(oauthError.message);
      setLoading(false);
    }
  }

  const displayError = error ?? callbackError;

  return (
    <AuthPage
      title="Welcome back"
      subtitle="Sign in to your profile — pick up where you left off with every AI."
      footer={
        <>
          No account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
          >
            Create account
          </Link>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <AuthField
          id="email"
          label="Your email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@example.com"
          autoComplete="email"
        />
        <AuthField
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="••••••••"
          autoComplete="current-password"
        />

        {displayError ? (
          <p className="text-[12px] leading-snug text-red-500" role="alert">
            {displayError}
          </p>
        ) : null}

        <AuthPrimaryButton disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </AuthPrimaryButton>
      </form>

      <AuthDivider />

      <AuthSocialRow onGoogle={() => void handleGoogleLogin()} disabled={loading} />
    </AuthPage>
  );
}
