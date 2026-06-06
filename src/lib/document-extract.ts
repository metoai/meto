import { GoogleGenerativeAI } from "@google/generative-ai";
import mammoth from "mammoth";
import {
  DOCUMENT_IMPORT,
  extensionFromFilename,
  isAllowedDocumentFilename,
  isAllowedDocumentMime,
} from "@/lib/document-import";

const PDF_EXTRACT_PROMPT = `Extract ALL readable text from this document. Return plain text only — no commentary, no markdown fences. Preserve structure with newlines where helpful.`;

const MIN_PDF_TEXT_CHARS = 40;

function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY?.trim() || "";
}

function truncateText(text: string): { text: string; truncated: boolean } {
  if (text.length <= DOCUMENT_IMPORT.MAX_EXTRACTED_CHARS) {
    return { text, truncated: false };
  }
  return {
    text: text.slice(0, DOCUMENT_IMPORT.MAX_EXTRACTED_CHARS),
    truncated: true,
  };
}

async function extractPdfTextWithGemini(buffer: Buffer): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error(
      "This PDF looks scanned or image-only. Export as .docx or .txt, or set GEMINI_API_KEY for OCR fallback."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash",
    generationConfig: { temperature: 0 },
  });

  const result = await model.generateContent([
    {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: "application/pdf",
      },
    },
    { text: PDF_EXTRACT_PROMPT },
  ]);

  const text = result.response.text()?.trim();
  if (!text) {
    throw new Error("Could not extract text from this PDF.");
  }
  return text;
}

async function extractPdfTextLocally(buffer: Buffer): Promise<string | null> {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });

  try {
    const result = await parser.getText();
    const text = result.text?.trim() ?? "";
    return text.length > 0 ? text : null;
  } finally {
    await parser.destroy();
  }
}

async function extractPdfText(buffer: Buffer): Promise<string> {
  try {
    const localText = await extractPdfTextLocally(buffer);
    if (localText && localText.length >= MIN_PDF_TEXT_CHARS) {
      return localText;
    }

    if (localText) {
      return localText;
    }
  } catch (error) {
    console.error("Local PDF parse failed:", error);
  }

  return extractPdfTextWithGemini(buffer);
}

async function extractDocxText(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  const text = result.value?.trim();
  if (!text) {
    throw new Error("Could not extract text from this Word document.");
  }
  return text;
}

function extractPlainText(buffer: Buffer): string {
  const text = buffer.toString("utf8").replace(/\u0000/g, "").trim();
  if (!text) {
    throw new Error("This file appears to be empty.");
  }
  return text;
}

export type ExtractedDocument = {
  filename: string;
  mimeType: string;
  sizeBytes: number;
  rawText: string;
  extractedChars: number;
  truncated: boolean;
};

export async function extractDocumentText(
  filename: string,
  mimeType: string,
  buffer: Buffer
): Promise<ExtractedDocument> {
  if (!isAllowedDocumentFilename(filename)) {
    throw new Error(
      "Unsupported file type. Use PDF, DOCX, TXT, MD, CSV, or RTF."
    );
  }

  if (!isAllowedDocumentMime(filename, mimeType)) {
    throw new Error(`Unsupported MIME type for ${filename}.`);
  }

  if (buffer.byteLength > DOCUMENT_IMPORT.MAX_FILE_BYTES) {
    throw new Error(
      `File too large (max ${DOCUMENT_IMPORT.MAX_FILE_BYTES / (1024 * 1024)} MB).`
    );
  }

  const ext = extensionFromFilename(filename);
  let rawText: string;

  if (ext === "pdf") {
    rawText = await extractPdfText(buffer);
  } else if (ext === "docx") {
    rawText = await extractDocxText(buffer);
  } else if (ext === "doc") {
    throw new Error(
      "Legacy .doc files are not supported. Save as .docx or PDF and try again."
    );
  } else {
    rawText = extractPlainText(buffer);
  }

  const { text, truncated } = truncateText(rawText);

  return {
    filename,
    mimeType: mimeType || "application/octet-stream",
    sizeBytes: buffer.byteLength,
    rawText: text,
    extractedChars: text.length,
    truncated,
  };
}
