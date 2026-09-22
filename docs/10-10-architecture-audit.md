# Meto AI Identity Engine — 10/10 Architecture Audit

> **Phase 0 — Repository Forensics**
> **Target:** Identify weaknesses preventing the codebase from reaching production-grade "10/10" engineering quality.

---

## A. Current Architecture
Meto is built on Next.js, TypeScript, and Supabase. It uses DeepSeek (primary) and Gemini (fallback) for AI extraction and organization. The context is stored in structured tables (`context_sections`, `profiles`, `projects`) and compiled locally (without LLM) into a cached representation in `compiled_profiles`. The MCP server is exposed both over HTTP (`/api/mcp/[username]`) and via a local CLI over stdio. The CLI (`@metoai/cli`) synchronizes user configurations to various IDE rule files. A V2 Knowledge Graph layer exists behind feature flags.

---

## B. Architecture/Documentation Mismatches (CRITICAL)

- **CLI Authentication:** The architecture document states that for cloud HTTP MCP, the user generates an `mcp_access_token` from the dashboard. However, the CLI `login` command currently only prints a link and sets the state to `"pending_login"`. It does not perform a proper OAuth device flow or polling, nor does it fetch a cloud token. When the user subsequently runs `sync`, it merely regenerates local rule files without actually connecting to the cloud.
- **CLI Sync Safety:** The architecture strictly prohibits overwriting user-managed content blindly and emphasizes atomic writes. The actual CLI implementation uses `fs.writeFileSync(target.path, content)` which is non-atomic and will obliterate any existing custom content the user might have carefully curated in their `.cursorrules` or `.clinerules`.

---

## C. Performance Bottlenecks (HIGH)

- **Rate Limiting:** The `rate-limit.ts` file uses an in-memory `Map` as a fallback if the Upstash Redis URL is not configured or fails. In a serverless Next.js deployment, this provides zero actual distributed rate-limiting, risking runaway LLM costs under heavy load.
- **Context Rebuilding:** `rebuildCompiledContextCache` synchronously pulls all sections and builds the cache on every profile update, directly inline with the MCP tool call. While this currently avoids LLM calls, it may scale poorly as profile sizes grow.
- **Dual Writes (V2):** When `KNOWLEDGE_WRITE_ENABLED` is true, dual writes to the knowledge graph happen synchronously in the MCP route. This blocks the MCP response to the AI IDE.

---

## D. Security Risks (CRITICAL)

- **MCP Token Storage [CRITICAL]:** The `authenticateMcpRequest` queries `profiles` via `.eq("mcp_access_token", token)`. This indicates that the token is stored in plaintext in the database. If the database is compromised, all user MCP tokens are leaked. They must be hashed.
- **File System Overwrites [HIGH]:** The CLI blindly writes to various files across the file system (including `~/.meto/config.json` and `.cursorrules`), making it susceptible to accidental data destruction or symlink attacks if paths are manipulated.

---

## E. Reliability Risks (HIGH)

- **File System Atomicity:** The CLI writes files without using temporary files and atomic renames, risking corrupted empty files if the process crashes mid-write.
- **Concurrent DB Updates:** In `mergeProfileSectionUpdates`, sections are fetched, and then iterating over LLM updates performs subsequent `update` and `insert` statements. Without database-level locking or transactions, concurrent updates to the same section type from multiple MCP calls (or browser tabs) could cause data races and duplicate custom sections.

---

## F. Data Consistency Risks (HIGH)

- **Unawaited/Unsafe Async Boundaries:** Inside `mergeFactIntoProfileWithLlm`, the call to `autoCreateProjectsFromDeveloperUpdate` is in a try/catch, and `dualWriteSectionUpdates` is also in a try/catch. If they fail, the error is swallowed and logged, causing the secondary derived representations (knowledge graph, project list) to drift from the canonical `context_sections` data.
- **Missing Versioning:** There is no explicit `context_version` token/hash saved on the canonical data that links the `compiled_profiles` cache to a specific exact state of the `context_sections`. 

