"use client";

import type { CompileFormat } from "@/lib/types";
import { WORKSPACE_COPY } from "@/lib/workspace-content";

type PreviewPanelProps = {
  contextText: string;
  selectedFormat: CompileFormat;
  selectionCount: number;
  wordCount: number;
  copiedContext: boolean;
  onCopyContext: () => void;
  shareUrl: string | null;
  copiedLink: boolean;
  onCopyLink: () => void;
  username: string;
  showShareLink: boolean;
  workspaceLayout?: boolean;
};

export function PreviewPanel({
  contextText,
  selectionCount,
  copiedContext,
  onCopyContext,
  shareUrl,
  copiedLink,
  onCopyLink,
  username,
  showShareLink,
  workspaceLayout,
}: PreviewPanelProps) {
  if (selectionCount === 0) {
    return (
      <div className="flex h-full min-h-[220px] flex-col items-center justify-center rounded-[10px] border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-10 text-center">
        <p className="text-sm font-medium text-[var(--text)]">
          {workspaceLayout
            ? WORKSPACE_COPY.emptySelectionTitle
            : "Nothing selected yet"}
        </p>
        <p className="mt-1 max-w-xs text-xs text-[var(--muted)]">
          {workspaceLayout
            ? WORKSPACE_COPY.emptySelectionBody
            : "Pick a scenario or toggle sections on the right — your context block will appear here live."}
        </p>
      </div>
    );
  }

  if (workspaceLayout) {
    const linkReady = Boolean(shareUrl);

    return (
      <div className="flex h-full min-h-0 flex-col">
        <div className="space-y-3">
          <div>
            <p className="text-xs font-medium text-[var(--muted)]">
              {WORKSPACE_COPY.linkLabel}
            </p>
            <div className="mt-1.5 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5">
              {linkReady ? (
                <p className="break-all font-mono-brand text-xs leading-relaxed text-[var(--text-secondary)]">
                  {shareUrl}
                </p>
              ) : (
                <p className="text-xs leading-relaxed text-[var(--muted)]">
                  {!username
                    ? WORKSPACE_COPY.noUsername
                    : WORKSPACE_COPY.noPublicInSelection}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => void onCopyLink()}
            disabled={!linkReady}
            className={`w-full rounded-[10px] border-none px-3 py-3 text-sm font-medium text-white transition-[background] duration-150 ease-in-out disabled:opacity-40 ${
              copiedLink
                ? "bg-[var(--primary-hover)]"
                : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
            }`}
          >
            {copiedLink ? WORKSPACE_COPY.copiedLink : WORKSPACE_COPY.copyLink}
          </button>

          {linkReady ? (
            <p className="text-center text-xs leading-relaxed text-[var(--muted)]">
              {WORKSPACE_COPY.linkHint}
            </p>
          ) : null}
        </div>

        <div className="mt-5 min-h-0 flex-1">
          <p className="mb-1.5 text-xs font-medium text-[var(--muted)]">
            {WORKSPACE_COPY.previewLabel}
          </p>
          <pre className="scrollbar-hidden max-h-[220px] min-h-[140px] overflow-y-auto whitespace-pre-wrap rounded-[10px] border border-[var(--border)] bg-[var(--surface)] p-3.5 font-mono-brand text-xs leading-[1.7] text-[var(--text-secondary)]">
            {contextText}
          </pre>
        </div>

        <button
          type="button"
          onClick={() => void onCopyContext()}
          disabled={!contextText}
          className="mt-3 w-full rounded-[10px] border border-[var(--border)] bg-[var(--card)] px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-[border-color,color] duration-150 ease-in-out hover:border-[var(--border-hover)] hover:text-[var(--text)] disabled:opacity-40"
        >
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
          className={`w-full rounded-[10px] border-none px-3 py-3 text-sm font-medium text-white transition-[background] duration-150 ease-in-out disabled:opacity-40 ${
            copiedContext
              ? "bg-[var(--primary-hover)]"
              : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
          }`}
        >
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
