import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL_CONTACT_EMAIL } from "@/lib/legal-links";

export const metadata = {
  title: "Terms of Service — Meto",
  description: "Terms for using Meto.",
};

export default function TermsPage() {
  return (
    <LegalPageShell
      title="Terms of Service"
      updated="June 6, 2026"
      intro="By using Meto, you agree to these terms. If you do not agree, please do not use the service."
      sections={[
        {
          title: "The service",
          paragraphs: [
            "Meto provides tools to create and manage a personal AI profile and share context with AI tools you use.",
            "Features may change over time. We may add, modify, or remove functionality as the product evolves.",
          ],
        },
        {
          title: "Your account",
          paragraphs: [
            "You are responsible for your account credentials and for activity under your account.",
            "You must provide accurate information and keep your account secure.",
          ],
        },
        {
          title: "Your content",
          paragraphs: [
            "You retain ownership of content you submit to Meto.",
            "You grant Meto a limited license to host, process, and display your content solely to operate the service.",
            "You are responsible for ensuring you have the right to share any content you upload or publish.",
          ],
        },
        {
          title: "Acceptable use",
          paragraphs: [
            "Do not use Meto for unlawful activity, harassment, spam, or attempts to compromise the service.",
            "Do not misuse AI features to generate harmful, deceptive, or infringing content.",
          ],
        },
        {
          title: "Paid plans",
          paragraphs: [
            "Paid subscriptions renew according to the billing terms shown at checkout unless canceled.",
            "Fees are non-refundable except where required by law.",
          ],
        },
        {
          title: "Disclaimer and liability",
          paragraphs: [
            "Meto is provided as is without warranties of any kind to the extent permitted by law.",
            "We are not liable for indirect or consequential damages arising from your use of the service.",
          ],
        },
        {
          title: "Contact",
          paragraphs: [`Questions about these terms: ${LEGAL_CONTACT_EMAIL}.`],
        },
      ]}
    />
  );
}
