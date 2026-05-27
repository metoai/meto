"use client";

import { useEffect, useRef } from "react";
import { formatRelativeTime } from "@/lib/profile-utils";
import {
  friendlySectionTitle,
  sectionPlaceholder,
} from "@/lib/section-display";
import { PublicToggle } from "@/components/dashboard/public-toggle";

type ProfileSectionCardProps = {
  id: string;
  sectionType: string;
  title: string;
  content: string;
  savedContent: string;
  isPublic: boolean;
  updatedAt: string;
  username?: string | null;
  isSaving: boolean;
  justSaved: boolean;
  onContentChange: (content: string) => void;
  onTogglePublic: () => void;
  onSave: () => void;
  onDelete: () => void;
};

export function ProfileSectionCard({
  sectionType,
  title,
  content,
  savedContent,
  isPublic,
  updatedAt,
  username,
  isSaving,
  justSaved,
  onContentChange,
  onTogglePublic,
  onSave,
  onDelete,
}: ProfileSectionCardProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isDirty = content !== savedContent;
  const displayTitle = friendlySectionTitle(sectionType, title);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 72)}px`;
  }, [content]);

  return (
    <article
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/80 p-4 sm:p-5 transition-colors ${
        justSaved ? "border-[var(--color-primary)]/60" : ""
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {displayTitle}
        </h3>
        <PublicToggle
          isPublic={isPublic}
          onChange={onTogglePublic}
          username={username}
        />
      </div>

      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={sectionPlaceholder(sectionType)}
        rows={3}
        className="profile-section-textarea w-full resize-none bg-transparent text-sm leading-relaxed text-[var(--color-muted)] outline-none placeholder:text-[var(--color-muted)]/70"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-[var(--color-muted)]">
          Updated {formatRelativeTime(updatedAt)}
        </p>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onDelete}
            className="text-xs text-red-400/80 transition-colors duration-150 hover:text-red-400"
          >
            Delete
          </button>
          {isDirty ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={onSave}
              className="rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[var(--color-accent)] disabled:opacity-50"
            >
              {isSaving ? "Saving…" : justSaved ? "Saved ✓" : "Save"}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
