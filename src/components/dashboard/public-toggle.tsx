"use client";

type PublicToggleProps = {
  isPublic: boolean;
  onChange: () => void;
  disabled?: boolean;
  username?: string | null;
};

export function PublicToggle({
  isPublic,
  onChange,
  disabled,
  username,
}: PublicToggleProps) {
  const tooltip = username
    ? `Public sections appear on your metoai.site/profile/${username} page`
    : "Public sections appear on your metoai.site/profile page once you claim a username";

  return (
    <div className="flex items-center gap-2" title={tooltip}>
      <span
        className={`text-[11px] font-medium transition-colors duration-150 ${
          isPublic ? "text-[var(--primary)]" : "text-[var(--muted)]"
        }`}
      >
        {isPublic ? "Public" : "Private"}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isPublic}
        aria-label={isPublic ? "Make section private" : "Make section public"}
        disabled={disabled}
        onClick={onChange}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-[background] duration-150 ease-in-out disabled:opacity-50 ${
          isPublic ? "bg-[var(--primary)]" : "bg-[var(--border)]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-[var(--card)] transition-transform duration-150 ease-in-out ${
            isPublic ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
