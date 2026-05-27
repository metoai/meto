"use client";

import { FormEvent, useState } from "react";
import {
  AuthDivider,
  AuthField,
  AuthGoogleButton,
  AuthPrimaryButton,
} from "@/components/auth/auth-card";
import { createClient } from "@/lib/supabase/client";

export type AuthModalMode = "gate" | "save";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  mode: AuthModalMode;
  saving: boolean;
  onAuthSuccess: () => void;
  onSaveProfile: () => Promise<void>;
};

type AuthTab = "signup" | "login";

export function ProfileAuthModal({
  open,
  onClose,
  mode,
  saving,
  onAuthSuccess,
  onSaveProfile,
}: AuthModalProps) {
  const supabase = createClient();
  const [tab, setTab] = useState<AuthTab>("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const isGate = mode === "gate";

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    if (!isGate) {
      localStorage.setItem("meto_landing_pending_save", "true");
    }

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

  async function handleSignup(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!isGate) {
      localStorage.setItem("meto_landing_pending_save", "true");
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/")}`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (isGate) {
      onAuthSuccess();
      onClose();
      setLoading(false);
      return;
    }

    try {
      await onSaveProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
      setLoading(false);
    }
  }

  async function handleLogin(e: FormEvent) {
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

    if (isGate) {
      onAuthSuccess();
      onClose();
      setLoading(false);
      return;
    }

    try {
      await onSaveProfile();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
      setLoading(false);
    }
  }

  const busy = loading || saving;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-auth-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />

      <div
        className="relative z-10 w-full max-w-md rounded-[1.75rem] border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8"
        style={{ boxShadow: "var(--color-card-shadow)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="mb-6 text-center">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-accent)]">
            {isGate ? "Get started" : "Profile ready"}
          </p>
          <h2
            id="profile-auth-title"
            className="mt-2 text-xl font-semibold text-[var(--color-text)]"
          >
            {isGate ? "Sign in to chat with Meto" : "Save your profile"}
          </h2>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            {isGate
              ? "Create a free account or log in to build your AI identity."
              : "Your AI identity is ready — save it to your dashboard."}
          </p>
        </div>

        {isGate ? (
          <>
            <div className="mb-5 flex rounded-full border border-[var(--color-border)] p-1">
              <button
                type="button"
                onClick={() => setTab("signup")}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                  tab === "signup"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                  tab === "login"
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                Log in
              </button>
            </div>

            <AuthGoogleButton onClick={() => void handleGoogle()} disabled={busy} />
            <AuthDivider />

            {tab === "signup" ? (
              <form onSubmit={(e) => void handleSignup(e)} className="space-y-4">
                <AuthField
                  id="modal-fullName"
                  label="Full name"
                  value={fullName}
                  onChange={setFullName}
                  placeholder="Your name"
                  autoComplete="name"
                />
                <AuthField
                  id="modal-signup-email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <AuthField
                  id="modal-signup-password"
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
                <AuthPrimaryButton disabled={busy}>
                  {busy ? "Creating account…" : "Create account"}
                </AuthPrimaryButton>
              </form>
            ) : (
              <form onSubmit={(e) => void handleLogin(e)} className="space-y-4">
                <AuthField
                  id="modal-login-email"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder="you@example.com"
                  autoComplete="email"
                />
                <AuthField
                  id="modal-login-password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                {error ? (
                  <p className="text-sm text-red-500" role="alert">
                    {error}
                  </p>
                ) : null}
                <AuthPrimaryButton disabled={busy}>
                  {busy ? "Signing in…" : "Log in"}
                </AuthPrimaryButton>
              </form>
            )}
          </>
        ) : (
          <AuthPrimaryButton
            type="button"
            disabled={busy}
            onClick={() => void onSaveProfile()}
          >
            {saving ? "Saving…" : "Save & go to dashboard"}
          </AuthPrimaryButton>
        )}
      </div>
    </div>
  );
}
