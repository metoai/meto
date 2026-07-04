import { compileLocally } from "@/lib/compile-local";
import type { CompileFormat } from "@/lib/types";

type SectionRow = {
  section_type: string;
  title: string;
  content: string;
};

export function generateCompileFromSections(
  format: CompileFormat,
  sections: SectionRow[]
): string {
  return compileLocally(format, sections);
}
