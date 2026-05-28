import { redirect } from "next/navigation";
import { userHasSections } from "@/lib/profile-sections";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
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

  const hasSections = await userHasSections(supabase, user.id);

  if (!hasSections) {
    redirect("/onboarding");
  }

  return children;
}
