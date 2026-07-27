# formpaste-mcp

Create and wire up contact forms from your coding agent. Six tools for forms, snippets, and submissions.

## What this is

This package is a thin wrapper that launches `mcp-remote` pointed at the hosted Formpaste MCP server (`https://api.formpaste.com/mcp`, streamable-http transport). The equivalent manual `mcp-remote` config works identically; this package exists mainly so agents and clients can discover and install Formpaste's MCP server by name, not because it does anything the manual config cannot.

## Requirements

- Node.js 18 or later
- A Formpaste account
- An API token from Settings -> API & MCP in the Formpaste dashboard

## Install

Each client below is configured to talk to the hosted MCP endpoint at `https://api.formpaste.com/mcp`. Replace `fpat_YOUR_TOKEN` with a token minted from Settings -> API & MCP.

### Claude Code

```
claude mcp add formpaste --transport http https://api.formpaste.com/mcp \
  --header "Authorization: Bearer fpat_YOUR_TOKEN"
```

### Codex

```
# ~/.codex/config.toml
[mcp_servers.formpaste]
command = "npx"
args = ["mcp-remote", "https://api.formpaste.com/mcp", "--header", "Authorization: Bearer fpat_YOUR_TOKEN"]
```

### Cursor

```
// .cursor/mcp.json
{
  "mcpServers": {
    "formpaste": { "command": "npx", "args": ["mcp-remote", "https://api.formpaste.com/mcp", "--header", "Authorization: Bearer fpat_YOUR_TOKEN"] }
  }
}
```

### Claude Desktop

```
// claude_desktop_config.json
{
  "mcpServers": {
    "formpaste": { "command": "npx", "args": ["mcp-remote", "https://api.formpaste.com/mcp", "--header", "Authorization: Bearer fpat_YOUR_TOKEN"] }
  }
}
```

### VS Code

```
// .vscode/mcp.json
{
  "servers": {
    "formpaste": { "command": "npx", "args": ["mcp-remote", "https://api.formpaste.com/mcp", "--header", "Authorization: Bearer fpat_YOUR_TOKEN"] }
  }
}
```

### Any MCP client, via this package

```
FORMPASTE_TOKEN=fpat_YOUR_TOKEN npx formpaste-mcp
```

`formpaste-mcp` reads `FORMPASTE_TOKEN` from the environment (or a `--token` flag) and starts `mcp-remote` against the hosted endpoint for you.

## The six tools

| Tool | Purpose | Scope |
|---|---|---|
| `create_form` | Create a form, return its access key and a wired snippet | setup |
| `get_snippet` | Return a copy-paste snippet for html/react/nextjs/astro/vue/svelte | setup |
| `list_forms` | List all forms with ids, names, access keys, inbox/spam counts | setup |
| `get_form` | Read one form's config to verify it is wired correctly | setup |
| `send_test_submission` | Store a test submission to prove a form is live | setup |
| `list_submissions` | List submissions, optionally including message bodies | full |

## Token scopes

Formpaste API tokens have two scopes:

- **`full`** can do everything, including reading submission content via `list_submissions`.
- **`setup`** can do everything except `list_submissions`, so it never reads third-party submission content.

Use a `setup`-scoped token for agent use. It covers form creation, snippets, and verifying that a form is wired correctly, without granting access to the data your forms collect.

## Worked example

See [`examples/wire-a-form.md`](examples/wire-a-form.md) for a full walkthrough: create a form, get a snippet, paste it into a page, send a test submission, and confirm the form is wired correctly.

## Links

- Documentation: https://formpaste.com/docs
- MCP server docs: https://formpaste.com/docs/agents/mcp-server
- Install guide: https://formpaste.com/docs/agents/install
- Issues: https://github.com/webrating/formpaste-mcp/issues
