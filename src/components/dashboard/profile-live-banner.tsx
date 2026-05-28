"use client";

import { useState } from "react";
import {
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
    <div className="mb-4 rounded-xl border border-[#E8E8E4] bg-white px-[18px] py-[14px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="h-[7px] w-[7px] shrink-0 rounded-full bg-[#0F6E56]"
              aria-hidden
            />
            <span className="text-[13px] font-medium text-[#0F6E56]">
              Profile live
            </span>
          </div>
          {claimed ? (
            <p className="mt-1 text-xs text-[#9B9B93]">
              meto.ai/profile/{username}
            </p>
          ) : (
            <p className="mt-1 text-xs text-[#9B9B93]">
              Claim your URL to go live{" "}
              <button
                type="button"
                onClick={() => setClaimOpen((open) => !open)}
                className="font-medium text-[#0F6E56] transition-colors hover:text-[#1D9E75]"
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
              className="cursor-pointer text-xs text-[#6B6B63] transition-colors hover:text-[#1A1A18]"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
            <a
              href={`/profile/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-[7px] border border-[#C0E0D8] bg-[#E8F5F0] px-3 py-1 text-xs font-medium text-[#0F6E56] transition-colors hover:bg-[#F0FAF7]"
            >
              View →
            </a>
          </div>
        ) : null}
      </div>

      {claimOpen && !claimed ? (
        <form
          onSubmit={handleClaim}
          className="mt-3 flex flex-wrap items-center gap-2 border-t border-[#E8E8E4] pt-3"
        >
          <span className="text-xs text-[#9B9B93]">meto.ai/profile/</span>
          <input
            value={claimValue}
            onChange={(e) => setClaimValue(e.target.value)}
            placeholder="yourname"
            className="min-w-[120px] flex-1 rounded-lg border border-[#E8E8E4] bg-white px-3 py-1.5 text-sm text-[#1A1A18] outline-none focus:border-[#C0C0B8]"
          />
          <button
            type="submit"
            disabled={claimSaving}
            className="rounded-[7px] bg-[#0F6E56] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1D9E75] disabled:opacity-50"
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
