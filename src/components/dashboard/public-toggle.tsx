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
        className={`text-xs transition-colors ${
          isPublic ? "text-[#1D9E75]" : "text-[#6B9E88]"
        }`}
      >
        {isPublic ? "Public" : "Private"}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isPublic}
        disabled={disabled}
        onClick={onChange}
        className={`relative h-5 w-9 shrink-0 rounded-full transition-colors duration-150 disabled:opacity-50 ${
          isPublic ? "bg-[#0F6E56]" : "bg-[#2A3D34]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-150 ${
            isPublic ? "left-[18px]" : "left-0.5"
          }`}
        />
      </button>
    </div>
  );
}
