# WP-MCP Server Setup Guide

This guide explains how to connect the WordPress MCP Server (`wp-mcp-server`) to your favorite AI coding assistants (like Claude Desktop, Cursor, and Windsurf).

## 1. Prerequisites

The server dependencies must be installed first. Navigate to the `mcp-server` directory and run the install command:

```bash
cd c:\wamp64\www\wp-agent\mcp-server
npm install
```

*(Note: This has already been done for you).*

## 2. Connecting to Claude Desktop

To add the WP-MCP server to Claude Desktop, you need to edit your Claude configuration file.

**Config Location:**

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

Add the following JSON configuration to register the server:

```json
{
  "mcpServers": {
    "wp-mcp-server": {
      "command": "node",
      "args": [
        "c:/wamp64/www/wp-agent/mcp-server/server.js"
      ]
    }
  }
}
```

Restart Claude Desktop after saving the file. You will see a "hammer" icon or an MCP connection status indicating the tools are loaded.

## 3. Connecting to Cursor IDE

Cursor supports adding MCP servers directly through its UI.

1. Open Cursor Settings.
2. Search for **"MCP"** or go to strictly MCP settings.
3. Click **"+ Add New MCP Server"**.
4. Configure as follows:
   - **Type:** `command`
   - **Name:** `wp-mcp-server`
   - **Command:** `node c:/wamp64/www/wp-agent/mcp-server/server.js`

Click "Save" and ensure the status shows a green dot (Connected).

## 4. Verify the Connection

Once added, the client will automatically spawn the Node process and connect to it over the standard input/output (stdio) channels.

You can verify that it's working by asking your AI assistant a prompt like:
> *"Use the wp-mcp-server to give me the Advanced WooCommerce Code Review Checklist."*

or

> *"Search the wp-mcp-server for 'nonce' and show me the best practices."*

## 5. Optional: Manual Testing with MCP Inspector

If you ever want to test, inspect, or debug the server manually in your browser with a visual GUI, you can use the official tools from the Model Context Protocol SDK.

Run this command in your terminal:

```bash
npx @modelcontextprotocol/inspector node c:\wamp64\www\wp-agent\mcp-server\server.js
```

This will output a localhost URL (e.g., `http://localhost:5173`). Open that URL in your browser to manually execute the tools (like `get_section` or `search_knowledge`) to see their raw JSON output!

## 6. Official GitHub Agent Skills & Action Generators

We have integrated the official `WordPress/agent-skills` repository into this MCP!
Your AI assistant now has access to 3 brand new tools:

1. **`list_agent_skills`**: Lists all 13 official WordPress learning modules (e.g. `wp-block-development`, `wp-rest-api`).
2. **`get_agent_skill`**: Retrieves the official VIP-level task instructions for a specific skill.
3. **`generate_wp_action`**: A magical tool that provides the exact WP-CLI command and PHP snippet to physically execute actions like creating posts or users. 

**Example Prompts for the AI:**
> *"Read the official agent skill for 'wp-plugin-development' and set up my new plugin."*
> *"Use the generate_wp_action tool to build the WP-CLI command to create a draft post titled 'Hello World' and run it."*

---

## 7. AI System Prompt (The WP-MCP Trigger)

To get the absolute best results out of the `wp-mcp-server`, paste the following prompt into your AI assistant's "System Prompt" (Cursor Rules, Windsurf settings, or Claude Projects custom instructions):

> **SYSTEM PROMPT:**
> You are an elite 15-year Senior WordPress Software Engineer connected to the `wp-mcp-server`.
>
> **Your Core Directives:**
>
> 1. **Before writing any WordPress codebase changes**, you MUST use the `search_knowledge` or `get_topic_snippets` MCP tools to look up the enterprise standard for the requested feature.
> 2. **Never guess WordPress APIs.** If you are asked to build a custom post type, taxonomy, Gutenberg block, WP-CLI command, or REST API endpoint, use the MCP server to fetch the exact snippet parameters first.
> 3. **Maximum Security by Default:** Before finalizing any form handling, AJAX, or database query, you must run the `get_security_checklist` MCP tool and guarantee 100% compliance (Nonces, `current_user_can()`, `$wpdb->prepare()`, escaping).
> 4. **Self-Validation:** After writing PHP code, immediately use the `analyze_php_code` MCP tool to statically check your own code against the rulebook for XSS, SQLi, and logic errors. Do not present code to the user that fails this check.
> 5. **Going to Production:** If the user asks you to prepare a plugin for release or prepare the server for deployment, invoke `get_production_checklist` and `get_deploy_commands` and walk the user through it step-by-step.
>
> Your goal is not just to write code that works, but code that passes a VIP Enterprise-grade Code Review (which you can check via `get_code_review_checklist`). Rely entirely on your MCP server as your ultimate WordPress source of truth.
