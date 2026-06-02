import { MetoMarkBadge } from "@/components/meto-mark";
import {
  countFilledSections,
  LANDING_OPENING,
  LANDING_SECTION_LABELS,
  type CollectedProfile,
} from "@/lib/landing-chat";

export function LandingOpeningMessage() {
  return (
    <div className="flex gap-3 text-left">
      <MetoMarkBadge />
      <div>
        <p className="mb-1 text-[11px] font-medium text-[var(--primary)]">Meto</p>
        <p className="text-sm leading-normal text-[var(--text)]">{LANDING_OPENING}</p>
      </div>
    </div>
  );
}

export function LandingProfileProgress({
  collected,
}: {
  collected: CollectedProfile;
}) {
  const filled = countFilledSections(collected);
  if (filled === 0) return null;

  return (
    <div
      className="mt-3 flex flex-wrap items-center justify-center gap-1.5"
      aria-label={`${filled} of 4 profile sections captured`}
    >
      {LANDING_SECTION_LABELS.map(({ key, label }) => {
        const done = Boolean(collected[key]?.trim());
        return (
          <span
            key={key}
            className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${
              done
                ? "border-[#C0E0D8] bg-[#F0FAF7] text-[var(--primary)]"
                : "border-[var(--border)] bg-white text-[var(--placeholder)]"
            }`}
          >
            {label}
          </span>
        );
      })}
    </div>
  );
}
