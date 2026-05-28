"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatRelativeTime } from "@/lib/profile-utils";
import {
  friendlySectionTitle,
  sectionPlaceholder,
} from "@/lib/section-display";

const EMPTY_PLACEHOLDERS: Record<string, string> = {
  about: "Who are you?",
  work: "What do you do?",
  projects: "What are you building?",
  skills: "What are you good at?",
  goals: "What are you working toward?",
  communication_style: "How should AI talk to you?",
  working_style: "How should AI talk to you?",
  context_for_ai: "How should AI talk to you?",
};

function emptyPlaceholder(sectionType: string) {
  return EMPTY_PLACEHOLDERS[sectionType] ?? sectionPlaceholder(sectionType);
}

type ProfileSectionGridCardProps = {
  id: string;
  sectionType: string;
  title: string;
  content: string;
  savedContent: string;
  isPublic: boolean;
  updatedAt: string;
  expanded: boolean;
  isSaving: boolean;
  showSavePrompt: boolean;
  onExpand: () => void;
  onContentChange: (content: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onDiscard: () => void;
  onTogglePublic: () => void;
  onDelete: () => void;
};

export function ProfileSectionGridCard({
  id,
  sectionType,
  title,
  content,
  savedContent,
  isPublic,
  updatedAt,
  expanded,
  isSaving,
  showSavePrompt,
  onExpand,
  onContentChange,
  onSave,
  onCancel,
  onDiscard,
  onTogglePublic,
  onDelete,
}: ProfileSectionGridCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const displayTitle = friendlySectionTitle(sectionType, title);
  const placeholder = emptyPlaceholder(sectionType);
  const isDirty = content !== savedContent;
  const isEmpty = !content.trim();
  const footerLabel = isEmpty
    ? "Not set"
    : `Updated ${formatRelativeTime(updatedAt)}`;

  useEffect(() => {
    if (!expanded) return;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.style.height = "auto";
    el.style.height = `${Math.max(el.scrollHeight, 80)}px`;
  }, [expanded, content]);

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

  function handleCardClick(e: React.MouseEvent) {
    if (expanded) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-card-action]")) return;
    onExpand();
  }

  return (
    <article
      ref={cardRef}
      data-profile-card={id}
      onClick={handleCardClick}
      className={`relative flex min-h-[140px] cursor-pointer flex-col rounded-xl border bg-white px-[18px] py-4 transition-all duration-150 ease-in-out md:duration-200 ${
        expanded
          ? "col-span-1 border-[#0F6E56] shadow-[0_0_0_3px_#E8F5F0] md:col-span-2"
          : "border-[#E8E8E4] hover:border-[#C0C0B8]"
      }`}
    >
      <div className="mb-2.5 flex items-start justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-[#9B9B93]">
          {displayTitle}
        </span>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            isPublic
              ? "bg-[#E8F5F0] text-[#0F6E56]"
              : "bg-[#F7F7F5] text-[#9B9B93]"
          }`}
        >
          {isPublic ? "Public" : "Private"}
        </span>
      </div>

      <div className="min-h-0 flex-1 transition-[max-height] duration-200 ease-in-out">
        {expanded ? (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              onContentChange(e.target.value);
              const el = e.target;
              el.style.height = "auto";
              el.style.height = `${Math.max(el.scrollHeight, 80)}px`;
            }}
            placeholder={placeholder}
            rows={3}
            className="profile-section-textarea w-full min-h-[80px] resize-none border-none bg-transparent font-[inherit] text-sm leading-[1.65] text-[#1A1A18] outline-none placeholder:text-[#C0C0B8]"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p
            className={`text-[13px] leading-[1.6] ${
              isEmpty
                ? "italic text-[#C0C0B8]"
                : "line-clamp-3 text-[#6B6B63]"
            }`}
          >
            {isEmpty ? placeholder : content}
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
        <p className="text-[11px] text-[#C0C0B8]">{footerLabel}</p>

        {expanded ? (
          <div
            className="flex items-center gap-3"
            data-card-action
            onClick={(e) => e.stopPropagation()}
          >
            {showSavePrompt ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#9B9B93]">
                  Save changes?
                </span>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="text-[11px] font-medium text-[#0F6E56]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onDiscard}
                  className="text-[11px] text-[#9B9B93]"
                >
                  Discard
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className="cursor-pointer text-xs text-[#9B9B93] transition-colors hover:text-[#6B6B63]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isDirty || isSaving}
                  onClick={onSave}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] border-none bg-[#0F6E56] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1D9E75] disabled:opacity-40"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" aria-hidden />
                      Saving...
                    </>
                  ) : (
                    "Save"
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          <div ref={menuRef} className="relative" data-card-action>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((open) => !open);
              }}
              className="cursor-pointer px-1 text-base text-[#E8E8E4] transition-colors hover:text-[#9B9B93]"
              aria-label="Section menu"
              aria-expanded={menuOpen}
            >
              ···
            </button>
            {menuOpen ? (
              <div className="absolute bottom-full right-0 z-20 mb-1 min-w-[140px] overflow-hidden rounded-lg border border-[#E8E8E4] bg-white py-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onTogglePublic();
                  }}
                  className="block w-full px-3 py-2 text-left text-[13px] text-[#1A1A18] transition-colors hover:bg-[#F7F7F5]"
                >
                  {isPublic ? "Make private" : "Make public"}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="block w-full px-3 py-2 text-left text-[13px] text-[#F87171] transition-colors hover:bg-[#F7F7F5]"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </article>
  );
}
