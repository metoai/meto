import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal-links";

export const metadata = {
  title: "Cookie Policy — Meto",
  description: "How Meto uses cookies and similar technologies.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell
      title="Cookie Policy"
      updated="June 6, 2026"
      intro="Meto uses cookies and similar technologies to keep you signed in, remember preferences, and understand how the product is used."
      sections={[
        {
          title: "What we use",
          paragraphs: [
            "Essential cookies for authentication and security.",
            "Preference cookies such as theme selection.",
            "Analytics cookies to measure usage and improve the product.",
          ],
        },
        {
          title: "Third parties",
          paragraphs: [
            "Some cookies may be set by providers that help us run authentication, payments, or analytics (including PostHog for product analytics).",
            "Those providers process data according to their own policies.",
          ],
        },
        {
          title: "Your choices",
          paragraphs: [
            "You can control cookies through your browser settings. Blocking essential cookies may prevent parts of Meto from working.",
            "Where required, we will ask for consent before using non-essential cookies.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [`Questions: ${LEGAL_CONTACT_EMAIL}.`],
        },
      ]}
    />
  );
}
