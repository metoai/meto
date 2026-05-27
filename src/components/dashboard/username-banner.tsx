"use client";

import { useState } from "react";
import { normalizeUsername, validateUsername } from "@/lib/username";
import type { UserProfile } from "@/lib/types";

type UsernameBannerProps = {
  profile: UserProfile | null;
  onSaved: (profile: UserProfile) => void;
};

export function UsernameBanner({ profile, onSaved }: UsernameBannerProps) {
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (profile?.username || dismissed) return null;

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeUsername(username);
    const validationError = validateUsername(normalized);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to claim username.");
      onSaved(data.profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border-b border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 px-4 py-3 md:px-5">
      <div className="mx-auto flex max-w-none flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">
            Claim your profile URL → meto.ai/profile/[username]
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-muted)]">
            Set a username so others can find your public profile.
          </p>
        </div>
        <form
          onSubmit={handleClaim}
          className="flex flex-col gap-2 sm:flex-row sm:items-center"
        >
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent)] disabled:opacity-50"
          >
            {saving ? "Saving…" : "Claim"}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
          >
            Later
          </button>
        </form>
      </div>
      {error && (
        <p className="mt-1 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
