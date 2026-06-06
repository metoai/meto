"use client";

import { useEffect, useMemo, useState } from "react";
import { recordCopy } from "@/lib/copy-stats";
import {
  buildContextText,
  getSelectedSections,
  sectionTypesForPreset,
  type ContextPresetId,
  type ContextSectionInput,
} from "@/lib/context-templates";
import { buildProfileShareClipboard } from "@/lib/profile-share";
import { getPublicProfilePath } from "@/lib/site";
import type { CompileFormat } from "@/lib/types";

type UseContextShareOptions = {
  sections: ContextSectionInput[];
  username: string;
  displayName: string;
  siteUrl: string;
  shareSectionTypes?: string[];
};

export function useContextShare({
  sections,
  username,
  displayName,
  siteUrl,
  shareSectionTypes,
}: UseContextShareOptions) {
  const availableTypes = useMemo(
    () => sections.map((section) => section.section_type),
    [sections]
  );

  const effectiveShareTypes = useMemo(() => {
    const hasFlags = sections.some((section) => section.is_public !== undefined);
    if (hasFlags) {
      return sections
        .filter((section) => section.is_public)
        .map((section) => section.section_type);
    }
    return shareSectionTypes;
  }, [sections, shareSectionTypes]);

  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [selectedFormat, setSelectedFormat] =
    useState<CompileFormat>("universal");
  const [selectedPreset, setSelectedPreset] =
    useState<ContextPresetId>("all");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedContext, setCopiedContext] = useState(false);

  useEffect(() => {
    const types = sections.map((section) => section.section_type);
    setSelectedSections((current) => {
      if (current.length === 0) return types;
      const valid = current.filter((type) => types.includes(type));
      return valid.length > 0 ? valid : types;
    });
  }, [sections]);

  const selectedItems = useMemo(
    () => getSelectedSections(sections, selectedSections),
    [sections, selectedSections]
  );

  const contextText = useMemo(() => {
    if (selectedItems.length === 0) return "";
    return buildContextText(
      sections,
      selectedSections,
      selectedFormat,
      username || "you",
      displayName
    );
  }, [
    sections,
    selectedSections,
    selectedFormat,
    username,
    displayName,
    selectedItems.length,
  ]);

  const shareSelection = useMemo(() => {
    if (!effectiveShareTypes) return selectedSections;
    return selectedSections.filter((type) => effectiveShareTypes.includes(type));
  }, [selectedSections, effectiveShareTypes]);

  const linkSelectionCount = shareSelection.length;
  const privateInSelectionCount = useMemo(() => {
    if (!effectiveShareTypes) return 0;
    return selectedSections.filter(
      (type) => !effectiveShareTypes.includes(type)
    ).length;
  }, [selectedSections, effectiveShareTypes]);

  const shareUrl = useMemo(() => {
    if (!username || shareSelection.length === 0) return null;
    const base = siteUrl.replace(/\/$/, "");
    return `${base}${getPublicProfilePath(username)}`;
  }, [username, shareSelection.length, siteUrl]);

  const shareClipboardText = useMemo(() => {
    if (!shareUrl) return null;
    return buildProfileShareClipboard(shareUrl);
  }, [shareUrl]);

  const selectionCount = selectedItems.length;
  const wordCount = useMemo(() => {
    if (!contextText) return 0;
    return contextText.trim().split(/\s+/).filter(Boolean).length;
  }, [contextText]);

  function applyPreset(preset: Exclude<ContextPresetId, "custom">) {
    setSelectedPreset(preset);
    setSelectedSections(sectionTypesForPreset(preset, availableTypes));
  }

  function toggleSection(sectionType: string) {
    setSelectedPreset("custom");
    setSelectedSections((current) =>
      current.includes(sectionType)
        ? current.filter((type) => type !== sectionType)
        : [...current, sectionType]
    );
  }

  function selectAllSections() {
    setSelectedPreset("all");
    setSelectedSections(availableTypes);
  }

  function clearAllSections() {
    setSelectedPreset("custom");
    setSelectedSections([]);
  }

  function isSectionPublic(sectionType: string) {
    if (!effectiveShareTypes) return true;
    return effectiveShareTypes.includes(sectionType);
  }

  async function copyContext() {
    if (!contextText) return;
    await navigator.clipboard.writeText(contextText);
    recordCopy();
    setCopiedContext(true);
    setTimeout(() => setCopiedContext(false), 2000);
  }

  async function copyLink() {
    if (!shareClipboardText) return;
    await navigator.clipboard.writeText(shareClipboardText);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  return {
    availableTypes,
    selectedSections,
    selectedFormat,
    selectedPreset,
    selectedItems,
    contextText,
    shareUrl,
    shareClipboardText,
    selectionCount,
    linkSelectionCount,
    privateInSelectionCount,
    shareSelection,
    wordCount,
    copiedLink,
    copiedContext,
    applyPreset,
    toggleSection,
    selectAllSections,
    clearAllSections,
    setSelectedFormat,
    isSectionPublic,
    copyContext,
    copyLink,
  };
}
