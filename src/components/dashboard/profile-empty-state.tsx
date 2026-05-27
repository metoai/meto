"use client";

import Link from "next/link";
import { MetoMark } from "@/components/meto-mark";

export function ProfileEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center">
      <MetoMark className="mb-4 h-10 w-10" />
      <p className="text-base font-semibold text-[var(--color-text)]">
        Your profile is empty
      </p>
      <p className="mt-1 max-w-sm text-sm text-[var(--color-muted)]">
        Go to Workspace to tell Meto about yourself.
      </p>
      <Link
        href="/dashboard#workspace"
        className="mt-5 rounded-full bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-[var(--color-accent)]"
      >
        Go to Workspace
      </Link>
    </div>
  );
}
