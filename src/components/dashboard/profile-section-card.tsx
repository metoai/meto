"use client";

import { useEffect, useRef, useState } from "react";
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
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const isDirty = content !== savedContent;
  const displayTitle = friendlySectionTitle(sectionType, title);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 72)}px`;
  }, [content]);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <article className="landing-panel mb-2.5 px-5 py-4 transition-[border-color] duration-150 ease-in-out hover:border-[var(--accent-border)]">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="card-title">{displayTitle}</h3>
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
        className="profile-section-textarea w-full resize-none bg-transparent text-sm leading-[1.65] text-[var(--text-secondary)] outline-none placeholder:text-[var(--placeholder)]"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[11px] text-[var(--placeholder)]">
          Updated {formatRelativeTime(updatedAt)}
        </p>
        <div className="flex items-center gap-2">
          {isDirty ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={onSave}
              className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-medium text-white transition-[background] duration-150 ease-in-out hover:bg-[var(--primary-hover)] disabled:opacity-50"
            >
              {isSaving ? "Saving…" : justSaved ? "Saved ✓" : "Save"}
            </button>
          ) : null}
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="px-1 text-sm text-[var(--placeholder)] transition-colors duration-150 hover:text-[var(--muted)]"
              aria-label="Section menu"
              aria-expanded={menuOpen}
            >
              ···
            </button>
            {menuOpen ? (
              <div className="absolute bottom-full right-0 z-10 mb-1 min-w-[120px] overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--card)] py-1">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="block w-full px-3 py-2 text-left text-[13px] text-[#F87171] transition-colors duration-150 hover:bg-[var(--surface)]"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
