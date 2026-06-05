"use client";

import Link from "next/link";
import type { CompileFormat } from "@/lib/types";
import type { PlatformShareGuide } from "@/lib/platform-share";
import { WORKSPACE_COPY } from "@/lib/workspace-content";
import { AiPlatformIcon } from "@/components/ui/ai-platform-icon";
import { PLATFORM_OPTIONS } from "@/lib/context-share/config";

type PreviewPanelProps = {
  contextText: string;
  selectedFormat: CompileFormat;
  selectionCount: number;
  linkSelectionCount?: number;
  privateInSelectionCount?: number;
  wordCount: number;
  copiedContext: boolean;
  onCopyContext: () => void;
  shareUrl: string | null;
  platformShare: PlatformShareGuide | null;
  copiedLink: boolean;
  onCopyLink: () => void;
  username: string;
  showShareLink: boolean;
  workspaceLayout?: boolean;
};

export function PreviewPanel({
  contextText,
  selectedFormat,
  selectionCount,
  linkSelectionCount = 0,
  privateInSelectionCount = 0,
  copiedContext,
  onCopyContext,
  shareUrl,
  platformShare,
  copiedLink,
  onCopyLink,
  username,
  showShareLink,
  workspaceLayout,
}: PreviewPanelProps) {
  if (selectionCount === 0) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--elevated)] px-6 py-10 text-center">
        <p className="text-sm font-medium text-[var(--text)]">
          {workspaceLayout
            ? WORKSPACE_COPY.emptySelectionTitle
            : "Nothing selected yet"}
        </p>
        <p className="mt-1 max-w-xs text-xs leading-relaxed text-[var(--muted)]">
          {workspaceLayout
            ? WORKSPACE_COPY.emptySelectionBody
            : "Pick a scenario or toggle sections — your context block appears here live."}
        </p>
      </div>
    );
  }

  if (workspaceLayout) {
    const linkReady = Boolean(platformShare);
    const hasUsername = Boolean(username);

    return (
      <div className="flex h-full min-h-0 flex-col rounded-xl border border-[var(--border-subtle)] bg-[var(--card)] p-4">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-[var(--text)]">
              {WORKSPACE_COPY.linkLabel}
            </p>
            <p className="mt-0.5 text-[10px] text-[var(--muted)]">
              {WORKSPACE_COPY.linkSublabel}
            </p>
            {!hasUsername ? (
              <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5">
                <p className="text-[13px] text-[var(--text-secondary)]">
                  Claim a username to get your personal link
                </p>
                <Link
                  href="/settings"
                  className="mt-2.5 inline-block rounded-lg bg-[var(--primary)] px-4 py-[7px] text-[13px] font-medium text-white transition-colors duration-150 hover:bg-[var(--primary-hover)]"
                >
                  Claim username →
                </Link>
              </div>
            ) : (
              <div className="mt-2 rounded-xl border border-[var(--border)] bg-[var(--elevated)] px-3 py-2.5">
                {linkReady && platformShare ? (
                  <div className="space-y-2">
                    <p className="break-all font-mono-brand text-xs leading-relaxed text-[var(--text-secondary)]">
                      {platformShare.url}
                    </p>
                    {(selectedFormat === "chatgpt" ||
                      selectedFormat === "gemini") && (
                      <p className="whitespace-pre-wrap rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-2.5 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                        {platformShare.prompt}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-[var(--muted)]">
                    {WORKSPACE_COPY.noPublicInSelection}
                  </p>
                )}
              </div>
            )}
          </div>

          {hasUsername && linkReady ? (
            <p className="text-[11px] text-[var(--muted)]">
              {linkSelectionCount} public section
              {linkSelectionCount === 1 ? "" : "s"} in link
              {privateInSelectionCount > 0
                ? ` · ${privateInSelectionCount} private (text only)`
                : ""}
            </p>
          ) : null}

          <button
            type="button"
            onClick={() => void onCopyLink()}
            disabled={!linkReady}
            className={`w-full rounded-xl border-none px-3 py-3 text-sm font-medium text-white transition-[background] duration-150 ease-in-out disabled:cursor-not-allowed disabled:opacity-40 ${
              copiedLink ? "bg-[#1D9E75]" : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
            }`}
          >
            {copiedLink
              ? WORKSPACE_COPY.copiedLink
              : selectedFormat === "chatgpt" || selectedFormat === "gemini"
                ? "Copy prompt"
                : WORKSPACE_COPY.copyLink}
          </button>

          <div className="flex items-center justify-center gap-3 pt-0.5">
            {PLATFORM_OPTIONS.filter((p) => p.id !== "universal").map((p) => (
              <AiPlatformIcon key={p.id} format={p.id} size={18} />
            ))}
            <span className="text-[10px] text-[var(--muted)]">works in any AI</span>
          </div>

          {linkReady && platformShare ? (
            <p className="text-center text-[11px] leading-relaxed text-[var(--muted)]">
              {platformShare.hint}
            </p>
          ) : null}
        </div>

        <div className="mt-5 min-h-0 flex-1 border-t border-[var(--border-subtle)] pt-4">
          <p className="text-xs font-medium text-[var(--text)]">
            {WORKSPACE_COPY.previewLabel}
          </p>
          <p className="mt-0.5 text-[10px] text-[var(--muted)]">
            {WORKSPACE_COPY.previewSublabel}
          </p>
          <pre className="scrollbar-hidden mt-2 max-h-[200px] min-h-[120px] overflow-y-auto whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--elevated)] p-3.5 font-mono-brand text-xs leading-[1.7] text-[var(--text-secondary)]">
            {contextText}
          </pre>
        </div>

        <button
          type="button"
          onClick={() => void onCopyContext()}
          disabled={!contextText}
          className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
            copiedContext
              ? "border-[var(--accent-border)] bg-[var(--primary-light)] text-[var(--primary)]"
              : "border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
          }`}
        >
          <AiPlatformIcon format={selectedFormat} size={16} />
          {copiedContext
            ? WORKSPACE_COPY.copiedContext
            : WORKSPACE_COPY.copyTextInstead}
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <pre className="scrollbar-hidden max-h-[280px] min-h-[200px] overflow-y-auto whitespace-pre-wrap rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3.5 font-mono-brand text-xs leading-[1.7] text-[var(--text-secondary)]">
          {contextText}
        </pre>
      </div>

      <div className="mt-3 space-y-2">
        <button
          type="button"
          onClick={() => void onCopyContext()}
          disabled={!contextText}
          className={`flex w-full items-center justify-center gap-2 rounded-[10px] border-none px-3 py-3 text-sm font-medium text-white transition-[background] duration-150 ease-in-out disabled:opacity-40 ${
            copiedContext
              ? "bg-[var(--primary-hover)]"
              : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
          }`}
        >
          <AiPlatformIcon format={selectedFormat} size={18} />
          {copiedContext ? "Copied ✓" : "Copy context"}
        </button>

        {showShareLink && shareUrl ? (
          <button
            type="button"
            onClick={() => void onCopyLink()}
            className={`w-full rounded-[10px] border px-3 py-2.5 text-sm font-medium transition-[border-color,background,color] duration-150 ease-in-out ${
              copiedLink
                ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] hover:border-[var(--border-hover)] hover:text-[var(--text)]"
            }`}
          >
            {copiedLink ? "Link copied ✓" : "Copy link instead"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
