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
      <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
        <p className="text-sm font-medium text-[var(--text)]">
          Claim your public URL
        </p>
        <form onSubmit={handleClaim} className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-sm text-[var(--text-secondary)]">meto.ai/profile/</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="yourname"
            className="min-w-[120px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--border-hover)]"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[var(--primary)] px-4 py-1.5 text-sm font-medium text-white transition-[background] duration-150 ease-in-out hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {saving ? "Claiming…" : "Claim"}
          </button>
        </form>
        <p className="mt-2 text-xs text-[var(--muted)]">
          Share this with anyone — their AI can read your profile.
        </p>
        {error ? (
          <p className="mt-2 text-xs text-[#F87171]" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mb-4 rounded-[10px] border border-[#C0E0D8] bg-[#F0FAF7] px-4 py-3">
      <p className="text-[13px] font-medium text-[var(--primary)]">Your profile is live</p>
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <span className="text-sm text-[var(--text-secondary)]">
          meto.ai/profile/{profile?.username}
        </span>
        <button
          type="button"
          onClick={() => void handleCopy()}
          className="text-xs text-[var(--primary)] transition-colors duration-150 hover:text-[var(--primary-hover)]"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        <Link
          href={`/profile/${profile?.username}`}
          className="text-xs text-[var(--primary)] transition-colors duration-150 hover:text-[var(--primary-hover)]"
        >
          View →
        </Link>
      </div>
    </div>
  );
}
