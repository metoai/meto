"use client";

import type { ContextSectionInput } from "@/lib/context-templates";
import { useContextShare } from "@/hooks/use-context-share";
import { IntentGrid } from "@/components/context-share/intent-grid";
import { PlatformTabs } from "@/components/context-share/platform-tabs";
import { PreviewPanel } from "@/components/context-share/preview-panel";
import { SectionPicker } from "@/components/context-share/section-picker";
import { WORKSPACE_COPY } from "@/lib/workspace-content";

export type ContextComposerProps = {
  sections: ContextSectionInput[];
  username: string;
  displayName: string;
  siteUrl: string;
  shareSectionTypes?: string[];
  showShareLink?: boolean;
  variant?: "light" | "dark";
  embedded?: boolean;
  workspaceLayout?: boolean;
  onToggleSectionPublic?: (sectionId: string) => void;
};

export function ContextComposer({
  sections,
  username,
  displayName,
  siteUrl,
  shareSectionTypes,
  showShareLink = true,
  embedded = false,
  workspaceLayout = false,
  onToggleSectionPublic,
}: ContextComposerProps) {
  const share = useContextShare({
    sections,
    username,
    displayName,
    siteUrl,
    shareSectionTypes,
  });

  if (sections.length === 0 && !workspaceLayout) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface)] px-5 py-8 text-center">
        <p className="text-sm font-medium text-[var(--text)]">
          Your profile is empty
        </p>
        <p className="mt-1 text-xs text-[var(--muted)]">
          Add sections below, then come back to copy context for any AI.
        </p>
      </div>
    );
  }

  const showHeader = !embedded;

  return (
    <div className={embedded ? "w-full" : "rounded-xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6"}>
      {showHeader ? (
        <header className="mb-6">
          <h2 className="page-title">Share with AI</h2>
          <p className="mt-2 body-text">
            Build a context block, copy it into Claude, ChatGPT, or Gemini — or
            share a link for AI to read.
          </p>
        </header>
      ) : null}

      <div
        className={`grid gap-5 md:gap-6 ${
          workspaceLayout
            ? "md:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]"
            : "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        }`}
      >
        <div className="space-y-5">
          {sections.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--border)] px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
              Add sections in Your profile first — or head to Update and tell
              Meto about yourself in a quick chat.
            </p>
          ) : (
            <>
              <IntentGrid
                selectedPreset={share.selectedPreset}
                onSelect={share.applyPreset}
                workspaceLayout={workspaceLayout}
              />
              <SectionPicker
                sections={sections}
                selectedSections={share.selectedSections}
                onToggle={share.toggleSection}
                onSelectAll={share.selectAllSections}
                onClearAll={share.clearAllSections}
                isSectionPublic={share.isSectionPublic}
                onTogglePublic={onToggleSectionPublic}
                username={username}
                workspaceLayout={workspaceLayout}
                label={
                  workspaceLayout
                    ? WORKSPACE_COPY.sectionPickerLabel
                    : undefined
                }
              />
              <PlatformTabs
                selectedFormat={share.selectedFormat}
                onSelect={share.setSelectedFormat}
              />
            </>
          )}
        </div>

        <div
          className={`${
            workspaceLayout
              ? "md:sticky md:top-0 md:self-start"
              : "lg:sticky lg:top-4 lg:self-start"
          }`}
        >
          <PreviewPanel
            contextText={share.contextText}
            selectedFormat={share.selectedFormat}
            selectionCount={share.selectionCount}
            linkSelectionCount={share.linkSelectionCount}
            privateInSelectionCount={share.privateInSelectionCount}
            wordCount={share.wordCount}
            copiedContext={share.copiedContext}
            onCopyContext={share.copyContext}
            shareUrl={share.shareUrl}
            copiedLink={share.copiedLink}
            onCopyLink={share.copyLink}
            username={username}
            showShareLink={showShareLink}
            workspaceLayout={workspaceLayout}
          />
        </div>
      </div>
    </div>
  );
}