---

## G. MCP Risks (HIGH)

- **Token Storage:** (See Security Risks).
- **Idempotency:** Tools like `update_meto_profile` process the LLM extraction immediately and apply changes. If a client retries due to a network timeout, the exact same fact might be processed twice, potentially resulting in duplicated information or redundant LLM calls.

---

## H. CLI Risks (HIGH)

- **Loss of User Data:** CLI `sync` unconditionally overwrites rule files.
- **Auth Flow Incomplete:** The CLI lacks a proper background polling mechanism to retrieve the access token securely.

---

## I. LLM Risks (MEDIUM)

- **Fragile Parsing:** The LLM response for profile updates is parsed via a regex replacing markdown fences (`parseJsonSafely` / `parseJsonFromText`). If the LLM produces slightly malformed JSON, the entire update is discarded, and there is no fallback to ask the LLM to correct itself.
- **Timeout Management:** The 60-second absolute timeout in `llm.ts` applies to both DeepSeek and Gemini. If DeepSeek times out at 59 seconds, the Gemini fallback is not executed properly.

---

## J. Caching Risks (MEDIUM)

- **Cache Upsert Wins:** `compiled_profiles` is upserted based on `user_id` and `format`. Under concurrent load, the last upsert wins, which may not correspond to the latest chronological change in the `context_sections` table. 

---

## K. Knowledge-layer Risks (MEDIUM)

- **Synchronous Write Penalty:** The dual write to the knowledge graph happens inline with the MCP response, adding latency to the user's IDE operations when V2 is fully enabled.

---

## L. Observability Gaps (HIGH)

- **Lack of Structured Logging:** Errors in critical paths (like `MCP auto-create projects failed` or LLM failures) are merely sent to `console.error` without request correlation IDs, latency tracking, or payload context.
- **No Diagnostics:** It is impossible to reliably track the latency of a single end-to-end MCP write operation versus the LLM generation time inside it.

---

## M. Testing gaps (CRITICAL)

- **No Automated Tests:** A search across the repository reveals no unit tests (`.test.ts` or `.spec.ts`), integration tests, or E2E tests for the core context compilation, RLS, or CLI behavior. This makes every architectural change incredibly risky.

---

## N. Migration Risks (HIGH)

- **Token Hashing:** Hashing the currently plaintext MCP tokens will require a careful migration to avoid logging out all existing users instantly.
- **Versioning:** Introducing `context_version` requires backfilling a version hash for all existing sections to ensure backward compatibility.

---

## O. Recommended Implementation Order

To fulfill the "10/10 Architecture" mandate without regressions, we must proceed in exactly this sequence:

1. **Phase 1 (Fast Read Path):** Centralize and measure context retrieval logic to ensure the read path is independent of LLMs.
2. **Phase 2 (Versioned Context):** Introduce deterministic version hashing for all profile state.
3. **Phase 3 (Optimize Writes):** Move non-critical derived work (cache building, project inference) out of the critical synchronous path (or at least strictly sequence them without blocking).
4. **Phase 4 (Intelligent Update Router):** Refine update logic to avoid LLM calls for deterministic changes.
5. **Phase 5 (LLM Hardening):** Improve parsing, retry strategy, and timeout handling.
6. **Phase 6 & 7 (MCP & Tokens):** Implement idempotency, scope permissions, and introduce secure token hashing with a safe migration strategy.
7. **Phase 11 & 12 (CLI & Auth):** Fix atomic file writes, add merge logic to prevent overwriting user data, and properly implement the device authorization flow.
8. **Phase 14 (Concurrency):** Fix data races using Supabase transaction guarantees.
9. **Phase 16 (Observability):** Add structured logging across the board.
10. **Phase 18 & 19 (Testing & Benchmarks):** Add tests for the new hardened paths.

---

**STATUS:** Phase 0 complete. Awaiting approval to proceed to Phase 1.
