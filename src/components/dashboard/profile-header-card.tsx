"use client";

import Link from "next/link";
import { useState } from "react";
import { getPublicProfileUrl, normalizeUsername, validateUsername } from "@/lib/username";
import type { UserProfile } from "@/lib/types";

type ProfileHeaderCardProps = {
  profile: UserProfile | null;
  onSaved: (profile: UserProfile) => void;
};

export function ProfileHeaderCard({ profile, onSaved }: ProfileHeaderCardProps) {
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const claimed = Boolean(profile?.username);

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

  async function handleCopy() {
    if (!profile?.username) return;
    await navigator.clipboard.writeText(getPublicProfileUrl(profile.username));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!claimed) {
    return (
      <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <p className="text-sm font-medium text-[var(--color-text)]">
          Claim your public URL
        </p>
        <form onSubmit={handleClaim} className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--color-muted)]">meto.ai/profile/</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            className="min-w-[120px] flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--color-primary)] px-4 py-1.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--color-accent)] disabled:opacity-50"
          >
            {saving ? "Claiming…" : "Claim"}
          </button>
        </form>
        <p className="mt-2 text-xs text-[var(--color-muted)]">
          Share this with anyone — their AI can read your profile.
        </p>
        {error ? (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-xl border border-[var(--color-border)] border-l-[3px] border-l-[var(--color-primary)] bg-[var(--color-card)] p-4">
      <p className="text-sm font-medium text-[var(--color-text)]">Your profile is live</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-sm text-[var(--color-accent)]">
          meto.ai/profile/{profile?.username}
        </span>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="rounded-lg border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted)] transition-colors duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-text)]"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        <Link
          href={`/profile/${profile?.username}`}
          className="text-xs text-[var(--color-accent)] transition-colors duration-150 hover:text-[var(--color-text)]"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
