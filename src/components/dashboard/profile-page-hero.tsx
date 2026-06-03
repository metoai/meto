"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";
import { DashboardCard } from "@/components/dashboard/ui/dashboard-card";
import type { ContextSection } from "@/lib/types";
import {
  getPublicContextApiUrl,
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
  const [copiedAi, setCopiedAi] = useState(false);
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
      onUsernameClaimed(data.profile?.username ?? normalized);
      setClaimValue("");
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Failed to claim.");
    } finally {
      setClaimSaving(false);
    }
  }

  return (
    <DashboardCard hover={false} className="mb-5 !p-4 md:!p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                claimed
                  ? "bg-[var(--primary)] shadow-[0_0_0_3px_var(--primary-light)]"
                  : "bg-[#D4D4D0]"
              }`}
              aria-hidden
            />
            <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
              {claimed ? "Profile live" : "Go live"}
            </p>
          </div>

          {claimed ? (
            <>
              <p className="mt-2 text-sm font-medium text-[var(--text)]">
                metoai.site/profile/{username}
              </p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {publicCount} public · {privateCount} private · {completion}%
                complete
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Claim a username to share your public profile.
            </p>
          )}
        </div>

        {claimed ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)]"
            >
              <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              {copied ? "Copied!" : "Copy link"}
            </button>
            <button
              type="button"
              onClick={() => void handleCopyForAi()}
              title="Plain-text URL that ChatGPT and Claude can read"
              className="rounded-lg border border-[var(--accent-border)] bg-[var(--primary-light)] px-3 py-2 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)]"
            >
              {copiedAi ? "Copied!" : "Copy for AI"}
            </button>
            <a
              href={`/profile/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[var(--primary-light)] px-3 py-2 text-xs font-medium text-[var(--primary)] transition-colors hover:bg-[var(--primary-light)]"
            >
              View profile →
            </a>
          </div>
        ) : null}
      </div>

      {!claimed ? (
        <form
          onSubmit={handleClaim}
          className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--border-subtle)] pt-3"
        >
          <span className="text-xs text-[var(--muted)]">metoai.site/profile/</span>
          <input
            value={claimValue}
            onChange={(e) => setClaimValue(e.target.value)}
            placeholder="yourname"
            className="min-w-[120px] flex-1 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-3 py-2 text-xs text-[var(--text)] outline-none focus:border-[var(--border-hover)]"
          />
          <button
            type="submit"
            disabled={claimSaving}
            className="rounded-lg bg-[var(--primary)] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-50"
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
    </DashboardCard>
  );
}
