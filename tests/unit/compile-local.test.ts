import { describe, it, expect } from "vitest";
import { compileLocally } from "@/lib/compile-local";
import type { CompileFormat } from "@/lib/types";

describe("compileLocally", () => {
  const mockSections = [
    { title: "About", content: "Senior Fullstack Engineer based in Addis Ababa." },
    { title: "Work", content: "Building AI Identity Infrastructure at Meto." },
  ];

  const allFormats: CompileFormat[] = [
    "universal",
    "chatgpt",
    "claude",
    "gemini",
    "deepseek",
    "grok",
    "kimi",
    "qwen",
  ];

  allFormats.forEach((format) => {
    it(`should successfully compile for format: ${format}`, () => {
      const output = compileLocally(format, mockSections);
      expect(output).toBeTruthy();
      expect(output).toContain("Senior Fullstack Engineer");
      expect(output).toContain("Building AI Identity Infrastructure");
    });
  });

  it("handles empty sections gracefully", () => {
    const output = compileLocally("universal", []);
    expect(output).toBeTruthy();
    expect(output).toContain("Context about me");
  });
});
