"use client";

import { PublicToggle } from "@/components/dashboard/public-toggle";
import type { ContextSectionInput } from "@/lib/context-templates";
import { friendlySectionTitle } from "@/lib/section-display";
import { WORKSPACE_COPY } from "@/lib/workspace-content";

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
        <div>
          <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
          {workspaceLayout ? (
            <p className="mt-0.5 text-[10px] leading-relaxed text-[var(--muted)]">
              {WORKSPACE_COPY.sectionPickerHint}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={allSelected ? onClearAll : onSelectAll}
          className="text-[11px] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--text)]"
        >
          {allSelected ? "Clear all" : "Select all"}
        </button>
      </div>

      {workspaceLayout && onTogglePublic ? (
        <div className="space-y-1.5">
          {sections.map((section) => {
            const active = selectedSections.includes(section.section_type);
            const isPublic = isSectionPublic(section.section_type);
            const title = friendlySectionTitle(
              section.section_type,
              section.title
            );
            const empty = !section.content?.trim();

            return (
              <div
                key={section.section_type}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-150 ${
                  active
                    ? "border-[var(--accent-border)] bg-[var(--primary-light)]"
                    : "border-[var(--border)] bg-[var(--card)]"
                } ${empty ? "opacity-60" : ""}`}
              >
                <button
                  type="button"
                  onClick={() => onToggle(section.section_type)}
                  className={`min-w-0 flex-1 text-left text-[13px] transition-colors ${
                    active ? "font-medium text-[var(--primary)]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {title}
                </button>
                {section.id ? (
                  <PublicToggle
                    isPublic={section.is_public ?? isPublic}
                    username={username}
                    onChange={() => onTogglePublic(section.id!)}
                  />
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
