import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
