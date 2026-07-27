const PREFIX = "fpat_";

const MISSING =
  "No Formpaste API token found.\n" +
  "Pass --token fpat_... or set FORMPASTE_TOKEN.\n" +
  "Mint one in the Formpaste dashboard under Settings -> API & MCP.";

const BAD_PREFIX =
  "That does not look like a Formpaste API token.\n" +
  "Formpaste tokens start with fpat_.\n" +
  "Mint one in the Formpaste dashboard under Settings -> API & MCP.";

function fromArgv(argv) {
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--token") {
      const v = argv[i + 1];
      if (!v || v.startsWith("--")) throw new Error(MISSING);
      return v;
    }
    if (a.startsWith("--token=")) return a.slice("--token=".length);
  }
  return null;
}

export function resolveToken(argv, env) {
  const token = fromArgv(argv) ?? env.FORMPASTE_TOKEN ?? null;
  if (!token) throw new Error(MISSING);
  if (!token.startsWith(PREFIX)) throw new Error(BAD_PREFIX);
  return token;
}
