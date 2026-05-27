"use client";

import { useMemo, useState } from "react";
import {
  buildContextShareUrl,
  buildContextText,
  PRESET_LABELS,
  sectionTypesForPreset,
  type ContextPresetId,
  type ContextSectionInput,
} from "@/lib/context-templates";
import type { CompileFormat } from "@/lib/types";

type ContextBuilderProps = {
  sections: ContextSectionInput[];
  username: string;
  displayName: string;
  siteUrl: string;
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
}: ContextBuilderProps) {
  const availableTypes = useMemo(
    () => sections.map((section) => section.section_type),
    [sections]
  );

  const [selectedSections, setSelectedSections] =
    useState<string[]>(availableTypes);
  const [selectedFormat, setSelectedFormat] =
    useState<CompileFormat>("universal");
  const [selectedPreset, setSelectedPreset] =
    useState<ContextPresetId>("all");
  const [copied, setCopied] = useState(false);

  const previewText = useMemo(
    () =>
      buildContextText(
        sections,
        selectedSections,
        selectedFormat,
        username,
        displayName
      ),
    [sections, selectedSections, selectedFormat, username, displayName]
  );

  const shareUrl = useMemo(
    () =>
      buildContextShareUrl(
        siteUrl,
        username,
        selectedPreset,
        selectedSections,
        selectedFormat
      ),
    [siteUrl, username, selectedPreset, selectedSections, selectedFormat]
  );

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

  async function handleCopy() {
    if (!previewText) return;
    await navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 text-gray-900">
      <header>
        <h2 className="text-lg font-medium">
          What do you want AI to know about you?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Pick what&apos;s relevant for this conversation.
        </p>
      </header>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Presets
        </p>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {PRESET_LABELS.map(({ id, label }) => {
            const active = selectedPreset === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => applyPreset(id)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-[#0F6E56] text-white"
                    : "border border-gray-200 text-gray-500 hover:border-[#0F6E56]"
                }`}
              >
                {label}
              </button>
            );
          })}
          {selectedPreset === "custom" ? (
            <span className="shrink-0 rounded-full bg-[#0F6E56] px-4 py-1.5 text-sm text-white">
              Custom
            </span>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
          Sections
        </p>
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => {
            const active = selectedSections.includes(section.section_type);
            return (
              <button
                key={section.section_type}
                type="button"
                onClick={() => toggleSection(section.section_type)}
                className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "border-[#1D9E75] bg-[#E1F5EE] text-[#0F6E56]"
                    : "border-gray-200 bg-gray-50 text-gray-400"
                }`}
              >
                {section.title}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-sm text-gray-600">Format for:</p>
        <div className="flex flex-wrap gap-2">
          {FORMAT_OPTIONS.map(({ id, label }) => {
            const active = selectedFormat === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedFormat(id)}
                className={`rounded-full px-4 py-1.5 text-sm transition-colors ${
                  active
                    ? "bg-[#0F6E56] text-white"
                    : "border border-gray-200 text-gray-500 hover:border-[#0F6E56]"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative mt-5">
        <textarea
          readOnly
          value={previewText}
          placeholder="Select sections to preview context…"
          className="max-h-[180px] min-h-[120px] w-full resize-none overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-3 font-mono text-xs leading-relaxed text-gray-700"
        />
        {previewText ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 flex h-10 items-end justify-center rounded-b-xl bg-gradient-to-t from-gray-50 to-transparent pb-1 text-[10px] text-gray-400"
          >
            ↕ scroll to see more
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        disabled={!previewText}
        className="mt-4 w-full rounded-xl bg-[#0F6E56] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1D9E75] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {copied ? "Copied ✓" : "Copy context"}
      </button>

      <p className="mt-3 text-center text-xs text-gray-400">
        Or share:{" "}
        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0F6E56] underline-offset-2 hover:underline"
        >
          {shareUrl.replace(/^https?:\/\//, "")}
        </a>
      </p>
    </section>
  );
}
