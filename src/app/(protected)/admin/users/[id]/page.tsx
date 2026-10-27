import { AdminUserDetailClient } from "@/components/admin/admin-user-detail-client";

type PageProps = {
  params: Promise<{ id: string }> | { id: string };
};

export default async function AdminUserDetailPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  return <AdminUserDetailClient userId={resolvedParams.id} />;
}
