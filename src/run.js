// src/run.js
import { resolveToken } from "./token.js";
import { buildArgs } from "./args.js";

export function run({ argv, env, spawn, onExit, onError }) {
  let token;
  try {
    token = resolveToken(argv, env);
  } catch (e) {
    onError(e.message);
    onExit(1);
    return;
  }

  const child = spawn("npx", buildArgs(token), { stdio: "inherit" });

  child.on("error", (e) => {
    onError(`Could not start npx. Is Node.js installed and on your PATH?\n${e.message}`);
    onExit(1);
  });

  child.on("exit", (code, signal) => {
    onExit(signal ? 1 : (code ?? 0));
  });

  return child;
}
