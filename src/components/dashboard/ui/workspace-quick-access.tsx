"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Link2 } from "lucide-react";
import { DashboardCard, SectionLabel } from "@/components/dashboard/ui/dashboard-card";
import { AiPlatformIcon } from "@/components/ui/ai-platform-icon";
import { PLATFORM_OPTIONS } from "@/lib/context-share/config";import {
  getPublicProfileUrl,
  normalizeUsername,
  validateUsername,
} from "@/lib/username";
import {
  formatLastCopied,
  getCopyStats,
  recordCopy,
} from "@/lib/copy-stats";
import type { CompileFormat } from "@/lib/types";

type WorkspaceQuickAccessProps = {
  contextPreview: string;
  onCopy: (format: CompileFormat) => Promise<void>;
  username: string | null;
  onUsernameClaimed: (username: string) => void;
  compact?: boolean;
};

const COPY_FORMATS = PLATFORM_OPTIONS.filter((p) => p.id !== "universal");
export function WorkspaceQuickAccess({
  contextPreview,
  onCopy,
  username,
  onUsernameClaimed,
  compact = false,
}: WorkspaceQuickAccessProps) {
  const [stats, setStats] = useState({ weekCount: 0, lastCopiedAt: null as string | null });
  const [copiedFormat, setCopiedFormat] = useState<CompileFormat | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [claimValue, setClaimValue] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    setStats(getCopyStats());
  }, []);

  async function handleCopy(format: CompileFormat) {
    await onCopy(format);
    const next = recordCopy();
    setStats(next);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  }

  async function handleCopyProfileLink() {
    if (!username) return;
    await navigator.clipboard.writeText(getPublicProfileUrl(username));
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  async function handleClaim(e: React.FormEvent) {
    e.preventDefault();
    const normalized = normalizeUsername(claimValue);
    const validationError = validateUsername(normalized);
    if (validationError) {
      setClaimError(validationError);
      return;
    }

    setClaiming(true);
    setClaimError(null);

    try {
      const res = await fetch("/api/profile/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: normalized }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to claim username.");
      const nextUsername = data.profile?.username ?? normalized;
      onUsernameClaimed(nextUsername);
      setClaimValue("");
    } catch (err) {
      setClaimError(
        err instanceof Error ? err.message : "Failed to claim username."
      );
    } finally {
      setClaiming(false);
    }
  }

  const preview = contextPreview.trim().split("\n").slice(0, 3).join("\n");
  const hasUsername = Boolean(username);

  return (
    <DashboardCard className={compact ? "p-4" : ""}>
      <div className="flex items-start justify-between gap-4">
        <SectionLabel>Workspace</SectionLabel>
        <Link
          href="/dashboard/workspace"
          className="text-xs text-[#0F6E56] transition-colors duration-150 hover:text-[#1D9E75]"
        >
          Open full workspace →
        </Link>
      </div>

      {!compact ? (
        <pre className="mt-3 max-h-[72px] overflow-hidden whitespace-pre-wrap font-mono-brand text-xs leading-relaxed text-[#6B6B63]">
          {preview || "Add profile sections to generate your AI context…"}
        </pre>
      ) : null}

      <div
        className={`rounded-xl border border-black/[0.08] bg-[#FAFAF8] ${
          compact ? "mt-2.5 p-2.5" : "mt-4 p-3"
        }`}
      >
        <p className="text-xs font-medium text-[#1A1A18]">
          {compact
            ? "Share your public profile link"
            : "Public link — only public profile sections"}
        </p>
        {hasUsername ? (
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => void handleCopyProfileLink()}
              className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs text-[#6B6B63] transition-all duration-150 hover:border-[#C0C0B8] hover:text-[#1A1A18]"
            >
              <Link2 className="h-3.5 w-3.5" strokeWidth={1.75} />
              {copiedLink ? "Copied profile link!" : "Copy profile link"}
            </button>
            <span className="text-xs text-[#9B9B93]">metoai.site/profile/{username}</span>
          </div>
        ) : (
          <form
            onSubmit={handleClaim}
            className="mt-2 flex flex-wrap items-center gap-2"
          >
            <span className="text-xs text-[#9B9B93]">metoai.site/profile/</span>
            <input
              value={claimValue}
              onChange={(e) => setClaimValue(e.target.value)}
              placeholder="yourname"
              className="min-w-[140px] flex-1 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs text-[#1A1A18] outline-none transition-colors focus:border-[#C0C0B8]"
            />
            <button
              type="submit"
              disabled={claiming}
              className="rounded-lg bg-[#0F6E56] px-3 py-2 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#1D9E75] disabled:opacity-50"
            >
              {claiming ? "Claiming..." : "Claim username"}
            </button>
            {claimError ? (
              <p className="w-full text-xs text-[#F87171]" role="alert">
                {claimError}
              </p>
            ) : null}
          </form>
        )}
      </div>

      {!compact ? (
        <>
          <p className="mt-3 text-xs text-[#9B9B93]">
            Or copy formatted text for:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {COPY_FORMATS.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => void handleCopy(id)}
                disabled={!contextPreview.trim()}
                className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs text-[#6B6B63] transition-all duration-150 hover:border-[#C0C0B8] hover:text-[#1A1A18] disabled:opacity-40"
              >
                <AiPlatformIcon format={id} size={14} />
                {copiedFormat === id ? "Copied!" : label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => void handleCopy("universal")}
              disabled={!contextPreview.trim()}
              className="inline-flex items-center gap-2 rounded-lg border border-black/[0.08] bg-white px-3 py-2 text-xs text-[#6B6B63] transition-all duration-150 hover:border-[#C0C0B8] hover:text-[#1A1A18] disabled:opacity-40"
            >
              <AiPlatformIcon format="universal" size={14} />
              {copiedFormat === "universal" ? "Copied!" : "Any AI"}
            </button>
          </div>
        </>
      ) : null}

      {!compact ? (
        <p className="mt-3 text-xs text-[#9B9B93]">
          Copied {stats.weekCount} time{stats.weekCount === 1 ? "" : "s"} this week
          {stats.lastCopiedAt
            ? ` — last on ${formatLastCopied(stats.lastCopiedAt)}`
            : ""}
        </p>
      ) : null}
    </DashboardCard>
  );
}
