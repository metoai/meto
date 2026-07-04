"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProfileAddSectionCard } from "@/components/dashboard/profile-add-section-card";
import { ProfileLiveBanner } from "@/components/dashboard/profile-live-banner";
import { ProfileSectionGridCard } from "@/components/dashboard/profile-section-grid-card";
import {
  availablePresetSectionTypes,
  friendlySectionTitle,
} from "@/lib/section-display";
import { SECTION_KEYS } from "@/lib/meto-prompts";
import {
  getSectionStatus,
  statusSortPriority,
} from "@/lib/section-status";
import type { ContextSection } from "@/lib/types";

const PRESET_SECTION_TYPES = new Set<string>(SECTION_KEYS);

export type ProfileSectionDraft = ContextSection & {
  savedTitle: string;
  savedContent: string;
};

type ProfileGridViewProps = {
  sections: ProfileSectionDraft[];
  username: string;
  tieredLayout?: boolean;
  hideLiveBanner?: boolean;
  sectionTypesFilter?: ReadonlySet<string>;
  initialSectionType?: string | null;
  savingId: string | null;
  onUsernameClaimed: (username: string) => void;
  onUpdateContent: (id: string, content: string) => void;
  onRevertContent: (id: string, content: string) => void;
  onSaveSection: (section: ProfileSectionDraft) => Promise<void>;
  onDeleteSection: (id: string) => void;
  onTogglePublic: (section: ProfileSectionDraft) => void;
  onAddPresetSection: (
    sectionType: string,
    title: string
  ) => Promise<string | undefined>;
  onAddCustom: () => void;
};

export function ProfileGridView({
  sections,
  username,
  tieredLayout = false,
  hideLiveBanner = false,
  sectionTypesFilter,
  initialSectionType = null,
  savingId,
  onUsernameClaimed,
  onUpdateContent,
  onRevertContent,
  onSaveSection,
  onDeleteSection,
  onTogglePublic,
  onAddPresetSection,
  onAddCustom,
}: ProfileGridViewProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [savePromptCardId, setSavePromptCardId] = useState<string | null>(null);

  const collapseCard = useCallback(
    (id: string, revert = false) => {
      const section = sections.find((item) => item.id === id);
      if (revert && section) {
        onRevertContent(id, section.savedContent);
      }
      setExpandedCardId(null);
      setSavePromptCardId(null);
    },
    [onRevertContent, sections]
  );

  const saveAndCollapse = useCallback(
    async (section: ProfileSectionDraft) => {
      await onSaveSection(section);
      setExpandedCardId(null);
      setSavePromptCardId(null);
    },
    [onSaveSection]
  );

  const expandCard = useCallback(
    async (nextId: string) => {
      if (expandedCardId === nextId) return;

      if (expandedCardId) {
        const current = sections.find((item) => item.id === expandedCardId);
        if (current && current.content !== current.savedContent) {
          await saveAndCollapse(current);
        } else {
          setExpandedCardId(null);
          setSavePromptCardId(null);
        }
      }

      setExpandedCardId(nextId);
      setSavePromptCardId(null);
    },
    [expandedCardId, saveAndCollapse, sections]
  );

  useEffect(() => {
    if (!initialSectionType) return;
    const match = sections.find(
      (section) => section.section_type === initialSectionType
    );
    if (!match) return;
    setExpandedCardId(match.id);
    requestAnimationFrame(() => {
      document
        .getElementById(`section-${match.section_type}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [initialSectionType, sections]);

  useEffect(() => {
    if (!expandedCardId) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || !expandedCardId) return;
      collapseCard(expandedCardId, true);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [collapseCard, expandedCardId]);

  useEffect(() => {
    if (!expandedCardId) return;
    const activeId = expandedCardId;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (gridRef.current?.contains(target)) return;

      const section = sections.find((item) => item.id === activeId);
      if (!section) return;

      const dirty = section.content !== section.savedContent;
      if (dirty) {
        setSavePromptCardId(activeId);
        return;
      }

      collapseCard(activeId);
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [collapseCard, expandedCardId, sections]);

  async function handleAddPreset(sectionType: string, title: string) {
    const newId = await onAddPresetSection(sectionType, title);
    if (newId) {
      setExpandedCardId(newId);
      setSavePromptCardId(null);
    }
  }

  const presetOptions = availablePresetSectionTypes(
    sections.map((section) => section.section_type),
    sectionTypesFilter
  );

  const filteredSections = sectionTypesFilter
    ? sections.filter(
        (section) =>
          sectionTypesFilter.has(section.section_type) ||
          !PRESET_SECTION_TYPES.has(section.section_type)
      )
    : sections;

  const displaySections = tieredLayout
    ? [...filteredSections].sort((a, b) => {
        const priorityDiff =
          statusSortPriority(getSectionStatus(a)) -
          statusSortPriority(getSectionStatus(b));
        if (priorityDiff !== 0) return priorityDiff;
        return a.display_order - b.display_order;
      })
    : filteredSections;

  return (
    <div className="w-full">
      {!hideLiveBanner ? (
        <ProfileLiveBanner
          username={username}
          onUsernameClaimed={onUsernameClaimed}
        />
      ) : null}

      <div
        ref={gridRef}
        className="grid grid-cols-1 gap-2.5 md:grid-cols-2"
      >
        {displaySections.map((section) => (
          <ProfileSectionGridCard
            key={section.id}
            id={section.id}
            sectionType={section.section_type}
            title={section.title}
            content={section.content}
            savedContent={section.savedContent}
            isPublic={section.is_public}
            updatedAt={section.updated_at}
            username={username}
            tieredLayout={tieredLayout}
            expanded={expandedCardId === section.id}
            isSaving={savingId === section.id}
            showSavePrompt={savePromptCardId === section.id}
            onExpand={() => void expandCard(section.id)}
            onContentChange={(value) => onUpdateContent(section.id, value)}
            onSave={() => void saveAndCollapse(section)}
            onCancel={() => collapseCard(section.id, true)}
            onDiscard={() => collapseCard(section.id, true)}
            onTogglePublic={() => onTogglePublic(section)}
            onDelete={() => onDeleteSection(section.id)}
          />
        ))}

        <ProfileAddSectionCard
          availableTypes={presetOptions.map(({ type }) => ({
            type,
            title: friendlySectionTitle(type),
          }))}
          onAdd={handleAddPreset}
          onAddCustom={onAddCustom}
        />
      </div>
    </div>
  );
}
