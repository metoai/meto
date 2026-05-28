import { Suspense } from "react";
import { ProfilePageClient } from "@/components/dashboard/profile-page-client";

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[var(--bg)]" />}>
      <ProfilePageClient />
    </Suspense>
  );
}
