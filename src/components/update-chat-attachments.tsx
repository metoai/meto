"use client";

import { FileText, Paperclip, X } from "lucide-react";
import { MetoStatusIndicator } from "@/components/meto-status-indicator";
import type { DocumentImportMode } from "@/lib/document-import";
import { DOCUMENT_ACCEPT, DOCUMENT_IMPORT } from "@/lib/document-import";
import { METO_STATUS_LABELS } from "@/lib/meto-status-labels";

export type PendingAttachment = {
  id: string;
  file: File;
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type AttachmentReadState = "reading" | "ready" | "error";

type UpdateChatAttachmentsProps = {
  attachments: PendingAttachment[];
  attachmentReadState?: Record<string, AttachmentReadState>;
  onAdd: (files: FileList | File[]) => void;
  onRemove: (id: string) => void;
  importMode: DocumentImportMode;
  onImportModeChange: (mode: DocumentImportMode) => void;
  disabled?: boolean;
  compact?: boolean;
};

export function UpdateChatAttachments({
  attachments,
  attachmentReadState = {},
  onAdd,
  onRemove,
  importMode,
  onImportModeChange,
  disabled,
  compact,
}: UpdateChatAttachmentsProps) {
  return (
    <div className={compact ? "space-y-2" : "space-y-2.5"}>
      <div className="flex flex-wrap items-center gap-2">
        <label
          className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:border-[var(--border-hover)] hover:text-[var(--text)] ${
            disabled ? "pointer-events-none opacity-50" : ""
          }`}
        >
          <Paperclip className="h-3.5 w-3.5" />
          Attach file
          <input
            type="file"
            className="sr-only"
            multiple
            accept={DOCUMENT_ACCEPT}
            disabled={disabled}
            onChange={(e) => {
              if (e.target.files?.length) {
                onAdd(e.target.files);
                e.target.value = "";
              }
            }}
          />
        </label>

        {attachments.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface)] p-1">
            <span className="px-2 text-[10px] uppercase tracking-wide text-[var(--muted)]">
              Import
            </span>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onImportModeChange("supplement")}
              className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                importMode === "supplement"
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              }`}
            >
              Add to profile
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onImportModeChange("refresh")}
              className={`rounded-md px-2 py-1 text-[11px] transition-colors ${
                importMode === "refresh"
                  ? "bg-[var(--primary-light)] text-[var(--primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text)]"
              }`}
            >
              Refresh from file
            </button>
          </div>
        ) : null}
      </div>

      {attachments.length > 0 ? (
        <ul className="flex flex-wrap gap-2">
          {attachments.map((item) => {
            const readState = attachmentReadState[item.id];
            return (
            <li
              key={item.id}
              className="inline-flex max-w-full items-center gap-2 rounded-lg border border-[var(--border-subtle)] bg-[var(--card)] px-2.5 py-1.5 text-xs text-[var(--text)]"
            >
              <FileText className="h-3.5 w-3.5 shrink-0 text-[var(--muted)]" />
              <span className="truncate">{item.file.name}</span>
              {readState === "reading" ? (
                <MetoStatusIndicator
                  labels={[...METO_STATUS_LABELS.attachment]}
                  size="sm"
                  className="shrink-0"
                />
              ) : readState === "error" ? (
                <span className="shrink-0 text-red-500">Read failed</span>
              ) : (
                <span className="shrink-0 text-[var(--muted)]">
                  {formatFileSize(item.file.size)}
                </span>
              )}
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRemove(item.id)}
                className="shrink-0 rounded p-0.5 text-[var(--muted)] hover:bg-[var(--surface)] hover:text-[var(--text)]"
                aria-label={`Remove ${item.file.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          );
          })}
        </ul>
      ) : null}

      {!compact ? (
        <p className="text-[11px] leading-relaxed text-[var(--muted)]">
          PDF, DOCX, TXT, MD, CSV, or RTF — up to {DOCUMENT_IMPORT.MAX_FILES}{" "}
          files, {DOCUMENT_IMPORT.MAX_FILE_BYTES / (1024 * 1024)} MB each.
          Processed in memory only; review changes before saving.
        </p>
      ) : null}
    </div>
  );
}
