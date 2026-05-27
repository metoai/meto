import { redirect } from "next/navigation";
import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { userHasSections } from "@/lib/profile-sections";
import { createClient } from "@/lib/supabase/server";

export default async function OnboardingPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const hasSections = await userHasSections(supabase, user.id);

  if (hasSections) {
    redirect("/dashboard");
  }

  return <OnboardingFlow />;
}
