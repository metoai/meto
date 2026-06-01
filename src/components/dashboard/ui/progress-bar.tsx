export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const color =
    clamped >= 60 ? "#0F6E56" : clamped >= 30 ? "#B45309" : "#DC2626";

  return (
    <div>
      {label ? (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-[#6B6B63]">{label}</span>
          <span className="text-sm tabular-nums text-[#1A1A18]">{clamped}%</span>
        </div>
      ) : null}
      <div className="h-1.5 overflow-hidden rounded-full bg-[#F7F7F5]">
        <div
          className="h-full rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${clamped}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}
