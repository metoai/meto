"use client";

import { useState } from "react";
import { buildProfileShareClipboard } from "@/lib/profile-share";
import type { ContextSection } from "@/lib/types";
import {
  getPublicProfileUrl,
  normalizeUsername,
  validateUsername,
} from "@/lib/username";

type ProfilePageHeroProps = {
  sections: ContextSection[];
  username: string | null;
  completion: number;
  onUsernameClaimed: (username: string) => void;
};

export function ProfilePageHero({
  sections,
  username,
  completion,
  onUsernameClaimed,
}: ProfilePageHeroProps) {
  const [copied, setCopied] = useState(false);
  const [claimValue, setClaimValue] = useState("");
  const [claimSaving, setClaimSaving] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const filled = sections.filter((s) => s.content?.trim()).length;
  const publicCount = sections.filter(
    (s) => s.is_public && s.content?.trim()
  ).length;
  const privateCount = filled - publicCount;
  const claimed = Boolean(username);

  async function handleCopy() {
    if (!username) return;
    await navigator.clipboard.writeText(
      buildProfileShareClipboard(getPublicProfileUrl(username))
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeUsername(claimValue);
    const validationError = validateUsername(normalized);
    if (validationError) {
      setClaimError(validationError);
      return;
    }

    setClaimSaving(true);
    setClaimError(null);

    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to claim username.");
      onUsernameClaimed(data.profile?.username ?? normalized);
      setClaimValue("");
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Failed to claim.");
    } finally {
      setClaimSaving(false);
    }
  }

  return (
    <div className="landing-panel mb-5 px-4 py-3.5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                claimed ? "bg-[var(--primary)]" : "bg-[var(--border)]"
              }`}
              aria-hidden
            />
            <p className="landing-panel-label">
              {claimed ? "Profile live" : "Go live"}
            </p>
          </div>

          {claimed ? (
            <>
              <p className="mt-1.5 text-[13px] font-medium text-[var(--text)]">
                metoai.site/profile/{username}
              </p>
              <p className="mt-1 text-[11px] text-[var(--muted)]">
                {publicCount} public · {privateCount} private · {completion}%
                complete
              </p>
            </>
          ) : (
            <p className="mt-1.5 text-[13px] text-[var(--text-secondary)]">
              Claim a username to share your public profile.
            </p>
          )}
        </div>

        {claimed ? (
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="rounded-lg bg-[var(--primary)] px-3.5 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[var(--primary-hover)]"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
            <a
              href={`/profile/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              View →
            </a>
          </div>
        ) : null}
      </div>

      {!claimed ? (
        <form
          onSubmit={handleClaim}
          className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-3"
        >
          <span className="text-[11px] text-[var(--muted)]">metoai.site/profile/</span>
          <input
            value={claimValue}
            onChange={(e) => setClaimValue(e.target.value)}
            placeholder="yourname"
            className="min-w-[120px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-[13px] text-[var(--text)] outline-none focus:border-[var(--border-hover)]"
          />
          <button
            type="submit"
            disabled={claimSaving}
            className="rounded-lg bg-[var(--primary)] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {claimSaving ? "Claiming…" : "Claim"}
          </button>
          {claimError ? (
            <p className="w-full text-[11px] text-[#F87171]" role="alert">
              {claimError}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
