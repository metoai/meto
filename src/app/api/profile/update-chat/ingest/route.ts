import { NextResponse } from "next/server";

export const runtime = "nodejs";
import { assertAiAccess, recordAiUsage } from "@/lib/ai-usage";
import { extractDocumentText } from "@/lib/document-extract";
import {
  DOCUMENT_IMPORT,
  type IngestedDocument,
} from "@/lib/document-import";
import { friendlyGeminiError } from "@/lib/gemini";
import { enforceRateLimit } from "@/lib/rate-limit";
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

    const limited = await enforceRateLimit(
      request,
      "update-chat-ingest",
      DOCUMENT_IMPORT.RATE_LIMIT,
      DOCUMENT_IMPORT.RATE_WINDOW_MS,
      user.id
    );
    if (limited) return limited;

    const aiAccess = await assertAiAccess(user.id, "quick_update");
    if (!aiAccess.ok) return aiAccess.response;

    const formData = await request.formData();
    const files = formData
      .getAll("files")
      .filter((entry): entry is File => entry instanceof File);

    if (!files.length) {
      return NextResponse.json(
        { error: "Attach at least one file." },
        { status: 400 }
      );
    }

    if (files.length > DOCUMENT_IMPORT.MAX_FILES) {
      return NextResponse.json(
        {
          error: `You can attach up to ${DOCUMENT_IMPORT.MAX_FILES} files at once.`,
        },
        { status: 400 }
      );
    }

    const extractedDocs = await Promise.all(
      files.map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        const extracted = await extractDocumentText(
          file.name,
          file.type,
          buffer
        );

        return {
          filename: extracted.filename,
          mimeType: extracted.mimeType,
          sizeBytes: extracted.sizeBytes,
          extractedChars: extracted.extractedChars,
          truncated: extracted.truncated,
          facts: extracted.facts.trim(),
          usedLlm: extracted.usedLlm,
        };
      })
    );

    if (extractedDocs.some((doc) => doc.usedLlm)) {
      await recordAiUsage(user.id, 1, aiAccess.row);
    }

    const documents: IngestedDocument[] = extractedDocs.map(({ usedLlm, ...doc }) => {
      void usedLlm;
      return doc;
    });

    return NextResponse.json({
      documents,
      privacyNote:
        "Files were processed in memory only and were not stored on our servers.",
    });
  } catch (error) {
    console.error("Document ingest error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : friendlyGeminiError(error),
      },
      { status: 500 }
    );
  }
}
