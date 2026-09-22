import crypto from "crypto";

/**
 * Computes a SHA-256 hex digest for an MCP access token.
 */
export function hashMcpToken(token: string): string {
  return crypto.createHash("sha256").update(token.trim()).digest("hex");
}

/**
 * Generates a cryptographically secure random token and its SHA-256 hash.
 */
export function generateMcpToken(): { rawToken: string; tokenHash: string } {
  const random = crypto.randomUUID().replace(/-/g, "");
  const rawToken = `meto_mcp_${random}`;
  const tokenHash = hashMcpToken(rawToken);
  return { rawToken, tokenHash };
}
