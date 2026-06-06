"use client";

type PublicToggleProps = {
  isPublic: boolean;
  onChange: () => void;
  disabled?: boolean;
  username?: string | null;
  variant?: "default" | "minimal" | "compact";
};

export function PublicToggle({
  isPublic,
  onChange,
  disabled,
  username,
  variant = "default",
}: PublicToggleProps) {
  const tooltip = username
    ? `Public sections appear on your metoai.site/profile/${username} page`
    : "Public sections appear on your metoai.site/profile page once you claim a username";

  const minimal = variant === "minimal";
  const compact = variant === "compact";
  const small = minimal || compact;

  const label = (
    <span
      className={`font-medium transition-colors duration-150 ${
        compact ? "text-[10px]" : "text-[11px]"
      } ${isPublic ? "text-[var(--primary)]" : "text-[var(--muted)]"}`}
    >
      {isPublic ? "Public" : "Private"}
    </span>
  );

  return (
    <div
      className={`flex items-center ${small ? "gap-1.5" : "gap-2"}`}
      title={tooltip}
    >
      {!minimal ? label : null}
      <button
        type="button"
        role="switch"
        aria-checked={isPublic}
        aria-label={
          isPublic
            ? "Public — click to make private"
            : "Private — click to make public"
        }
        disabled={disabled}
        onClick={onChange}
        className={`relative shrink-0 rounded-full transition-[background] duration-150 ease-in-out disabled:opacity-50 ${
          small ? "h-4 w-7" : "h-5 w-9"
        } ${isPublic ? "bg-[var(--primary)]" : "bg-[var(--border)]"}`}
      >
        <span
          className={`absolute rounded-full bg-[var(--card)] transition-transform duration-150 ease-in-out ${
            small ? "top-0.5 h-3 w-3" : "top-0.5 h-4 w-4"
          } ${isPublic ? (small ? "left-[14px]" : "left-[18px]") : "left-0.5"}`}
        />
      </button>
    </div>
  );
}
