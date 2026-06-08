"use client";

import Link from "next/link";
import type { CompileFormat } from "@/lib/types";
import type { PlatformShareGuide } from "@/lib/platform-share";
import { WORKSPACE_COPY } from "@/lib/workspace-content";
import { AiPlatformIcon } from "@/components/ui/ai-platform-icon";
import {
  platformLabel,
  platformUsesSharePrompt,
} from "@/lib/context-share/config";

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
      <div className="flex min-h-[180px] flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-8 text-center">
        <p className="text-sm text-[var(--text-secondary)]">
          {workspaceLayout
            ? WORKSPACE_COPY.emptySelectionTitle
            : "Nothing selected yet"}
        </p>
      </div>
    );
  }

  if (workspaceLayout) {
    const linkReady = Boolean(platformShare);
    const hasUsername = Boolean(username);
    const usesPrompt = platformUsesSharePrompt(selectedFormat);
    const platformName = platformLabel(selectedFormat);

    return (
      <div className="landing-panel flex h-full min-h-0 flex-col p-3 md:p-4">
        <div className="shrink-0 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
              {usesPrompt ? "Copy prompt" : "Copy link"}
            </p>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--surface)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
              <AiPlatformIcon format={selectedFormat} size={12} />
              {platformName}
            </span>
          </div>

          {!hasUsername ? (
            <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-3">
              <p className="text-[13px] text-[var(--text-secondary)]">
                Claim a username to get your link
              </p>
              <Link
                href="/settings"
                className="mt-2 inline-block text-[13px] font-medium text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                Claim username →
              </Link>
            </div>
          ) : linkReady && platformShare ? (
            <div key={selectedFormat} className="space-y-2">
              <pre className="scrollbar-hidden max-h-36 overflow-y-auto whitespace-pre-wrap rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5 font-mono-brand text-[11px] leading-relaxed text-[var(--text-secondary)]">
                {platformShare.clipboardText}
              </pre>
              {usesPrompt ? (
                <p className="break-all font-mono-brand text-[10px] text-[var(--muted)]">
                  {platformShare.url}
                </p>
              ) : null}
            </div>
          ) : (
            <p className="text-xs text-[var(--muted)]">
              {WORKSPACE_COPY.noPublicInSelection}
            </p>
          )}

          <button
            type="button"
            onClick={() => void onCopyLink()}
            disabled={!linkReady}
            className={`w-full rounded-lg px-3 py-2.5 text-sm font-medium text-white transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
              copiedLink
                ? "bg-[var(--primary-hover)]"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
            }`}
          >
            {copiedLink
              ? WORKSPACE_COPY.copiedLink
              : usesPrompt
                ? `Copy ${platformName} prompt`
                : WORKSPACE_COPY.copyLink}
          </button>

          {hasUsername && linkReady && platformShare ? (
            <>
              <p className="text-[10px] text-[var(--muted)]">
                {linkSelectionCount} public
                {privateInSelectionCount > 0
                  ? ` · ${privateInSelectionCount} private in text only`
                  : ""}
              </p>
              <p className="text-[10px] leading-relaxed text-[var(--muted)]">
                {platformShare.hint}
              </p>
            </>
          ) : null}
        </div>

        <div className="mt-4 flex min-h-0 flex-1 flex-col border-t border-[var(--border-subtle)] pt-4">
          <div className="mb-2 flex shrink-0 items-center justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
              Preview
            </p>
            <button
              type="button"
              onClick={() => void onCopyContext()}
              disabled={!contextText}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)] disabled:opacity-40"
            >
              <AiPlatformIcon format={selectedFormat} size={12} />
              {copiedContext
                ? WORKSPACE_COPY.copiedContext
                : WORKSPACE_COPY.copyTextInstead}
            </button>
          </div>
          <pre className="scrollbar-hidden min-h-0 flex-1 overflow-y-auto whitespace-pre-wrap rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] px-3 py-2.5 font-mono-brand text-[11px] leading-relaxed text-[var(--text-secondary)]">
            {contextText}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <pre className="scrollbar-hidden max-h-[280px] min-h-[200px] overflow-y-auto whitespace-pre-wrap rounded-[10px] border border-[var(--border-subtle)] bg-[var(--surface)] p-3.5 font-mono-brand text-xs leading-[1.7] text-[var(--text-secondary)]">
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

        {showShareLink && shareUrl && platformShare ? (
          <button
            type="button"
            onClick={() => void onCopyLink()}
            className={`w-full rounded-[10px] border px-3 py-2.5 text-sm font-medium transition-[border-color,background,color] duration-150 ease-in-out ${
              copiedLink
                ? "border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]"
                : "border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--text)]"
            }`}
          >
            {copiedLink
              ? "Copied ✓"
              : selectedFormat === "chatgpt" || selectedFormat === "gemini"
                ? "Copy prompt instead"
                : "Copy link instead"}
          </button>
        ) : null}
      </div>
    </div>
  );
}
