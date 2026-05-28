"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AuthCard,
  AuthDivider,
  AuthField,
  AuthGoogleButton,
  AuthPrimaryButton,
} from "@/components/auth/auth-card";
import { MarketingLayout } from "@/components/marketing-layout";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const pendingSave =
      localStorage.getItem("meto_landing_pending_save") === "true";

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(pendingSave ? "/" : "/dashboard")}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (pendingSave) {
      router.push("/");
    } else {
      router.push("/dashboard");
    }
    router.refresh();
  }

  async function handleGoogleSignup() {
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

  return (
    <MarketingLayout authPage="signup">
      <AuthCard
        title="Create your profile"
        subtitle="Free to start. No credit card."
        footer={
          <>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="cursor-pointer text-[var(--primary)]"
              onClick={() => localStorage.setItem("meto_landing_pending_save", "true")}
            >
              Sign in
            </Link>
          </>
        }
      >
        <div className="flex flex-col gap-2.5">
          <AuthGoogleButton onClick={() => void handleGoogleSignup()} disabled={loading} />

          <AuthDivider />

          <form onSubmit={handleSignup} className="space-y-4">
          <AuthField
            id="fullName"
            label="Full name"
            value={fullName}
            onChange={setFullName}
            placeholder="Your name"
            autoComplete="name"
          />
          <AuthField
            id="email"
            label="Email"
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
            placeholder="At least 6 characters"
            autoComplete="new-password"
            minLength={6}
          />

          {error ? (
            <p className="text-sm text-red-500" role="alert">
              {error}
            </p>
          ) : null}

          <AuthPrimaryButton disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </AuthPrimaryButton>
        </form>
        </div>
      </AuthCard>
    </MarketingLayout>
  );
}
