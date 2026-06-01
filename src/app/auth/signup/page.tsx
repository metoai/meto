import { AuthLayout } from "@/components/auth/auth-layout";
import { SignupForm } from "./signup-form";

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
