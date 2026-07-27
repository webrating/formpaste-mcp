import { describe, it, expect } from "vitest";
import { resolveToken } from "../src/token.js";

describe("resolveToken", () => {
  it("reads --token from argv", () => {
    expect(resolveToken(["--token", "fpat_abc123"], {})).toBe("fpat_abc123");
  });

  it("reads --token=value form", () => {
    expect(resolveToken(["--token=fpat_abc123"], {})).toBe("fpat_abc123");
  });

  it("falls back to FORMPASTE_TOKEN", () => {
    expect(resolveToken([], { FORMPASTE_TOKEN: "fpat_fromenv" })).toBe("fpat_fromenv");
  });

  it("prefers the flag over the env var", () => {
    expect(resolveToken(["--token", "fpat_flag"], { FORMPASTE_TOKEN: "fpat_env" })).toBe("fpat_flag");
  });

  it("throws when no token is present anywhere", () => {
    expect(() => resolveToken([], {})).toThrow(/Settings -> API & MCP/);
  });

  it("throws when the token has the wrong prefix", () => {
    expect(() => resolveToken(["--token", "sk_live_nope"], {})).toThrow(/fpat_/);
  });

  it("throws when --token is passed with no value", () => {
    expect(() => resolveToken(["--token"], {})).toThrow();
  });

  it("never includes the token value in the error message", () => {
    const secret = "sk_live_SUPERSECRET";
    try {
      resolveToken(["--token", secret], {});
      throw new Error("should have thrown");
    } catch (e) {
      expect(e.message).not.toContain(secret);
    }
  });
});
