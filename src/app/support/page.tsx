import type { Metadata } from "next";
import { SupportPageClient } from "@/components/support/support-page-client";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Support & Community — Meto AI",
  description:
    "Get help with Meto Model Context Protocol (MCP), CLI rule sync, or send a direct inquiry to the founder. Fast developer-to-developer support.",
  alternates: {
    canonical: `${getSiteUrl()}/support`,
  },
  openGraph: {
    title: "Support & Community — Meto AI",
    description:
      "Get help with Meto Model Context Protocol (MCP), CLI rule sync, or send a direct inquiry to the founder.",
    url: `${getSiteUrl()}/support`,
    type: "website",
  },
};

export default function SupportPage() {
  return <SupportPageClient />;
}
