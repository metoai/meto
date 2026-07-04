import { Suspense } from "react";
import { ProjectDetailClient } from "@/components/projects/project-detail-client";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <Suspense fallback={<div className="min-h-0 flex-1 bg-[var(--bg)]" />}>
      <ProjectDetailClient projectId={id} />
    </Suspense>
  );
}
