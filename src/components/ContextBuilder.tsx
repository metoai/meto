"use client";

import { Check, Copy, Link2, Lock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  buildContextShareUrl,
  buildHumanPromptPreview,
  FORMAT_USER_LABELS,
  getSelectedSections,
  PRESET_LABELS,
  sectionTypesForPreset,
  type ContextPresetId,
  type ContextSectionInput,
} from "@/lib/context-templates";
import { friendlySectionTitle } from "@/lib/section-display";
import type { CompileFormat } from "@/lib/types";

type ContextBuilderProps = {
  sections: ContextSectionInput[];
  username: string;
  displayName: string;
  siteUrl: string;
  /** When set, share URL only includes these section types (e.g. public sections). */
  shareSectionTypes?: string[];
  showShareLink?: boolean;
  variant?: "light" | "dark";
  embedded?: boolean;
  workspaceLayout?: boolean;
};

const FORMAT_OPTIONS: { id: CompileFormat; label: string }[] = [
  { id: "universal", label: "Any AI" },
  { id: "claude", label: "Claude" },
  { id: "chatgpt", label: "ChatGPT" },
  { id: "gemini", label: "Gemini" },
];

export function ContextBuilder({
  sections,
  username,
  displayName,
  siteUrl,
  shareSectionTypes,
  showShareLink = true,
  variant = "dark",
  embedded = false,
  workspaceLayout = false,
}: ContextBuilderProps) {
  const isDark = variant === "dark";
  const isWorkspace = workspaceLayout;

  const availableTypes = useMemo(
    () => sections.map((section) => section.section_type),
    [sections]
  );

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
      if (current.length === 0) {
        return types;
      }
      const valid = current.filter((type) => types.includes(type));
      return valid.length > 0 ? valid : types;
    });
  }, [sections]);

  const promptPreview = useMemo(
    () => buildHumanPromptPreview(sections, selectedSections, displayName),
    [sections, selectedSections, displayName]
  );

  const shareSelection = useMemo(() => {
    if (!shareSectionTypes) {
      return selectedSections;
    }
    return selectedSections.filter((type) =>
      shareSectionTypes.includes(type)
    );
  }, [selectedSections, shareSectionTypes]);

  const shareUrl = useMemo(() => {
    if (!showShareLink || !username || shareSelection.length === 0) {
      return null;
    }

    return buildContextShareUrl(
      siteUrl,
      username,
      selectedPreset === "custom" ? "custom" : selectedPreset,
      shareSelection,
      selectedFormat
    );
  }, [
    showShareLink,
    username,
    shareSelection,
    siteUrl,
    selectedPreset,
    selectedFormat,
  ]);

  const hasSelection = getSelectedSections(sections, selectedSections).length > 0;
  const canShareLink = Boolean(shareUrl);

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

  async function handleCopyLink() {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  async function handleCopyContext() {
    if (!promptPreview) return;
    await navigator.clipboard.writeText(promptPreview);
    setCopiedContext(true);
    setTimeout(() => setCopiedContext(false), 2000);
  }

  async function handleCopyText() {
    if (!promptPreview) return;
    await navigator.clipboard.writeText(promptPreview);
    setCopiedContext(true);
    setTimeout(() => setCopiedContext(false), 2000);
  }

  const activePill = isDark
    ? "bg-brand-primary text-white"
    : "bg-[var(--color-primary)] text-white shadow-sm";
  const inactivePill = isDark
    ? "border border-brand-border text-brand-text-muted hover:border-brand-primary"
    : "border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]";
  const chipOn = isDark
    ? "border-brand-primary bg-brand-primary/20 text-brand-primary"
    : "border-[var(--color-accent)] bg-[var(--color-light)] text-[var(--color-primary)] shadow-sm";
  const chipOff = isDark
    ? "border-brand-border bg-brand-background text-brand-text-subtle"
    : "border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-text)]";
  const labelClass = isDark ? "text-brand-text-subtle" : "text-[var(--color-muted)] font-semibold";
  const subtextClass = isDark ? "text-brand-text-muted" : "text-[var(--color-muted)]";
  const containerClass = embedded
    ? "text-[var(--color-text)]"
    : isDark
      ? "border-brand-border bg-brand-card text-brand-text"
      : "border-gray-200 bg-white text-gray-900";
  const wrapperClass = embedded
    ? containerClass
    : `rounded-brand-xl border p-5 ${containerClass}`;
  const groupClass = isWorkspace
    ? "rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-3"
    : "";
  const groupTitleClass = isWorkspace
    ? "mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]"
    : `mb-2 text-xs font-medium uppercase tracking-wide ${labelClass}`;
  const chipsWrapClass = isWorkspace ? "flex flex-wrap gap-2" : "flex flex-wrap gap-2";

  if (sections.length === 0) {
    return (
      <div className={wrapperClass}>
        <p className={`text-sm ${subtextClass}`}>
          Add profile sections below, then come back here to create a link for
          AI.
        </p>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      {!embedded ? (
      <header>
        <h2 className="text-lg font-medium">
          What should AI know for this chat?
        </h2>
        <p className={`mt-1 text-sm ${subtextClass}`}>
          Choose the parts of your profile that fit — we&apos;ll give you a link
          to paste into Claude, ChatGPT, or Gemini.
        </p>
      </header>
      ) : null}

      <div className={embedded ? "" : "mt-5"}>
        <div className={groupClass}>
        <p className={groupTitleClass}>Quick picks</p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {PRESET_LABELS.map(({ id, label }) => {
            const active = selectedPreset === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150 ${
                  active ? activePill : inactivePill
                }`}
              >
                {label}
              </button>
            );
          })}
          {selectedPreset === "custom" ? (
            <span
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm ${activePill}`}
            >
              Custom
            </span>
          ) : null}
        </div>
        </div>
      </div>

      <div className="mt-5">
        <div className={groupClass}>
        <p className={groupTitleClass}>Include</p>
        <div className={chipsWrapClass}>
          {sections.map((section) => {
            const active = selectedSections.includes(section.section_type);
            const isPublic =
              !shareSectionTypes ||
              shareSectionTypes.includes(section.section_type);
            return (
              <button
                key={section.section_type}
                type="button"
                onClick={() => toggleSection(section.section_type)}
                title={
                  shareSectionTypes && !isPublic
                    ? "Make public in Your Profile"
                    : undefined
                }
                className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 ${
                  active ? chipOn : chipOff
                }`}
              >
                {friendlySectionTitle(section.section_type, section.title)}
                {shareSectionTypes && !isPublic ? (
                  <Lock className="h-3.5 w-3.5 shrink-0 opacity-70" aria-label="Private" />
                ) : null}
              </button>
            );
          })}
        </div>
        </div>
      </div>

      <div className="mt-5">
        <div className={groupClass}>
        <p className={groupTitleClass}>Best for</p>
        <div className={chipsWrapClass}>
          {FORMAT_OPTIONS.map(({ id, label }) => {
            const active = selectedFormat === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedFormat(id)}
                className={`rounded-full px-3.5 py-1.5 text-sm transition-colors duration-150 ${
                  active ? activePill : inactivePill
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        </div>
      </div>

      {hasSelection ? (
        <div className="mt-7">
          <p className={groupTitleClass}>
            Preview
          </p>
          <div className="relative">
            <div
              className={`max-h-[260px] overflow-y-auto rounded-2xl border p-5 ${
                isDark
                  ? "border-brand-border bg-brand-background"
                  : "border-[var(--color-border)] bg-[var(--color-bg)]"
              }`}
            >
              <p className={`whitespace-pre-wrap text-sm leading-relaxed ${isDark ? "text-brand-text-muted" : "text-[var(--color-text)]/80"}`}>
                {promptPreview}
              </p>
            </div>
            {promptPreview ? (
              <div
                aria-hidden
                className={`pointer-events-none absolute inset-x-0 bottom-0 flex h-10 items-end justify-center rounded-b-2xl bg-gradient-to-t ${
                  isDark ? "from-brand-background" : "from-[var(--color-bg)]"
                } to-transparent pb-1 text-[10px] ${labelClass}`}
              >
                ↕ scroll to read more
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {showShareLink && hasSelection && !workspaceLayout ? (
        <div className="mt-5">
          {canShareLink ? (
            <div className="rounded-brand-xl border border-brand-primary/30 bg-brand-primary/10 p-4">
              <div className="flex items-start gap-2">
                <Link2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">Your AI link is ready</p>
                  <p className={`mt-1 text-sm ${subtextClass}`}>
                    Tell {FORMAT_USER_LABELS[selectedFormat]}: &ldquo;Read this
                    URL before we start.&rdquo;
                  </p>
                  <p
                    className={`mt-3 break-all rounded-brand-md border px-3 py-2 text-sm ${
                      isDark
                        ? "border-brand-border bg-brand-card text-brand-text-muted"
                        : "border-[var(--color-border)] bg-white text-[var(--color-muted)]"
                    }`}
                  >
                    {shareUrl}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-brand-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--color-accent)]"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="h-4 w-4" />
                        Link copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy AI link
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : !username ? (
            <p className={`text-sm ${subtextClass}`}>
              Set a username in Settings to get your shareable AI link.
            </p>
          ) : (
            <p className={`text-sm ${subtextClass}`}>
              Turn on &ldquo;Make public&rdquo; for the sections you selected
              below — then your AI link will appear here.
            </p>
          )}
        </div>
      ) : null}

      {workspaceLayout && hasSelection ? (
        <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]/40 p-3">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-muted)]">
            Action
          </p>
          <button
            type="button"
            onClick={() => void handleCopyContext()}
            disabled={!promptPreview}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[var(--color-accent)] disabled:opacity-40"
          >
            {copiedContext ? (
              <>
                <Check className="h-4 w-4" />
                Copied ✓
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy context
              </>
            )}
          </button>
          {username ? (
            <p className="mt-2.5 text-center text-xs text-[var(--color-muted)]">
              Or share: meto.ai/profile/{username}
            </p>
          ) : null}
        </div>
      ) : null}

      {hasSelection && !workspaceLayout ? (
        <button
          type="button"
          onClick={() => void handleCopyText()}
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-brand-primary underline-offset-2 hover:underline"
        >
          {copiedContext ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Prompt copied!
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy prompt as text
            </>
          )}
        </button>
      ) : null}
    </div>
  );
}
