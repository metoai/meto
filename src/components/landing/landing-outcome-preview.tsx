import {
  countFilledSections,
  LANDING_SECTION_LABELS,
  type CollectedProfile,
} from "@/lib/landing-chat";
import { SITE_DOMAIN } from "@/lib/site";

type LandingOutcomePreviewProps = {
  collected: CollectedProfile;
  profileReady: boolean;
  chatStarted: boolean;
};

function PreviewField({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  const filled = Boolean(value?.trim());

  return (
    <div
      className={`rounded-lg border px-3 py-2.5 transition-all duration-500 ${
        filled
          ? "border-[var(--accent-border)] bg-[var(--card)] landing-animate-in"
          : "border-dashed border-[var(--border)] bg-[var(--surface)]/40"
      }`}
    >
      <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
        {label}
      </p>
      {filled ? (
        <p className="line-clamp-2 text-[12px] leading-snug text-[var(--text)]">
          {value}
        </p>
      ) : (
        <p className="text-[12px] text-[var(--placeholder)]">Builds as you chat</p>
      )}
    </div>
  );
}

export function LandingOutcomePreview({
  collected,
  profileReady,
  chatStarted,
}: LandingOutcomePreviewProps) {
  const filled = countFilledSections(collected);
  const progress = Math.round((filled / LANDING_SECTION_LABELS.length) * 100);

  return (
    <div className="landing-animate-in flex flex-col gap-4">
      <div className="hidden text-left lg:block">
        <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
          Live preview
        </p>
        <p className="text-[14px] font-medium text-[var(--text)]">
          Your portable understanding
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-[var(--text-secondary)]">
          {chatStarted
            ? "Updates as Meto learns about you."
            : "Appears here in real time."}
        </p>
      </div>

      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3.5 shadow-[var(--shadow-sm)] sm:p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium text-[var(--text)]">Your profile</p>
            <p className="text-[10px] text-[var(--muted)]">Structured from chat</p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-medium transition-colors duration-300 ${
              profileReady
                ? "bg-[var(--primary-light)] text-[var(--primary)]"
                : filled > 0
                  ? "bg-[var(--surface)] text-[var(--text-secondary)]"
                  : "bg-[var(--surface)] text-[var(--muted)]"
            }`}
          >
            {profileReady ? "Ready" : `${progress}%`}
          </span>
        </div>

        <div className="mb-3 h-1 overflow-hidden rounded-full bg-[var(--surface)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-700 ease-out"
            style={{ width: `${Math.max(progress, chatStarted ? 8 : 4)}%` }}
          />
        </div>

        <div className="space-y-2">
          {LANDING_SECTION_LABELS.map(({ key, label }) => (
            <PreviewField key={key} label={label} value={collected[key]} />
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)]/50 px-3.5 py-3">
        <p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.08em] text-[var(--muted)]">
          Share link
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-2">
          <span className="font-mono-brand truncate text-[11px] text-[var(--text-secondary)]">
            {profileReady
              ? `${SITE_DOMAIN}/profile/you`
              : `${SITE_DOMAIN}/profile/...`}
          </span>
          <span className="ml-auto shrink-0 text-[10px] text-[var(--primary)]">
            {profileReady ? "Live" : "Soon"}
          </span>
        </div>
      </div>
    </div>
  );
}
