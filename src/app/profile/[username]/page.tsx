import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/public-profile-view";
import {
  buildPersonJsonLd,
  fetchPublicProfileByUsername,
} from "@/lib/public-profile";
import {
  getAiProfileJsonUrl,
  getPublicContextUrl,
  getPublicProfileUrl,
  getSiteUrl,
} from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: { username: string };
};

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const publicProfile = await fetchPublicProfileByUsername(
    supabase,
    params.username
  );

  if (!publicProfile) {
    return { title: "Profile not found — Meto" };
  }

  const profileUrl = getPublicProfileUrl(publicProfile.username);
  const contextUrl = getPublicContextUrl(publicProfile.username);
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
    },
    twitter: {
      card: "summary",
      title: `${publicProfile.name} — Meto`,
      description,
    },
    alternates: {
      canonical: profileUrl,
      types: {
        "text/plain": contextUrl,
        "application/json": getAiProfileJsonUrl(publicProfile.username),
      },
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const supabase = createClient();
  const publicProfile = await fetchPublicProfileByUsername(
    supabase,
    params.username
  );

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
