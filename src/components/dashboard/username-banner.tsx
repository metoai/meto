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
    <div className="border-b border-brand-primary/30 bg-brand-primary/10 px-6 py-4 md:px-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-medium text-brand-text">
            Claim your profile URL → meto.ai/profile/[username]
          </p>
          <p className="mt-0.5 text-xs text-brand-text-muted">
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
            className="rounded-brand-md border border-brand-border bg-brand-background px-3 py-2 text-sm text-brand-text outline-none focus:border-brand-primary"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-brand-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:bg-brand-primary-hover disabled:opacity-50"
          >
            {saving ? "Saving…" : "Claim"}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="text-xs text-brand-text-subtle hover:text-brand-text"
          >
            Later
          </button>
        </form>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
