import { redirect } from "next/navigation";
import { PricingIntentFulfillment } from "@/components/billing/pricing-intent-fulfillment";
import { createClient } from "@/lib/supabase/server";

export default async function ProtectedLayout({
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

  return (
    <>
      <PricingIntentFulfillment />
      {children}
    </>
  );
}
