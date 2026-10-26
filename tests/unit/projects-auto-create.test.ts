import { describe, it, expect } from "vitest";
import {
  cleanProjectName,
  isValidProjectName,
  parseProjectEntries,
} from "@/lib/projects/auto-create";
import { slugifyProjectName } from "@/lib/projects/types";

describe("projects-auto-create", () => {
  it("slugifies project names properly", () => {
    expect(slugifyProjectName("Meto AI Identity")).toBe("meto-ai-identity");
    expect(slugifyProjectName("Project (v2.0)!")).toBe("project-v2-0");
    expect(slugifyProjectName("")).toBe("");
  });

  it("cleans and validates project names", () => {
    expect(isValidProjectName("Meto")).toBe(true);
    expect(isValidProjectName("Vouchy Platform")).toBe(true);
    expect(isValidProjectName("a")).toBe(false);
    expect(isValidProjectName("project")).toBe(false);
    expect(isValidProjectName("something")).toBe(false);
  });

  it("parses project entries from markdown sections", () => {
    const markdown = `
- **Meto**: Personal AI identity engine for developer tools and agents.
- **Akaki Inspection**: Inspection reporting and analytics portal for subcity administrators.
    `.trim();

    const drafts = parseProjectEntries(markdown);
    expect(drafts.length).toBe(2);
    expect(drafts[0].name).toBe("Meto");
    expect(drafts[0].description).toContain("Personal AI identity engine");
    expect(drafts[1].name).toBe("Akaki Inspection");
  });
});
