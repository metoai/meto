"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PublicToggle } from "@/components/dashboard/public-toggle";
import {
  getSectionStatus,
  statusBorderColor,
  statusRecencyLabel,
} from "@/lib/section-status";
import { SectionStatusBadge } from "@/components/dashboard/ui/section-status-badge";
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
  username?: string;
  tieredLayout?: boolean;
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
  username,
  tieredLayout = false,
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
  const sectionStatus = getSectionStatus({
    section_type: sectionType,
    content,
    updated_at: updatedAt,
  } as Parameters<typeof getSectionStatus>[0]);
  const footerLabel = statusRecencyLabel(sectionStatus, updatedAt);

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
      id={`section-${sectionType}`}
      data-profile-card={id}
      onClick={handleCardClick}
      className={`landing-panel relative flex min-h-[140px] cursor-pointer flex-col transition-[border-color,box-shadow] duration-150 ease-in-out ${
        tieredLayout ? "overflow-hidden !p-0" : "px-[18px] py-4"
      } ${
        expanded
          ? tieredLayout
            ? "col-span-1 border-[var(--primary)] shadow-[0_0_0_3px_var(--primary-light)] md:col-span-2"
            : "col-span-1 border-[var(--primary)] shadow-[0_0_0_3px_var(--primary-light)] md:col-span-2"
          : "hover:border-[var(--accent-border)]"
      }`}
      style={
        tieredLayout && !expanded
          ? { borderLeftWidth: 3, borderLeftColor: statusBorderColor(sectionStatus) }
          : undefined
      }
    >
      <div className={tieredLayout ? "flex flex-col px-5 py-4" : ""}>
      <div className="mb-2.5 flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-[var(--text)]">
            {displayTitle}
          </span>
          {tieredLayout ? <SectionStatusBadge status={sectionStatus} /> : null}
        </div>
        <div
          className="flex shrink-0 items-center gap-2"
          data-card-action
          onClick={(e) => e.stopPropagation()}
        >
          <PublicToggle
            isPublic={isPublic}
            onChange={onTogglePublic}
            username={username}
          />
        </div>
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
            className="profile-section-textarea w-full min-h-[80px] resize-none border-none bg-transparent font-[inherit] text-sm leading-[1.65] text-[var(--text)] outline-none placeholder:text-[var(--placeholder)]"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <p
            className={`text-[13px] leading-[1.6] ${
              isEmpty
                ? "italic text-[var(--placeholder)]"
                : "line-clamp-3 text-[var(--text-secondary)]"
            }`}
          >
            {isEmpty ? placeholder : content}
          </p>
        )}
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
        <p className="text-[11px] text-[var(--placeholder)]">{footerLabel}</p>

        {expanded ? (
          <div
            className="flex items-center gap-3"
            data-card-action
            onClick={(e) => e.stopPropagation()}
          >
            {showSavePrompt ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[var(--muted)]">
                  Save changes?
                </span>
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="text-[11px] font-medium text-[var(--primary)]"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={onDiscard}
                  className="text-[11px] text-[var(--muted)]"
                >
                  Discard
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className="cursor-pointer text-xs text-[var(--muted)] transition-colors hover:text-[var(--text-secondary)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isDirty || isSaving}
                  onClick={onSave}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-[7px] border-none bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[var(--primary-hover)] disabled:opacity-40"
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
              className="cursor-pointer px-1 text-base text-[var(--border)] transition-colors hover:text-[var(--muted)]"
              aria-label="Section menu"
              aria-expanded={menuOpen}
            >
              ···
            </button>
            {menuOpen ? (
              <div className="landing-panel absolute bottom-full right-0 z-20 mb-1 min-w-[120px] overflow-hidden py-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDelete();
                  }}
                  className="block w-full px-3 py-2 text-left text-[13px] text-[#F87171] transition-colors hover:bg-[var(--surface)]"
                >
                  Delete
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
      </div>
    </article>
  );
}
