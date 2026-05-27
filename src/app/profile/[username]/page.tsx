import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/public-profile-view";
import {
  buildPersonJsonLd,
  fetchPublicProfileByUsername,
  getSiteUrl,
} from "@/lib/public-profile";
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

  const siteUrl = getSiteUrl();
  const profileUrl = `${siteUrl}/profile/${publicProfile.username}`;
  const description = publicProfile.hasPublicContent
    ? publicProfile.aiSummary
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
      types: {
        "application/json": `${siteUrl}/.well-known/ai-profile/${publicProfile.username}.json`,
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
