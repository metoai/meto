"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AuthDivider,
  AuthField,
  AuthPage,
  AuthPrimaryButton,
  AuthSocialRow,
} from "@/components/auth/auth-card";
import { openProCheckout } from "@/lib/billing-client";
import {
  clearPricingPlanChoice,
  parsePricingPlanChoice,
  setPricingPlanChoice,
} from "@/lib/pricing-intent";
import { createClient } from "@/lib/supabase/client";
import { fetchPostAuthRedirect } from "@/lib/post-auth-redirect-client";

export function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const planChoice = parsePricingPlanChoice(searchParams.get("plan"));

  useEffect(() => {
    if (planChoice) setPricingPlanChoice(planChoice);
  }, [planChoice]);

  async function redirectAfterSignup() {
    const pendingSave =
      localStorage.getItem("meto_landing_pending_save") === "true";

    if (planChoice === "pro") {
      try {
        await openProCheckout();
        return;
      } catch (checkoutError) {
        setError(
          checkoutError instanceof Error
            ? checkoutError.message
            : "Could not start checkout."
        );
        setLoading(false);
        return;
      }
    }

    if (pendingSave) {
      router.push("/");
    } else {
      const path = await fetchPostAuthRedirect("/dashboard");
      router.push(path);
    }
    clearPricingPlanChoice();
    router.refresh();
  }

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
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          planChoice === "pro"
            ? "/dashboard"
            : pendingSave
              ? "/"
              : "/dashboard"
        )}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    await redirectAfterSignup();
  }

  async function handleGoogleSignup() {
    setLoading(true);
    setError(null);

    if (planChoice) setPricingPlanChoice(planChoice);

    const pendingSave =
      localStorage.getItem("meto_landing_pending_save") === "true";
    const next =
      planChoice === "pro"
        ? "/dashboard"
        : pendingSave
          ? "/"
          : "/dashboard";

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
    <AuthPage
      title="Create an account"
      subtitle="Access your profile anytime — and keep every AI conversation in sync."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href={
              planChoice
                ? `/auth/login?plan=${planChoice}`
                : "/auth/login"
            }
            className="font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <AuthField
          id="fullName"
          label="Your name"
          value={fullName}
          onChange={setFullName}
          placeholder="Your name"
          autoComplete="name"
        />
        <AuthField
          id="email"
          label="Your email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="you@company.com"
          autoComplete="email"
        />
        <AuthField
          id="password"
          label="Create password"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="6+ characters"
          autoComplete="new-password"
          minLength={6}
        />

        {error ? (
          <p className="text-[12px] leading-snug text-red-500" role="alert">
            {error}
          </p>
        ) : null}

        <AuthPrimaryButton disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </AuthPrimaryButton>
      </form>

      <AuthDivider />

      <AuthSocialRow onGoogle={() => void handleGoogleSignup()} disabled={loading} />
    </AuthPage>
  );
}
