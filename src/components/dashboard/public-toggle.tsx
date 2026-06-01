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
    ? `Public sections appear on your meto.ai/profile/${username} page`
    : "Public sections appear on your meto.ai/profile page once you claim a username";

  return (
    <div className="flex items-center gap-2" title={tooltip}>
      <span
        className={`text-[11px] font-medium transition-colors duration-150 ${
          isPublic ? "text-[#0F6E56]" : "text-[#9B9B93]"
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
          isPublic ? "bg-[#0F6E56]" : "bg-[#E8E8E4]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform duration-150 ease-in-out ${
            isPublic ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
