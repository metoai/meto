import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicProfileView } from "@/components/public-profile-view";
import { compileLocally } from "@/lib/compile-local";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: { username: string };
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const supabase = createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("username", params.username.toLowerCase())
    .maybeSingle();

  if (!profile) {
    return { title: "Profile not found — Meto" };
  }

  return {
    title: `${profile.display_name ?? profile.username} — Meto`,
    description: `AI identity profile for ${profile.display_name ?? profile.username}`,
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const username = params.username.toLowerCase();
  const supabase = createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("username", username)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const { data: sections } = await supabase
    .from("context_sections")
    .select("title, content")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("display_order", { ascending: true });

  const publicSections = sections ?? [];
  const compiled =
    publicSections.length > 0
      ? compileLocally("universal", publicSections)
      : "";

  return (
    <PublicProfileView
      displayName={profile.display_name ?? profile.username ?? username}
      username={profile.username ?? username}
      sections={publicSections}
      compiled={compiled}
    />
  );
}
