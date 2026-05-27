import { NextResponse } from "next/server";
import {
  buildContextText,
  resolveSelectedSectionTypes,
} from "@/lib/context-templates";
import type { CompileFormat } from "@/lib/types";
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .eq("username", username)
      .maybeSingle();

    if (!profile) {
      return new NextResponse("Profile not found.", { status: 404 });
    }

    const { data: sections } = await supabase
      .from("context_sections")
      .select("section_type, title, content")
      .eq("user_id", profile.id)
      .eq("is_public", true)
      .order("display_order", { ascending: true });

    const publicSections = sections ?? [];

    if (publicSections.length === 0) {
      return new NextResponse("This profile has no public sections.", {
        status: 404,
      });
    }

    const availableTypes = publicSections.map((section) => section.section_type);
    const requestedSections = sectionsParam
      ? sectionsParam.split(",").map((section) => section.trim())
      : null;

    const selectedTypes = resolveSelectedSectionTypes(availableTypes, {
      sections: requestedSections,
      preset: presetParam,
    });

    const displayName =
      profile.display_name?.trim() || profile.username || username;

    const text = buildContextText(
      publicSections,
      selectedTypes,
      format,
      profile.username ?? username,
      displayName
    );

    if (!text) {
      return new NextResponse("No matching public sections for this request.", {
        status: 404,
      });
    }

    return new NextResponse(text, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("GET profile context error:", error);
    return new NextResponse("Failed to load profile context.", { status: 500 });
  }
}
