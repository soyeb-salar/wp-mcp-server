#!/usr/bin/env node
/**
 * server.js
 *
 * Main entry point for the WP-AGENT MCP Server.
 * Exposes the 67-section knowledge base as an MCP robust toolset.
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { listSections, getSectionByNumber, getSubsectionById } from "./lib/parser.js";
import { searchKnowledge } from "./lib/search.js";
import {
  getSecurityChecklist,
  getCodeReviewChecklist,
  getProductionChecklist,
  getOwaspMapping,
  getSecurityHeaders,
  getDeployCommands
} from "./lib/checklists.js";
import { getSnippetsForTopic, listTopics } from "./lib/snippets.js";
import { validatePluginStructure, analysePhpCode, validatePluginHeader } from "./lib/validator.js";
import { listAgentSkills, getAgentSkill } from "./lib/agent-skills.js";
import { generateWpAction } from "./lib/wp-actions.js";
import { wpGetPost, wpGetPosts, wpGetSettings, wpGetUsers, wpWooOrders, wpWooProducts, wpGetTerms, wpGetPostTypes, wpGetTaxonomies } from "./lib/wp-data.js";

// ─────────────────────────────────────────────────────────────────────────────
// MCP SERVER & DASHBOARD INITIALIZATION
// ─────────────────────────────────────────────────────────────────────────────

const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer);

app.use(express.static(path.join(__dirname, "public")));

// Debug endpoint to easily test the UI from browser
app.get("/trigger", (req, res) => {
  const requestId = Math.random().toString(36).substring(2, 11);
  const startTime = Date.now();
  
  io.emit("tool_call", {
    id: requestId,
    name: "mocked_search_knowledge",
    arguments: { query: "security best practices", limit: 5 },
    timestamp: new Date().toISOString()
  });

  setTimeout(() => {
    io.emit("tool_response", {
      id: requestId,
      name: "mocked_search_knowledge",
      result: { status: "success", data: "Found 5 VIP articles on security." },
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
  }, 1500);

  res.send("Mock event emitted to Socket.io dashboard.");
});

io.on("connection", (socket) => {
  console.error(`[Dashboard] Client connected: ${socket.id}`);
  socket.on("disconnect", () => {
    console.error(`[Dashboard] Client disconnected: ${socket.id}`);
  });
});

const server = new Server(
  {
    name: "wp-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// TOOL DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────

const TOOLS = [
  // 1. Knowledge Base Navigation
  {
    name: "list_sections",
    description: "List all 67 major sections in the WP-AGENT knowledge base.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_section",
    description: "Get the full content of a major section by its number (1-67).",
    inputSchema: {
      type: "object",
      properties: {
        number: { type: "number", description: "Section number (e.g. 41)" },
      },
      required: ["number"],
    },
  },
  {
    name: "get_subsection",
    description: "Get the full content of a specific sub-section (e.g. 41.4 for SQL Injection).",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "Subsection ID (e.g. '41.4')" },
      },
      required: ["id"],
    },
  },
  {
    name: "search_knowledge",
    description: "Perform a fuzzy search across the entire knowledge base.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Search term (e.g. 'nonce', 'caching', 'rest api')" },
        limit: { type: "number", description: "Max results to return" },
        tags: { type: "array", items: { type: "string" }, description: "Filter by specific tags" },
      },
      required: ["query"],
    },
  },

  // 2. Checklists & References
  {
    name: "get_security_checklist",
    description: "Get the pre-ship Advanced Security checklist (§41.1).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_code_review_checklist",
    description: "Get the 5-part Code Review checklist for Pull Requests (§50).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_production_checklist",
    description: "Get the 7-part Production Readiness checklist (§66).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_owasp_mapping",
    description: "Get the OWASP Top 10 to WordPress context mapping (§41.26).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_security_headers",
    description: "Get required HTTP Security Headers table (§41.25).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_deploy_commands",
    description: "Get WP-CLI post-deploy command cheatsheet (§67.12).",
    inputSchema: { type: "object", properties: {} },
  },

  // 3. Snippets
  {
    name: "list_snippet_topics",
    description: "List all available ~80 topics for get_topic_snippets.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_topic_snippets",
    description: "Get code examples and standard patterns for a specific WP topic (e.g. 'singleton', 'cpt', 'woocommerce').",
    inputSchema: {
      type: "object",
      properties: {
        topic: { type: "string", description: "Topic name (e.g. 'cpt', 'nonce', 'fse')" },
        language: { type: "string", description: "Filter by language (e.g. 'php', 'js')" },
      },
      required: ["topic"],
    },
  },

  // 4. Validation & Analysis
  {
    name: "validate_plugin_structure",
    description: "Check if a plugin folder has all required enterprise files (uninstall.php, readme.txt, etc).",
    inputSchema: {
      type: "object",
      properties: {
        files: { type: "array", items: { type: "string" }, description: "List of file paths in the plugin" },
        dirs: { type: "array", items: { type: "string" }, description: "List of directory paths in the plugin" },
      },
      required: ["files"],
    },
  },
  {
    name: "analyze_php_code",
    description: "Run static analysis on PHP code against the 15-year WP security rules (finds eval, raw SQL, xss risks).",
    inputSchema: {
      type: "object",
      properties: {
        code: { type: "string", description: "Raw PHP code string to analyze" },
      },
      required: ["code"],
    },
  },
  {
    name: "validate_plugin_header",
    description: "Check if a plugin main file header meets WordPress.org standards.",
    inputSchema: {
      type: "object",
      properties: {
        header: { type: "string", description: "The PHP comment block containing the plugin header" },
      },
      required: ["header"],
    },
  },

  // 5. Official Agent Skills
  {
    name: "list_agent_skills",
    description: "List all official AI WordPress coding skills (e.g. wp-rest-api, wp-block-development).",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "get_agent_skill",
    description: "Read the official instructions (SKILL.md) for a specific WordPress coding topic.",
    inputSchema: {
      type: "object",
      properties: {
        skillName: { type: "string", description: "The name of the skill (e.g. 'wp-plugin-development')" },
      },
      required: ["skillName"],
    },
  },

  // 6. Actionable Generation
  {
    name: "generate_wp_action",
    description: "Generate WP-CLI commands and PHP code for executable actions (e.g., 'create_post', 'create_user').",
    inputSchema: {
      type: "object",
      properties: {
        action: { type: "string", description: "The action type (e.g. 'create_post', 'create_user')" },
        params: { type: "object", description: "Dynamic parameters (e.g. { title: 'Test', post_type: 'page' })" },
      },
      required: ["action"],
    },
  },

  // 7. Live WordPress Data (WP-CLI Wrappers)
  {
    name: "wp_get_posts",
    description: "Read a list of live posts, pages, or custom post types from the active WordPress site.",
    inputSchema: {
      type: "object",
      properties: {
        postType: { type: "string", description: "The post_type to query (post, page, etc)", default: "post" },
        count: { type: "number", description: "Number of items to return", default: 10 },
        search: { type: "string", description: "Optional search term query" },
      },
    },
  },
  {
    name: "wp_get_post",
    description: "Read a single live WordPress post/page by its integer ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "The Post ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "wp_get_users",
    description: "Read a list of live users from the active WordPress site.",
    inputSchema: {
      type: "object",
      properties: {
        role: { type: "string", description: "Filter by role (e.g., 'administrator', 'subscriber')" },
        count: { type: "number", description: "Number of users to return", default: 10 },
      },
    },
  },
  {
    name: "wp_get_settings",
    description: "Read live core WordPress settings/options.",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", description: "Search active options by name" },
      },
    },
  },
  {
    name: "wp_woo_products",
    description: "Read live WooCommerce products.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Product status", default: "publish" },
        count: { type: "number", description: "Number of products", default: 10 },
      },
    },
  },
  {
    name: "wp_woo_orders",
    description: "Read live WooCommerce orders.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string", description: "Order status (e.g., 'completed', 'processing')", default: "any" },
        count: { type: "number", description: "Number of orders", default: 10 },
      },
    },
  },
  {
    name: "wp_get_terms",
    description: "Read terms from a specific taxonomy.",
    inputSchema: {
      type: "object",
      properties: {
        taxonomy: { type: "string", description: "Taxonomy slug (e.g., 'category', 'post_tag')", default: "category" },
        count: { type: "number", description: "Number of terms", default: 10 },
        search: { type: "string", description: "Search query" },
      },
    },
  },
  {
    name: "wp_get_post_types",
    description: "Read all registered custom post types.",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "wp_get_taxonomies",
    description: "Read all registered taxonomies.",
    inputSchema: { type: "object", properties: {} },
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST HANDLERS
// ─────────────────────────────────────────────────────────────────────────────

server.setRequestHandler(ListToolsRequestSchema, async () => {
  console.error(`\n[${new Date().toISOString()}] 🔍 Client requested tool list`);
  return { tools: TOOLS };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const requestId = Math.random().toString(36).substring(2, 11);
  const startTime = Date.now();

  console.error(`\n[${new Date().toISOString()}] ⚡ Executing Tool: \x1b[36m${name}\x1b[0m`);
  if (args && Object.keys(args).length > 0) {
    console.error(`[Arguments] ➤ \x1b[33m${JSON.stringify(args)}\x1b[0m`);
  } else {
    console.error(`[Arguments] ➤ (none)`);
  }

  io.emit("tool_call", {
    id: requestId,
    name: name,
    arguments: args || {},
    timestamp: new Date().toISOString()
  });

  try {
    const result = await executeTool(name, args);
    io.emit("tool_response", {
      id: requestId,
      name: name,
      result: result,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
    return result;
  } catch (error) {
    const errorResult = {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
    io.emit("tool_response", {
      id: requestId,
      name: name,
      result: errorResult,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString()
    });
    return errorResult;
  }
});

async function executeTool(name, args) {
  try {
    switch (name) {
      // 1. Navigation
      case "list_sections":
        return jsonResponse(listSections());

      case "get_section":
        const section = getSectionByNumber(args.number);
        if (!section) throw new Error(`Section ${args.number} not found.`);
        return jsonResponse(section);

      case "get_subsection":
        const sub = getSubsectionById(args.id);
        if (!sub) throw new Error(`Subsection ${args.id} not found.`);
        return jsonResponse(sub);

      case "search_knowledge":
        const results = searchKnowledge(args.query, { limit: args.limit, tags: args.tags });
        return jsonResponse({ query: args.query, count: results.length, results });

      // 2. Checklists
      case "get_security_checklist":
        return jsonResponse(getSecurityChecklist());

      case "get_code_review_checklist":
        return jsonResponse(getCodeReviewChecklist());

      case "get_production_checklist":
        return jsonResponse(getProductionChecklist());

      case "get_owasp_mapping":
        return jsonResponse(getOwaspMapping());

      case "get_security_headers":
        return jsonResponse(getSecurityHeaders());

      case "get_deploy_commands":
        return jsonResponse(getDeployCommands());

      // 3. Snippets
      case "list_snippet_topics":
        return jsonResponse({ total: listTopics().length, topics: listTopics() });

      case "get_topic_snippets":
        return jsonResponse(getSnippetsForTopic(args.topic, args.language));

      // 4. Validation
      case "validate_plugin_structure":
        return jsonResponse(validatePluginStructure(args.files, args.dirs));

      case "analyze_php_code":
        return jsonResponse(analysePhpCode(args.code));

      case "validate_plugin_header":
        return jsonResponse(validatePluginHeader(args.header));

      // 5. Official Agent Skills
      case "list_agent_skills":
        return jsonResponse({ total: listAgentSkills().length, skills: listAgentSkills() });

      case "get_agent_skill":
        const skillData = getAgentSkill(args.skillName);
        if (skillData.error) throw new Error(skillData.error);
        return jsonResponse(skillData);

      // 6. Actionable Generation
      case "generate_wp_action":
        const actionResult = generateWpAction(args.action, args.params || {});
        if (actionResult.error) throw new Error(actionResult.error);
        return jsonResponse(actionResult);

      // 7. Live WordPress Data
      case "wp_get_posts":
        return jsonResponse(await wpGetPosts(args.postType, args.count, args.search));
        
      case "wp_get_post":
        return jsonResponse(await wpGetPost(args.id));
        
      case "wp_get_users":
        return jsonResponse(await wpGetUsers(args.role, args.count, args.search));
        
      case "wp_get_settings":
        return jsonResponse(await wpGetSettings(args.search));
        
      case "wp_woo_products":
        return jsonResponse(await wpWooProducts(args.status, args.count));
        
      case "wp_woo_orders":
        return jsonResponse(await wpWooOrders(args.status, args.count));
        
      case "wp_get_terms":
        return jsonResponse(await wpGetTerms(args.taxonomy, args.count, args.search));
        
      case "wp_get_post_types":
        return jsonResponse(await wpGetPostTypes());
        
      case "wp_get_taxonomies":
        return jsonResponse(await wpGetTaxonomies());

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    throw error;
  }
}

/**
 * Format payload as MCP tool JSON response.
 */
function jsonResponse(data) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVER START
// ─────────────────────────────────────────────────────────────────────────────

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[WP-MCP] Server initialized and listening on stdio.");

  const DASHBOARD_PORT = 5174;
  httpServer.listen(DASHBOARD_PORT, () => {
    console.error(`[WP-MCP] Dashboard running on http://localhost:${DASHBOARD_PORT}`);
  });
}

run().catch((error) => {
  console.error("Server crashed:", error);
  process.exit(1);
});
