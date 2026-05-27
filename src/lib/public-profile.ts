import type { SupabaseClient } from "@supabase/supabase-js";
import { compileLocally } from "@/lib/compile-local";

const URL_REGEX = /https?:\/\/[^\s<>"{}|\\^`[\]]+/gi;

type RawProfileRow = {
  username: string | null;
  display_name: string | null;
};

export type RawPublicSection = {
  section_type: string;
  title: string;
  content: string;
};

export type PublicProfileLink = {
  label: string;
  url: string;
};

export type PublicProfileSection = {
  section_type: string;
  title: string;
  content: string;
};

/** Public-safe projection — never include private fields or internal IDs. */
export type PublicProfile = {
  username: string;
  name: string;
  headline: string | null;
  bio: string | null;
  skills: string[];
  links: PublicProfileLink[];
  avatar: string | null;
  aiSummary: string;
  sections: PublicProfileSection[];
  compiled: string;
  hasPublicContent: boolean;
};

export type PublicProfileApiResponse = {
  name: string;
  headline: string;
  bio: string;
  skills: string[];
  links: PublicProfileLink[];
  avatar: string;
};

export type AiProfileDocument = {
  name: string;
  username: string;
  summary: string;
  expertise: string[];
  links: PublicProfileLink[];
  profileUrl: string;
  contextUrl: string;
};

function sectionByType(
  sections: RawPublicSection[],
  type: string
): RawPublicSection | undefined {
  return sections.find((s) => s.section_type === type);
}

function firstLine(text: string): string {
  return text.split("\n").find((line) => line.trim().length > 0)?.trim() ?? "";
}

function parseSkills(content: string): string[] {
  return content
    .split(/[\n,;•·|]/)
    .map((item) => item.replace(/^[-*]\s*/, "").trim())
    .filter((item) => item.length > 0 && item.length < 80);
}

function extractLinks(sections: RawPublicSection[]): PublicProfileLink[] {
  const seen = new Set<string>();
  const links: PublicProfileLink[] = [];

  for (const section of sections) {
    const matches = section.content.match(URL_REGEX) ?? [];
    for (const match of matches) {
      const url = match.replace(/[.,;:!?)]+$/, "");
      if (seen.has(url)) continue;
      seen.add(url);
      links.push({ label: section.title, url });
    }
  }

  return links;
}

function buildAiSummary(
  name: string,
  bio: string | null,
  headline: string | null,
  skills: string[]
): string {
  const parts: string[] = [];

  if (headline) {
    parts.push(firstLine(headline));
  } else if (bio) {
    parts.push(firstLine(bio));
  }

  if (skills.length > 0) {
    parts.push(`Expertise includes ${skills.slice(0, 6).join(", ")}.`);
  }

  if (parts.length === 0) {
    return `${name} on Meto.`;
  }

  return parts.join(" ");
}

export function buildPublicProfile(
  username: string,
  profile: RawProfileRow,
  publicSections: RawPublicSection[]
): PublicProfile {
  const name = profile.display_name?.trim() || profile.username?.trim() || username;
  const about = sectionByType(publicSections, "about");
  const work = sectionByType(publicSections, "work");
  const skillsSection = sectionByType(publicSections, "skills");

  const bio = about?.content.trim() || null;
  const headline = work?.content.trim() ? firstLine(work.content) : null;
  const skills = skillsSection ? parseSkills(skillsSection.content) : [];
  const links = extractLinks(publicSections);

  const sections = publicSections.map(({ section_type, title, content }) => ({
    section_type,
    title,
    content,
  }));
  const compiled =
    sections.length > 0 ? compileLocally("universal", sections) : "";
  const aiSummary = buildAiSummary(name, bio, headline, skills);

  return {
    username,
    name,
    headline,
    bio,
    skills,
    links,
    avatar: null,
    aiSummary,
    sections,
    compiled,
    hasPublicContent: sections.length > 0,
  };
}

export function toPublicProfileApiResponse(
  profile: PublicProfile
): PublicProfileApiResponse {
  return {
    name: profile.name,
    headline: profile.headline ?? "",
    bio: profile.bio ?? "",
    skills: profile.skills,
    links: profile.links,
    avatar: profile.avatar ?? "",
  };
}

export function toAiProfileDocument(
  profile: PublicProfile,
  siteUrl: string
): AiProfileDocument {
  const base = siteUrl.replace(/\/$/, "");

  return {
    name: profile.name,
    username: profile.username,
    summary: profile.aiSummary,
    expertise: profile.skills,
    links: profile.links,
    profileUrl: `${base}/profile/${profile.username}`,
    contextUrl: `${base}/.well-known/ai-profile/${profile.username}.json`,
  };
}

export function buildPersonJsonLd(profile: PublicProfile, siteUrl: string) {
  const base = siteUrl.replace(/\/$/, "");
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: `${base}/profile/${profile.username}`,
  };

  const description = profile.bio ?? profile.aiSummary;
  if (description) {
    jsonLd.description = description;
  }

  if (profile.headline) {
    jsonLd.jobTitle = profile.headline;
  }

  if (profile.skills.length > 0) {
    jsonLd.knowsAbout = profile.skills;
  }

  if (profile.links.length > 0) {
    jsonLd.sameAs = profile.links.map((link) => link.url);
  }

  return jsonLd;
}

export async function fetchPublicProfileByUsername(
  supabase: SupabaseClient,
  username: string
): Promise<PublicProfile | null> {
  const normalized = username.toLowerCase();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, username, display_name")
    .eq("username", normalized)
    .maybeSingle();

  if (!profile) {
    return null;
  }

  const { data: sections } = await supabase
    .from("context_sections")
    .select("section_type, title, content")
    .eq("user_id", profile.id)
    .eq("is_public", true)
    .order("display_order", { ascending: true });

  return buildPublicProfile(
    profile.username ?? normalized,
    profile,
    sections ?? []
  );
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
