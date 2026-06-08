export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const color =
    clamped >= 60 ? "var(--primary)" : clamped >= 30 ? "#B45309" : "#DC2626";

  return (
    <div>
      {label ? (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">{label}</span>
          <span className="text-sm tabular-nums text-[var(--text)]">{clamped}%</span>
        </div>
      ) : null}
      <div className="h-1.5 overflow-hidden rounded-full bg-[var(--surface)]">
        <div
          className="h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
