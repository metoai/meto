import { redirect } from "next/navigation";
import { PortalGroupLayoutClient } from "@/components/portal/portal-group-layout-client";
import { loadPortalBootstrap } from "@/lib/portal-bootstrap";
import { createClient } from "@/lib/supabase/server";

export default async function PortalGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const initialData = await loadPortalBootstrap(user.id, user.email ?? "");

  return (
    <PortalGroupLayoutClient initialData={initialData}>
      {children}
    </PortalGroupLayoutClient>
  );
}
