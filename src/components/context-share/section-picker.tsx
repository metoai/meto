"use client";

import { Lock } from "lucide-react";
import type { ContextSectionInput } from "@/lib/context-templates";
import { friendlySectionTitle } from "@/lib/section-display";

type SectionPickerProps = {
  sections: ContextSectionInput[];
  selectedSections: string[];
  onToggle: (sectionType: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  isSectionPublic: (sectionType: string) => boolean;
  label?: string;
};

export function SectionPicker({
  sections,
  selectedSections,
  onToggle,
  onSelectAll,
  onClearAll,
  isSectionPublic,
  label = "Include",
}: SectionPickerProps) {
  const allSelected = selectedSections.length === sections.length;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium text-[var(--muted)]">{label}</p>
        <button
          type="button"
          onClick={allSelected ? onClearAll : onSelectAll}
          className="text-[11px] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--text)]"
        >
          {allSelected ? "Clear all" : "Select all"}
        </button>
      </div>

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
                  ? "Private — make public in Your Profile to share via link"
                  : empty
                    ? "Empty section"
                    : undefined
              }
              className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-3.5 py-1.5 text-[13px] transition-all duration-150 ease-in-out ${
                active
                  ? "border-[#C0E0D8] bg-[var(--primary-light)] text-[var(--primary)]"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]"
              } ${empty && !active ? "opacity-50" : ""}`}
            >
              {title}
              {!isPublic ? (
                <Lock
                  className={`h-2.5 w-2.5 shrink-0 ${active ? "opacity-80" : "opacity-60"}`}
                  aria-label="Private"
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
