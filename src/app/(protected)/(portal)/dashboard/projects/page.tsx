import { Suspense } from "react";
import { ProjectsPageClient } from "@/components/projects/projects-page-client";

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[var(--bg)]" />}>
      <ProjectsPageClient />
    </Suspense>
  );
}
