import { NextResponse } from "next/server";
import {
  BRAIN_DUMP_PROMPT,
  friendlyGeminiError,
  generateWithGemini,
  parseJsonFromGemini,
} from "@/lib/gemini";
import { assertAiAccess, recordAiUsage } from "@/lib/ai-usage";
import { upgradeRequiredResponse } from "@/lib/billing-errors";
import {
  getEntitlementsForUser,
  markOnboardingAiUsed,
} from "@/lib/billing-profile";
import { saveProfileSections } from "@/lib/profile-sections";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const entitlements = await getEntitlementsForUser(user.id);
    if (!entitlements.canRedoOnboardingAi) {
      return upgradeRequiredResponse("onboarding_ai");
    }

    const aiAccess = await assertAiAccess(user.id, "onboarding_ai");
    if (!aiAccess.ok) return aiAccess.response;

    const { rawText } = await request.json();

    if (!rawText?.trim()) {
      return NextResponse.json(
        { error: "Please provide some text about yourself." },
        { status: 400 }
      );
    }

    const text = await generateWithGemini(
      `${BRAIN_DUMP_PROMPT}\n\n${rawText.trim()}`,
      { temperature: 0.3 }
    );
    const sections = parseJsonFromGemini(text);

    await saveProfileSections(supabase, user.id, sections);
    await markOnboardingAiUsed(user.id, "brain_dump");
    await recordAiUsage(user.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Brain dump error:", error);
    return NextResponse.json(
      { error: friendlyGeminiError(error) },
      { status: 500 }
    );
  }
}
