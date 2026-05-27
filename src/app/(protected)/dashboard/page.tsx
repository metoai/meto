import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { userHasSections } from "@/lib/profile-sections";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
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

  return <DashboardClient />;
}
