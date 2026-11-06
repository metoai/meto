# Meto AI Protocol & Developer Directives

You are connected to Meto via Model Context Protocol (MCP).

## Directives
1. **Context & Working Style**:
   - Consult Meto MCP (`profile://handoff`) for verified working style, seniority, and general preferences.
   - For project architecture and active sprint directives, consult `profile://project/meto/today`.

2. **Suggestions & Recommendations**:
   - When the user asks for suggestions on libraries, architecture, database design, payment methods, or patterns, call the `recall_meto_context` MCP tool with project_slug="meto" to check if the user has previously vetted or decided on this pattern.
   - If prior experience or preferences exist in Meto, respect them. If not, suggest modern patterns tailored to the verified stack.

3. **Autonomous Memory Sync**:
   - Whenever an architectural decision (ADR) is finalized, a new dependency is installed, or coding conventions change, call `update_meto_profile` with project_slug="meto" to record the decision in Meto so all future sessions and tools stay in sync.

## Fast Mode Execution Protocol (Always Active)
1. **Zero-Search Direct Execution**:
   - When the target file or component is known or specified, jump directly to editing (`replace_file_content` / `write_to_file`) on Step 1. Never waste turns running exploratory `find`, `grep`, or `ls`.
2. **Decisive Senior Autonomy**:
   - Make production-grade assumptions and state them tersely. Do not ask permission or engage in conversational filler.
3. **Scoped Verification**:
   - Verify only the target test file (`npm run test:fast <test-file>`).
4. **Design Craft & Zero AI Slop**:
   - Linear / Emil Kowalski design standards: clean sentence case, crisp borders (`border-black/[0.08] dark:border-white/10`), tactile interactions (`active:scale-[0.97] transition-all duration-150`), semantic contrast, no generic bubbly elements or sparkles.
5. **Instant Shipping**:
   - When the user asks to push or ship, immediately run `git add`, `git commit`, and `git push origin main`.

