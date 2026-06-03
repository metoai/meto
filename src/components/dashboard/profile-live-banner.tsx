"use client";

import { useState } from "react";
import {
  getPublicContextApiUrl,
  getPublicProfileUrl,
  normalizeUsername,
  validateUsername,
} from "@/lib/username";

type ProfileLiveBannerProps = {
  username: string;
  onUsernameClaimed: (username: string) => void;
};

export function ProfileLiveBanner({
  username,
  onUsernameClaimed,
}: ProfileLiveBannerProps) {
  const [copied, setCopied] = useState(false);
  const [copiedAi, setCopiedAi] = useState(false);
  const [claimOpen, setClaimOpen] = useState(false);
  const [claimValue, setClaimValue] = useState("");
  const [claimSaving, setClaimSaving] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  const claimed = Boolean(username);

  async function handleCopy() {
    if (!username) return;
    await navigator.clipboard.writeText(getPublicProfileUrl(username));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCopyForAi() {
    if (!username) return;
    await navigator.clipboard.writeText(getPublicContextApiUrl(username));
    setCopiedAi(true);
    setTimeout(() => setCopiedAi(false), 2000);
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
      onUsernameClaimed(data.profile.username ?? normalized);
      setClaimOpen(false);
      setClaimValue("");
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Failed to claim.");
    } finally {
      setClaimSaving(false);
    }
  }

  return (
    <div className="mb-4 rounded-xl border border-[var(--border)] bg-[var(--card)] px-[18px] py-[14px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-[7px] w-[7px] shrink-0 rounded-full bg-[var(--primary)]"
              aria-hidden
            />
            <span className="text-[13px] font-medium text-[var(--primary)]">
              Profile live
            </span>
          </div>
          {claimed ? (
            <p className="mt-1 text-xs text-[var(--muted)]">
              metoai.site/profile/{username}
            </p>
          ) : (
            <p className="mt-1 text-xs text-[var(--muted)]">
              Claim your URL to go live{" "}
              <button
                type="button"
                onClick={() => setClaimOpen((open) => !open)}
                className="font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
              >
                Claim →
              </button>
            </p>
          )}
        </div>

        {claimed ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="cursor-pointer text-xs text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={() => void handleCopyForAi()}
              className="cursor-pointer text-xs font-medium text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
            >
              {copiedAi ? "Copied ✓" : "Copy for AI"}
            </button>
            <a
              href={`/profile/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[7px] border border-[var(--accent-border)] bg-[var(--primary-light)] px-3 py-1 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)]"
            >
              View →
            </a>
          </div>
        ) : null}
      </div>

      {claimOpen && !claimed ? (
        <form
          onSubmit={handleClaim}
          className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border)] pt-3"
        >
          <span className="text-xs text-[var(--muted)]">metoai.site/profile/</span>
          <input
            value={claimValue}
            onChange={(e) => setClaimValue(e.target.value)}
            placeholder="yourname"
            className="min-w-[120px] flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-sm text-[var(--text)] outline-none focus:border-[var(--border-hover)]"
          />
          <button
            type="submit"
            disabled={claimSaving}
            className="rounded-[7px] bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50"
          >
            {claimSaving ? "Claiming…" : "Claim"}
          </button>
          {claimError ? (
            <p className="w-full text-xs text-[#F87171]" role="alert">
              {claimError}
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}
