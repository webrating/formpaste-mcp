#!/usr/bin/env node
// bin/formpaste-mcp.js
import { spawn } from "node:child_process";
import { run } from "../src/run.js";

const child = run({
  argv: process.argv.slice(2),
  env: process.env,
  spawn,
  onError: (msg) => process.stderr.write(`${msg}\n`),
  onExit: (code) => { process.exitCode = code; },
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => { child?.kill(sig); });
}
