"use client";

import { ArrowUp } from "lucide-react";
import { FormEvent, KeyboardEvent, Ref } from "react";

type MetoChatInputProps = {
  input: string;
  onChange: (value: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: FormEvent) => void;
  textareaRef: Ref<HTMLTextAreaElement>;
  disabled?: boolean;
  placeholder: string;
  large?: boolean;
  footerHint?: string;
  showFooter?: boolean;
};

export function MetoChatInput({
  input,
  onChange,
  onKeyDown,
  onSubmit,
  textareaRef,
  disabled,
  placeholder,
  large = false,
  footerHint = "Meto updates every section that needs it",
  showFooter = true,
}: MetoChatInputProps) {
  const canSend = Boolean(input.trim()) && !disabled;

  return (
    <form
      onSubmit={onSubmit}
      className="overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-200 focus-within:border-[#0F6E56]/25 focus-within:shadow-[0_2px_8px_rgba(15,110,86,0.1),0_12px_32px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-end gap-3 px-4 py-3.5">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          rows={large ? 3 : 1}
          placeholder={placeholder}
          disabled={disabled}
          className={`min-w-0 flex-1 resize-none bg-transparent text-[15px] leading-relaxed text-[#1A1A18] outline-none placeholder:text-[#B8B8B0] ${
            large ? "min-h-[72px]" : "max-h-32 py-0.5"
          }`}
        />
        <button
          type="submit"
          disabled={!canSend}
          className={`mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
            canSend
              ? "bg-[#0F6E56] text-white hover:bg-[#1D9E75]"
              : "bg-[#F0F0ED] text-[#C0C0B8]"
          } disabled:cursor-not-allowed`}
          aria-label="Send"
        >
          <ArrowUp className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>
      {showFooter ? (
        <div className="flex items-center justify-between border-t border-black/[0.04] bg-[#FAFAFA] px-4 py-2">
          <span className="text-[11px] text-[#9B9B93]">{footerHint}</span>
          <span className="text-[11px] text-[#C0C0B8]">Enter ↵</span>
        </div>
      ) : null}
    </form>
  );
}
