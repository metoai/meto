import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal-links";

export const metadata = {
  title: "Privacy Policy — Meto",
  description: "How Meto collects, uses, and protects your data.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell
      title="Privacy Policy"
      updated="June 6, 2026"
      intro="Meto helps you build an AI profile you control. This policy explains what we collect, why we collect it, and the choices you have."
      sections={[
        {
          title: "Information we collect",
          paragraphs: [
            "Account information such as your email when you sign up.",
            "Profile content you add or generate through Meto, including text you enter in onboarding or chat.",
            "Basic usage data such as pages visited and feature interactions to keep the service reliable.",
          ],
        },
        {
          title: "How we use information",
          paragraphs: [
            "To create, store, and sync your profile across the Meto product.",
            "To provide AI-assisted features you request, such as profile suggestions or gap fixes.",
            "To secure the service, prevent abuse, and improve performance.",
          ],
        },
        {
          title: "Sharing",
          paragraphs: [
            "We do not sell your personal information.",
            "We use infrastructure and AI providers to operate Meto. They process data only to provide the service on our behalf.",
            "If you publish a public profile, the information you choose to make public is visible to others.",
          ],
        },
        {
          title: "Retention and deletion",
          paragraphs: [
            "We keep your data while your account is active or as needed to provide the service.",
            "You can delete profile content from your dashboard. You may request account deletion by contacting us.",
          ],
        },
        {
          title: "Your rights",
          paragraphs: [
            "Depending on where you live, you may have rights to access, correct, export, or delete your personal data.",
            `Contact us at ${LEGAL_CONTACT_EMAIL} for privacy requests.`,
          ],
        },
      ]}
    />
  );
}
