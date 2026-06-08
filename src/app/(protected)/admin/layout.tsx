import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-layout";
import { requireAdminSession } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin — Meto",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdminSession();

  if (!session) {
    redirect("/dashboard");
  }

  return <AdminShell adminEmail={session.email}>{children}</AdminShell>;
}
