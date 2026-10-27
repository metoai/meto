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
