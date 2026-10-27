"use client";

import { useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ExpandableTextProps {
  text: string;
  maxLinesMobile?: number;
  maxLinesDesktop?: number;
  className?: string;
  buttonClassName?: string;
}

export function ExpandableText({
  text,
  maxLinesMobile = 5,
  maxLinesDesktop = 6,
  className = "",
  buttonClassName = "",
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);
  const contentId = useId();

  if (!text) return null;

  // Rough heuristic to determine if text is long enough to warrant a toggle (~4 lines)
  const isLong = text.length > 220 || text.split("\n").length > 4;

  const clampClass = expanded
    ? ""
    : maxLinesMobile === 5
      ? "line-clamp-5 sm:line-clamp-6"
      : "line-clamp-4 sm:line-clamp-6";

  return (
    <div className="relative">
      <p
        id={contentId}
        className={`whitespace-pre-wrap transition-all duration-200 ${clampClass} ${className}`}
      >
        {text}
      </p>

      {isLong ? (
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls={contentId}
          className={`mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-[var(--primary)] transition-transform duration-150 hover:text-[var(--primary-hover)] active:scale-[0.97] ${buttonClassName}`}
        >
          <span>{expanded ? "Show less" : "Read more"}</span>
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" aria-hidden />
          )}
        </button>
      ) : null}
    </div>
  );
}
