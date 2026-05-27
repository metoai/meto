"use client";

import { Copy } from "lucide-react";
import { useState } from "react";

type CopyContextButtonProps = {
  compiled: string;
};

export function CopyContextButton({ compiled }: CopyContextButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!compiled) return;
    await navigator.clipboard.writeText(compiled);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="mt-8 inline-flex items-center gap-2 rounded-brand-md bg-brand-primary px-6 py-3 text-sm font-medium text-black transition-colors hover:bg-brand-primary-hover"
    >
      <Copy className="h-4 w-4" />
      {copied ? "Copied!" : "Copy context"}
    </button>
  );
}
