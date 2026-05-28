import { Suspense } from "react";
import { UpdatePageClient } from "@/components/dashboard/update-page-client";

export default function UpdatePage() {
  return (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[var(--bg)]" />}>
      <UpdatePageClient />
    </Suspense>
  );
}
