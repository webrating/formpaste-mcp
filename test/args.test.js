// test/args.test.js
import { describe, it, expect } from "vitest";
import { buildArgs, MCP_URL } from "../src/args.js";

describe("buildArgs", () => {
  it("targets the production MCP endpoint", () => {
    expect(MCP_URL).toBe("https://api.formpaste.com/mcp");
  });

  it("builds the exact mcp-remote argv", () => {
    expect(buildArgs("fpat_abc")).toEqual([
      "-y",
      "mcp-remote",
      "https://api.formpaste.com/mcp",
      "--header",
      "Authorization: Bearer fpat_abc",
    ]);
  });

  it("formats the header as a single argument", () => {
    const args = buildArgs("fpat_abc");
    const i = args.indexOf("--header");
    expect(args[i + 1]).toBe("Authorization: Bearer fpat_abc");
    expect(args).toHaveLength(5);
  });
});
