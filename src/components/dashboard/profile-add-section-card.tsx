"use client";

import { useEffect, useRef, useState } from "react";
import { friendlySectionTitle } from "@/lib/section-display";
import type { SectionKey } from "@/lib/meto-prompts";

type ProfileAddSectionCardProps = {
  availableTypes: { type: SectionKey; title: string }[];
  onAdd: (sectionType: string, title: string) => void | Promise<void>;
  onAddCustom: () => void;
};

export function ProfileAddSectionCard({
  availableTypes,
  onAdd,
  onAddCustom,
}: ProfileAddSectionCardProps) {
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
    <div
      ref={ref}
      className="relative order-[999] flex min-h-[140px] items-center justify-center"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="group flex h-full min-h-[140px] w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-[#E8E8E4] bg-white px-[18px] py-4 transition-all duration-150 ease-in-out hover:border-[#0F6E56]"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full border-[1.5px] border-[#E8E8E4] text-sm text-[#C0C0B8] transition-all duration-150 group-hover:border-[#0F6E56] group-hover:text-[#0F6E56]">
          +
        </span>
        <span className="text-[13px] text-[#C0C0B8] transition-colors duration-150 group-hover:text-[#0F6E56]">
          Add a section
        </span>
      </button>

      {open ? (
        <div className="absolute bottom-full left-0 right-0 z-30 mb-2 overflow-hidden rounded-lg border border-[#E8E8E4] bg-white py-1 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
          {availableTypes.length === 0 ? (
            <p className="px-3 py-2 text-[13px] text-[#9B9B93]">
              All preset sections added.
            </p>
          ) : (
            availableTypes.map(({ type }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  void onAdd(type, friendlySectionTitle(type));
                  setOpen(false);
                }}
                className="block w-full px-3 py-2 text-left text-[13px] text-[#1A1A18] transition-colors hover:bg-[#F7F7F5]"
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
            className="block w-full border-t border-[#E8E8E4] px-3 py-2 text-left text-[13px] text-[#6B6B63] transition-colors hover:bg-[#F7F7F5]"
          >
            Custom section…
          </button>
        </div>
      ) : null}
    </div>
  );
}
