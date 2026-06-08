import { AdminUserDetailClient } from "@/components/admin/admin-user-detail-client";

type PageProps = {
  params: { id: string };
};

export default function AdminUserDetailPage({ params }: PageProps) {
  return <AdminUserDetailClient userId={params.id} />;
}
