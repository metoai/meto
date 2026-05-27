"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { friendlySectionTitle } from "@/lib/section-display";
import type { SectionKey } from "@/lib/meto-prompts";

type AddSectionButtonProps = {
  availableTypes: { type: SectionKey; title: string }[];
  onAdd: (sectionType: string, title: string) => void;
  onAddCustom: () => void;
};

export function AddSectionButton({
  availableTypes,
  onAdd,
  onAddCustom,
}: AddSectionButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-card)]/70 px-4 py-8 text-[var(--color-muted)] transition-colors duration-150 hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
      >
        <Plus className="h-5 w-5" />
        <span className="text-sm">Add a section</span>
      </button>

      {open ? (
        <div className="absolute bottom-full left-0 right-0 z-10 mb-2 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] py-1 shadow-lg">
          {availableTypes.length === 0 ? (
            <p className="px-4 py-3 text-xs text-[var(--color-muted)]">
              All preset sections added.
            </p>
          ) : (
            availableTypes.map(({ type }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  onAdd(type, friendlySectionTitle(type));
                  setOpen(false);
                }}
                className="block w-full px-4 py-2.5 text-left text-sm text-[var(--color-text)] transition-colors duration-150 hover:bg-[var(--color-border)]/40"
              >
                {friendlySectionTitle(type)}
              </button>
            ))
          )}
          <button
            type="button"
            onClick={() => {
              onAddCustom();
              setOpen(false);
            }}
            className="block w-full border-t border-[var(--color-border)] px-4 py-2.5 text-left text-sm text-[var(--color-muted)] transition-colors duration-150 hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]"
          >
            Custom section…
          </button>
        </div>
      ) : null}
    </div>
  );
}
