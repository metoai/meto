import { ThemeToggle } from "@/components/theme-toggle";

export function LandingTopActions() {
  return (
    <div className="fixed right-5 top-5 z-50">
      <ThemeToggle compact />
    </div>
  );
}
