import { Suspense } from "react";
import { FixesPageClient } from "@/components/dashboard/fixes-page-client";

export default function FixesPage() {
  return (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[var(--bg)]" />}>
      <FixesPageClient />
    </Suspense>
  );
}
