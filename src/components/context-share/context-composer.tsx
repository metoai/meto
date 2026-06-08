"use client";

import type { ContextSectionInput } from "@/lib/context-templates";
import { useContextShare } from "@/hooks/use-context-share";
import { IntentGrid } from "@/components/context-share/intent-grid";
import { PlatformTabs } from "@/components/context-share/platform-tabs";
import { PreviewPanel } from "@/components/context-share/preview-panel";
import { SectionPicker } from "@/components/context-share/section-picker";
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
    <div
      className={
        embedded
          ? workspaceLayout
            ? "flex min-h-0 w-full flex-1 flex-col"
            : "w-full"
          : "landing-panel p-5 sm:p-6"
      }
    >
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
        className={`${
          workspaceLayout
            ? "grid min-h-0 flex-1 gap-4 md:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] md:gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)]"
            : "grid gap-5 md:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]"
        }`}
      >
        <div className={workspaceLayout ? "min-w-0 space-y-4" : "space-y-5"}>
          {sections.length === 0 ? (
            <p className="rounded-lg border border-dashed border-[var(--border-subtle)] bg-[var(--surface)] px-4 py-6 text-center text-sm text-[var(--text-secondary)]">
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
                label={workspaceLayout ? "Sections" : undefined}
              />
              <PlatformTabs
                selectedFormat={share.selectedFormat}
                onSelect={share.setSelectedFormat}
                workspaceLayout={workspaceLayout}
              />
            </>
          )}
        </div>

        <div
          className={`${
            workspaceLayout
              ? "flex min-h-0 flex-col md:min-h-[min(100%,100%)]"
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
            shareClipboardText={share.shareClipboardText}
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
