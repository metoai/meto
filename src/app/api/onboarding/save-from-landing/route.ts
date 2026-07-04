import { NextResponse } from "next/server";
import {
  mergeProfileSectionUpdates,
  saveProfileSections,
  userHasSections,
} from "@/lib/profile-sections";
import { syncOnboardingToKnowledge } from "@/lib/knowledge/onboarding-sync";
import { createClient } from "@/lib/supabase/server";

type CollectedProfile = {
  about?: string | null;
  work?: string | null;
  projects?: string | null;
  goals?: string | null;
};

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { collected } = (await request.json()) as {
      collected?: CollectedProfile;
    };

    if (!collected) {
      return NextResponse.json(
        { error: "Collected profile data is required." },
        { status: 400 }
      );
    }

    const sections: Record<string, string> = {};
    for (const key of ["about", "work", "projects", "goals"] as const) {
      const value = collected[key];
      if (typeof value === "string" && value.trim()) {
        sections[key] = value.trim();
      }
    }

    if (Object.keys(sections).length === 0) {
      return NextResponse.json(
        { error: "No profile content to save." },
        { status: 400 }
      );
    }

    const alreadyHasSections = await userHasSections(supabase, user.id);

    if (alreadyHasSections) {
      await mergeProfileSectionUpdates(supabase, user.id, sections);
      await syncOnboardingToKnowledge(supabase, user.id, sections, "landing");
      return NextResponse.json({ success: true, merged: true });
    }

    await saveProfileSections(supabase, user.id, sections);
    await syncOnboardingToKnowledge(supabase, user.id, sections, "landing");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Save from landing error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to save profile from landing.",
      },
      { status: 500 }
    );
  }
}
