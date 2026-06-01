"use client";

import { Link2 } from "lucide-react";
import { useState } from "react";
import { DashboardCard } from "@/components/dashboard/ui/dashboard-card";
import { buildProfileSummary } from "@/lib/profile-summary";
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

  const summary = buildProfileSummary(sections);
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
    <DashboardCard hover={false} className="mb-5 overflow-hidden !p-0">
      {/* Row 1 — summary */}
      <div className="px-4 py-4 md:px-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9B9B93]">
          How Meto sees you
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[#1A1A18]">{summary}</p>
      </div>

      {/* Row 2 — live status + actions */}
      <div className="border-t border-black/[0.06] bg-[#FAFAF8] px-4 py-4 md:px-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-[#0F6E56] shadow-[0_0_0_3px_#E8F5F0]"
                aria-hidden
              />
              <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#9B9B93]">
                {claimed ? "Profile live" : "Go live"}
              </p>
            </div>

            {claimed ? (
              <>
                <p className="mt-1.5 text-sm font-medium text-[#1A1A18]">
                  meto.ai/profile/{username}
                </p>
                <p className="mt-0.5 text-xs text-[#9B9B93]">
                  {publicCount} public · {privateCount} private · {completion}%
                  complete
                </p>
              </>
            ) : (
              <p className="mt-1.5 text-sm text-[#6B6B63]">
                Claim a username to share your public profile.
              </p>
            )}
          </div>

          {claimed ? (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => void handleCopy()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs text-[#6B6B63] transition-colors hover:border-[#C0C0B8] hover:text-[#1A1A18]"
              >
                <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                {copied ? "Copied!" : "Copy link"}
              </button>
              <a
                href={`/profile/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-[#E8F5F0] px-3 py-2 text-xs font-medium text-[#0F6E56] transition-colors hover:bg-[#F0FAF7]"
              >
                View profile →
              </a>
            </div>
          ) : null}
        </div>

        {!claimed ? (
          <form
            onSubmit={handleClaim}
            className="mt-3 flex flex-wrap items-center gap-2"
          >
            <span className="text-xs text-[#9B9B93]">meto.ai/profile/</span>
            <input
              value={claimValue}
              onChange={(e) => setClaimValue(e.target.value)}
              placeholder="yourname"
              className="min-w-[120px] flex-1 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs text-[#1A1A18] outline-none focus:border-[#C0C0B8]"
            />
            <button
              type="submit"
              disabled={claimSaving}
              className="rounded-lg bg-[#0F6E56] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#1D9E75] disabled:opacity-50"
            >
              {claimSaving ? "Claiming…" : "Claim"}
            </button>
            {claimError ? (
              <p className="w-full text-xs text-[#F87171]" role="alert">
                {claimError}
              </p>
            ) : null}
          </form>
        ) : (
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#F7F7F5]">
            <div
              className="h-full rounded-full bg-[#0F6E56] transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
        )}
      </div>
    </DashboardCard>
  );
}
