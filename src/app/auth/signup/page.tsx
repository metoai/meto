"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MetoLogo } from "@/components/meto-logo";
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

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <MetoLogo href="/" className="text-3xl" />
          <p className="mt-3 text-sm text-brand-text-muted">
            Create your AI identity in minutes.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-sm text-brand-text-muted"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              autoComplete="name"
              className="w-full rounded-brand-md border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-primary"
              placeholder="Your name"
            />
          </div>

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
              minLength={6}
              autoComplete="new-password"
              className="w-full rounded-brand-md border border-brand-border bg-brand-card px-3 py-2.5 text-sm text-brand-text outline-none transition-colors focus:border-brand-primary"
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-brand-md bg-brand-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-primary-hover disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-brand-text-muted">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-brand-primary hover:text-brand-primary-hover"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
