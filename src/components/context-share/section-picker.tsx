"use client";

import { Check } from "lucide-react";
import { PublicToggle } from "@/components/dashboard/public-toggle";
import type { ContextSectionInput } from "@/lib/context-templates";
import { friendlySectionTitle } from "@/lib/section-display";

type SectionPickerProps = {
  sections: ContextSectionInput[];
  selectedSections: string[];
  onToggle: (sectionType: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  isSectionPublic: (sectionType: string) => boolean;
  onTogglePublic?: (sectionId: string) => void;
  username?: string | null;
  label?: string;
  workspaceLayout?: boolean;
};

export function SectionPicker({
  sections,
  selectedSections,
  onToggle,
  onSelectAll,
  onClearAll,
  isSectionPublic,
  onTogglePublic,
  username,
  label = "Include",
  workspaceLayout = false,
}: SectionPickerProps) {
  const allSelected = selectedSections.length === sections.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p
          className={
            workspaceLayout
              ? "landing-panel-label"
              : "text-xs font-medium text-[var(--muted)]"
          }
        >
          {label}
        </p>
        <button
          type="button"
          onClick={allSelected ? onClearAll : onSelectAll}
          className="text-[11px] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--text)]"
        >
          {allSelected ? "Clear" : "All"}
        </button>
      </div>

      {workspaceLayout && onTogglePublic ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => {
            const active = selectedSections.includes(section.section_type);
            const title = friendlySectionTitle(
              section.section_type,
              section.title
            );
            const empty = !section.content?.trim();

            return (
              <div
                key={section.section_type}
                className={`landing-panel flex flex-col gap-2 p-3 ${
                  empty ? "opacity-50" : ""
                } ${active ? "ring-1 ring-[var(--accent-border)]" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => onToggle(section.section_type)}
                  className={`flex min-w-0 flex-1 items-start gap-2 text-left text-[13px] transition-colors ${
                    active
                      ? "text-[var(--text)]"
                      : "text-[var(--text-secondary)]"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors ${
                      active
                        ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                        : "border-[var(--border)] bg-transparent"
                    }`}
                    aria-hidden
                  >
                    {active ? (
                      <Check className="h-2 w-2" strokeWidth={3} />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1 whitespace-normal leading-snug">
                    {title}
                  </span>
                </button>
                {section.id ? (
                  <div className="flex justify-end border-t border-[var(--border-subtle)] pt-2">
                    <PublicToggle
                      variant="compact"
                      isPublic={
                        section.is_public ?? isSectionPublic(section.section_type)
                      }
                      username={username}
                      onChange={() => onTogglePublic(section.id!)}
                    />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {sections.map((section) => {
            const active = selectedSections.includes(section.section_type);
            const isPublic = isSectionPublic(section.section_type);
            const title = friendlySectionTitle(
              section.section_type,
              section.title
            );
            const empty = !section.content?.trim();

            return (
              <button
                key={section.section_type}
                type="button"
                onClick={() => onToggle(section.section_type)}
                title={
                  !isPublic
                    ? "Private — text copy only"
                    : empty
                      ? "Empty section"
                      : undefined
                }
                className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-3.5 py-1.5 text-[13px] transition-all duration-150 ease-in-out ${
                  active
                    ? isPublic
                      ? "border-[var(--accent-border)] bg-[var(--primary-light)] text-[var(--primary)]"
                      : "border-[var(--border)] bg-[var(--elevated)] text-[var(--text-secondary)]"
                    : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
                } ${empty && !active ? "opacity-50" : ""}`}
              >
                {title}
                {!isPublic ? (
                  <span className="text-[10px] text-[var(--muted)]">· private</span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
