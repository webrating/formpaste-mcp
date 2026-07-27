// test/run.test.js
import { describe, it, expect, vi } from "vitest";
import { run } from "../src/run.js";

function fakeChild() {
  const handlers = {};
  return {
    on(event, cb) { handlers[event] = cb; return this; },
    kill: vi.fn(),
    emit(event, ...a) { handlers[event]?.(...a); },
  };
}

describe("run", () => {
  it("spawns npx with the mcp-remote argv and inherited stdio", () => {
    const child = fakeChild();
    const spawn = vi.fn(() => child);
    run({ argv: ["--token", "fpat_abc"], env: {}, spawn, onExit: vi.fn(), onError: vi.fn() });

    expect(spawn).toHaveBeenCalledTimes(1);
    const [cmd, args, opts] = spawn.mock.calls[0];
    expect(cmd).toBe("npx");
    expect(args).toEqual([
      "-y", "mcp-remote", "https://api.formpaste.com/mcp",
      "--header", "Authorization: Bearer fpat_abc",
    ]);
    expect(opts.stdio).toBe("inherit");
  });

  it("forwards the child exit code", () => {
    const child = fakeChild();
    const onExit = vi.fn();
    run({ argv: ["--token", "fpat_abc"], env: {}, spawn: () => child, onExit, onError: vi.fn() });
    child.emit("exit", 3, null);
    expect(onExit).toHaveBeenCalledWith(3);
  });

  it("maps a signal-terminated child to a non-zero exit", () => {
    const child = fakeChild();
    const onExit = vi.fn();
    run({ argv: ["--token", "fpat_abc"], env: {}, spawn: () => child, onExit, onError: vi.fn() });
    child.emit("exit", null, "SIGTERM");
    expect(onExit).toHaveBeenCalledWith(1);
  });

  it("reports a missing token without spawning", () => {
    const spawn = vi.fn();
    const onError = vi.fn();
    const onExit = vi.fn();
    run({ argv: [], env: {}, spawn, onError, onExit });

    expect(spawn).not.toHaveBeenCalled();
    expect(onError).toHaveBeenCalledWith(expect.stringMatching(/Settings -> API & MCP/));
    expect(onExit).toHaveBeenCalledWith(1);
  });

  it("never passes the token to onError", () => {
    const onError = vi.fn();
    run({ argv: ["--token", "sk_live_SECRET"], env: {}, spawn: vi.fn(), onError, onExit: vi.fn() });
    expect(onError.mock.calls[0][0]).not.toContain("sk_live_SECRET");
  });

  it("surfaces a spawn failure as a non-zero exit", () => {
    const child = fakeChild();
    const onError = vi.fn();
    const onExit = vi.fn();
    run({ argv: ["--token", "fpat_abc"], env: {}, spawn: () => child, onError, onExit });
    child.emit("error", new Error("ENOENT"));
    expect(onExit).toHaveBeenCalledWith(1);
    expect(onError).toHaveBeenCalledWith(expect.stringMatching(/npx/));
  });
});
