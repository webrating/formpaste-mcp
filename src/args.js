// src/args.js
// Must match MCP_URL in the private monolith's client/src/mcp-install.ts.
// Deliberate duplication across two repos, recorded in the design doc.
export const MCP_URL = "https://api.formpaste.com/mcp";

export function buildArgs(token) {
  return ["-y", "mcp-remote", MCP_URL, "--header", `Authorization: Bearer ${token}`];
}
