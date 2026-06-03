import { NextResponse } from "next/server";
import { buildContextText, resolveSelectedSectionTypes } from "@/lib/context-templates";
import type { CompileFormat } from "@/lib/types";
import { fetchPublicProfileByUsername } from "@/lib/public-profile";
import { getPublicContextUrl } from "@/lib/site";
import { createClient } from "@/lib/supabase/server";

type RouteContext = {
  params: { username: string };
};

const VALID_FORMATS: CompileFormat[] = [
  "universal",
  "claude",
  "chatgpt",
  "gemini",
];

export const revalidate = 60;

export async function GET(request: Request, { params }: RouteContext) {
  try {
    const username = params.username.toLowerCase();
    const { searchParams } = new URL(request.url);
    const sectionsParam = searchParams.get("sections");
    const presetParam = searchParams.get("preset");
    const formatParam = searchParams.get("format") ?? "universal";

    const format = VALID_FORMATS.includes(formatParam as CompileFormat)
      ? (formatParam as CompileFormat)
      : "universal";

    const supabase = createClient();
    const publicProfile = await fetchPublicProfileByUsername(supabase, username);

    if (!publicProfile) {
      return new NextResponse("Profile not found.", { status: 404 });
    }

    if (!publicProfile.hasPublicContent) {
      return new NextResponse("This profile has no public sections.", {
        status: 404,
      });
    }

    const availableTypes = publicProfile.sections.map(
      (section) => section.section_type
    );
    const requestedSections = sectionsParam
      ? sectionsParam.split(",").map((section) => section.trim())
      : null;

    const selectedTypes = resolveSelectedSectionTypes(availableTypes, {
      sections: requestedSections,
      preset: presetParam,
    });

    const text = buildContextText(
      publicProfile.sections,
      selectedTypes,
      format,
      publicProfile.username,
      publicProfile.name
    );

    if (!text) {
      return new NextResponse("No matching public sections for this request.", {
        status: 404,
      });
    }

    return new NextResponse(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        Link: `<${getPublicContextUrl(username)}>; rel="canonical"`,
      },
    });
  } catch (error) {
    console.error("GET profile context error:", error);
    return new NextResponse("Failed to load profile context.", { status: 500 });
  }
}
