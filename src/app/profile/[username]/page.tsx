import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/public-profile-view";
import {
  buildPersonJsonLd,
  fetchPublicProfileByUsername,
} from "@/lib/public-profile";
import {
  getAiProfileJsonUrl,
  getPublicContextApiUrl,
  getPublicContextUrl,
  getPublicProfileUrl,
  getSiteUrl,
} from "@/lib/site";

type PageProps = {
  params: { username: string };
};

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const publicProfile = await fetchPublicProfileByUsername(params.username);

  if (!publicProfile) {
    return { title: "Profile not found — Meto" };
  }

  const profileUrl = getPublicProfileUrl(publicProfile.username);
  const contextUrl = getPublicContextApiUrl(publicProfile.username);
  const legacyContextUrl = getPublicContextUrl(publicProfile.username);
  const description = publicProfile.hasPublicContent
    ? publicProfile.compiled.slice(0, 300) || publicProfile.aiSummary
    : `${publicProfile.name} on Meto — no public profile sections yet.`;

  return {
    title: `${publicProfile.name} — Meto`,
    description,
    openGraph: {
      title: `${publicProfile.name} — Meto`,
      description,
      url: profileUrl,
      type: "profile",
      siteName: "Meto",
      images: [
        {
          url: `${getSiteUrl()}/api/og/card?username=${encodeURIComponent(publicProfile.username)}`,
          width: 1200,
          height: 630,
          alt: `${publicProfile.name}'s AI identity profile`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${publicProfile.name} — Meto`,
      description,
      images: [`${getSiteUrl()}/api/og/card?username=${encodeURIComponent(publicProfile.username)}`],
    },
    robots: { index: true, follow: true },
    alternates: {
      canonical: profileUrl,
      types: {
        "text/plain": contextUrl,
        "application/json": getAiProfileJsonUrl(publicProfile.username),
      },
    },
    other: {
      "meto:context-api": contextUrl,
      "meto:context-legacy": legacyContextUrl,
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const publicProfile = await fetchPublicProfileByUsername(params.username);

  if (!publicProfile) {
    notFound();
  }

  const jsonLd = buildPersonJsonLd(publicProfile, getSiteUrl());

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicProfileView profile={publicProfile} />
    </>
  );
}
