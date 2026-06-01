import { Suspense } from "react";
import { DashboardPageClient } from "@/components/dashboard/dashboard-page-client";

export default function DashboardIndexPage() {
  return (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[var(--bg)]" />}>
      <DashboardPageClient />
    </Suspense>
  );
}
