import { describe, it, expect } from "vitest";
import { hashMcpToken, generateMcpToken } from "@/lib/mcp-auth";

describe("mcp-auth", () => {
  it("generates token with proper prefix and length", () => {
    const { rawToken, tokenHash } = generateMcpToken();
    expect(rawToken).toMatch(/^meto_mcp_[a-f0-9]{32}$/);
    expect(tokenHash).toHaveLength(64); // SHA-256 hex is 64 characters
  });

  it("produces deterministic SHA-256 hash for identical tokens", () => {
    const token = "meto_mcp_sampletoken1234567890abcdef";
    const hash1 = hashMcpToken(token);
    const hash2 = hashMcpToken(token);
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("trims whitespace before hashing", () => {
    const token = "meto_mcp_testtoken";
    expect(hashMcpToken(`  ${token}  \n`)).toBe(hashMcpToken(token));
  });
});
