"use client";

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
        className="flex w-full items-center justify-center rounded-xl border-[1.5px] border-dashed border-[var(--border)] px-4 py-4 text-[13px] text-[var(--placeholder)] transition-all duration-150 ease-in-out hover:border-[var(--primary)] hover:text-[var(--primary)]"
      >
        + Add a section
      </button>

      {open ? (
        <div className="absolute bottom-full left-0 right-0 z-10 mb-2 overflow-hidden landing-panel py-1">
          {availableTypes.length === 0 ? (
            <p className="px-4 py-3 text-xs text-[var(--muted)]">
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
                className="block w-full px-4 py-2.5 text-left text-sm text-[var(--text)] transition-colors duration-150 hover:bg-[var(--surface)]"
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
            className="block w-full border-t border-[var(--border)] px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] transition-colors duration-150 hover:bg-[var(--surface)] hover:text-[var(--text)]"
          >
            Custom section…
          </button>
        </div>
      ) : null}
    </div>
  );
}
