"use client";

import { QuickUpdateChat } from "@/components/dashboard/quick-update-chat";

type UpdateContextCardProps = {
  embedded?: boolean;
  workspace?: boolean;
  onApplied?: () => void;
};

/** @deprecated Use QuickUpdateChat or the header Quick update sidebar instead. */
export function UpdateContextCard({
  embedded = false,
  workspace = false,
  onApplied,
}: UpdateContextCardProps) {
  const variant = embedded && workspace ? "compact" : "card";

  if (embedded) {
    return <QuickUpdateChat variant={variant} onApplied={onApplied} />;
  }

  return (
    <section
      id="workspace"
      className="landing-panel scroll-mt-16 w-full p-4 sm:p-5"
    >
      <QuickUpdateChat variant="card" onApplied={onApplied} />
    </section>
  );
}
