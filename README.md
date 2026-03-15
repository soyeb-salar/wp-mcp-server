# WP-AGENT MCP Server

[![Model Context Protocol](https://img.shields.io/badge/MCP-Server-blue)](https://modelcontextprotocol.io)
[![WordPress](https://img.shields.io/badge/WordPress-6.6+-blue)](https://wordpress.org)
[![PHP](https://img.shields.io/badge/PHP-8.1+-purple)](https://php.net)
[![Node](https://img.shields.io/badge/Node-20+-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

**Elite WordPress MCP Server** — Connects AI coding assistants (Claude Desktop, Cursor, Windsurf) to a comprehensive 67-section WordPress/WooCommerce knowledge base and live site data.

---

## 🚀 Features

### Knowledge Base (67 Sections)

- **Security** — Nonce verification, capability checks, SQL injection prevention, XSS escaping, OWASP Top 10 mapping
- **Performance** — Core Web Vitals, caching strategies, query optimization, asset optimization
- **WooCommerce** — HPOS compatibility, product/order APIs, hooks reference, subscription handling
- **Gutenberg** — `block.json`, Interactivity API, Full Site Editing, block patterns
- **REST API** — Custom endpoints, authentication, schema design
- **Database** — Custom tables, `dbDelta()`, indexing, query optimization
- **Plugin Architecture** — Enterprise file structure, dependency injection, PSR-12, PHPStan Level 8

### MCP Tools (27 Available)

| Category | Tools |
|----------|-------|
| **Knowledge Navigation** | `list_sections`, `get_section`, `get_subsection`, `search_knowledge` |
| **Checklists** | `get_security_checklist`, `get_code_review_checklist`, `get_production_checklist`, `get_owasp_mapping`, `get_security_headers`, `get_deploy_commands` |
| **Code Snippets** | `list_snippet_topics`, `get_topic_snippets` |
| **Validation** | `validate_plugin_structure`, `analyze_php_code`, `validate_plugin_header` |
| **Agent Skills** | `list_agent_skills`, `get_agent_skill` |
| **Action Generation** | `generate_wp_action` |
| **Live WordPress Data** | `wp_get_posts`, `wp_get_post`, `wp_get_users`, `wp_get_settings`, `wp_woo_products`, `wp_woo_orders`, `wp_get_terms`, `wp_get_post_types`, `wp_get_taxonomies` |

---

## � Complete MCP Tools Reference

### 1. Knowledge Base Navigation

| Tool | Parameters | Example Prompt |
|------|------------|----------------|
| `list_sections` | None | *"List all available knowledge base sections"* |
| `get_section` | `number` (1-67) | *"Get section 41 about security"* |
| `get_subsection` | `id` (e.g., "41.4") | *"Get subsection 41.4 about SQL injection"* |
| `search_knowledge` | `query`, `limit`, `tags` | *"Search for 'nonce' best practices with limit 5"* |

### 2. Checklists & References

| Tool | Parameters | Example Prompt |
|------|------------|----------------|
| `get_security_checklist` | None | *"Get the pre-ship security checklist"* |
| `get_code_review_checklist` | None | *"Get the code review checklist for pull requests"* |
| `get_production_checklist` | None | *"Get the production readiness checklist"* |
| `get_owasp_mapping` | None | *"Get the OWASP Top 10 WordPress mapping"* |
| `get_security_headers` | None | *"Get required HTTP security headers"* |
| `get_deploy_commands` | None | *"Get WP-CLI post-deploy commands"* |

### 3. Code Snippets

| Tool | Parameters | Example Prompt |
|------|------------|----------------|
| `list_snippet_topics` | None | *"List all available snippet topics"* |
| `get_topic_snippets` | `topic`, `language` | *"Get PHP snippets for custom post types"* |

### 4. Validation & Analysis

| Tool | Parameters | Example Prompt |
|------|------------|----------------|
| `validate_plugin_structure` | `files`, `dirs` | *"Check if my plugin has all required enterprise files"* |
| `analyze_php_code` | `code` | *"Analyze this PHP code for security issues: `<?php echo $_GET['id']; ?>`"* |
| `validate_plugin_header` | `header` | *"Validate this plugin header meets WordPress.org standards"* |

### 5. Official Agent Skills

| Tool | Parameters | Example Prompt |
|------|------------|----------------|
| `list_agent_skills` | None | *"List all official WordPress agent skills"* |
| `get_agent_skill` | `skillName` | *"Get the skill instructions for 'wp-plugin-development'"* |

### 6. Action Generation

| Tool | Parameters | Example Prompt |
|------|------------|----------------|
| `generate_wp_action` | `action`, `params` | *"Generate WP-CLI command to create a post with title 'Hello World'"* |

**Supported Actions:**

- `create_post` — Create a WordPress post/page
- `create_user` — Create a WordPress user
- `create_term` — Create a taxonomy term
- `delete_post` — Delete a post
- `delete_user` — Delete a user
- `update_option` — Update a WordPress option

### 7. Live WordPress Data

| Tool | Parameters | Example Prompt |
|------|------------|----------------|
| `wp_get_posts` | `postType`, `count`, `search` | *"Get 5 recent blog posts"* |
| `wp_get_post` | `id` (required) | *"Get post with ID 42"* |
| `wp_get_users` | `role`, `count`, `search` | *"Get all administrator users"* |
| `wp_get_settings` | `search` | *"Get all autoloaded WordPress settings"* |
| `wp_woo_products` | `status`, `count` | *"Get 10 published WooCommerce products"* |
| `wp_woo_orders` | `status`, `count` | *"Get recent completed orders"* |
| `wp_get_terms` | `taxonomy`, `count`, `search` | *"Get all categories"* |
| `wp_get_post_types` | None | *"List all registered custom post types"* |
| `wp_get_taxonomies` | None | *"List all registered taxonomies"* |

---

## 🛠️ Usage

### Example Prompts

Once connected, ask your AI assistant:

```
"Use the wp-mcp-server to give me the Advanced WooCommerce Code Review Checklist."
```

```
"Search the wp-mcp-server for 'nonce' and show me the best practices."
```

```
"Read the official agent skill for 'wp-plugin-development' and set up my new plugin."
```

```
"Use generate_wp_action to build the WP-CLI command to create a draft post titled 'Hello World'."
```

```
"Check my plugin structure against enterprise standards."
```

```
"Get section 41 and show me the SQL injection prevention guidelines."
```

```
"Analyze this PHP code for security issues: <?php echo $_GET['id']; ?>"
```

```
"Get 5 recent WooCommerce products and show their prices."
```

---

## 📦 Installation

### Prerequisites

- **Node.js** >= 20.0
- **WordPress** >= 6.6 (for live data features)
- **WP-CLI** installed and accessible in system PATH
- **WooCommerce** (optional, for `wp_woo_products` and `wp_woo_orders` tools)

### Install Dependencies

```bash
cd mcp-server
npm install
```

### Enable WooCommerce CLI (Optional)

To use the WooCommerce data tools (`wp_woo_products`, `wp_woo_orders`), install WooCommerce on your WordPress site:

**Via WP-CLI:**

```bash
wp plugin install woocommerce --activate --path="C:\wamp64\www\wp-mcp-test"
```

**Via WordPress Admin:**

1. Go to **Plugins** → **Add New**
2. Search for "WooCommerce"
3. Click **Install Now** → **Activate**

After activation, verify the WooCommerce CLI is available:

```bash
wp wc --path="C:\wamp64\www\wp-mcp-test"
```

---

## 🔧 Configuration

### Claude Desktop

**Config Location:**

- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

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

### Cursor IDE

1. Open **Cursor Settings** → **MCP**
2. Click **"+ Add New MCP Server"**
3. Configure:
   - **Type:** `command`
   - **Name:** `wp-mcp-server`
   - **Command:** `node c:/wamp64/www/wp-agent/mcp-server/server.js`
4. Click **Save**

### Windsurf

Add to Windsurf MCP configuration with the same command path.

---

## 🛠️ Usage

### Example Prompts

Once connected, ask your AI assistant:

```
"Use the wp-mcp-server to give me the Advanced WooCommerce Code Review Checklist."
```

```
"Search the wp-mcp-server for 'nonce' and show me the best practices."
```

```
"Read the official agent skill for 'wp-plugin-development' and set up my new plugin."
```

```
"Use generate_wp_action to build the WP-CLI command to create a draft post titled 'Hello World'."
```

```
"Check my plugin structure against enterprise standards."
```

### Recommended System Prompt

For optimal results, add this to your AI assistant's system prompt:

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

---

## 🧪 Testing

### Manual Testing

Run the test suite:

```bash
npm test
```

### MCP Inspector

Use the official MCP Inspector for interactive testing:

```bash
npx @modelcontextprotocol/inspector node c:\wamp64\www\wp-agent\mcp-server\server.js
```

Open the displayed localhost URL in your browser to manually execute tools and view raw JSON output.

### Dashboard

The server includes a **stunning real-time analytics dashboard** at `http://localhost:5175` with:

- **📊 Live Statistics** — Total requests, avg response time, success rate, requests/minute
- **📈 Interactive Charts** — Requests over time, tool distribution, response time histogram, success/error ratio, category breakdown
- **📋 Activity Feed** — Real-time log of all tool calls with syntax-highlighted JSON
- **🏆 Top Tools** — Most frequently used tools ranked by usage
- **⏱️ Performance Metrics** — Min/Avg/Max/P95 response times
- **📁 Export Logs** — Download all logs as JSON for analysis
- **🔍 Advanced Filtering** — Search logs, filter by type (call/success/error)
- **📱 Activity Timeline** — Visual timeline of recent activity

### 📚 Prompts Library

The dashboard includes a **comprehensive Prompts Library** with 30+ ready-to-use prompts organized by category:

| Category | Prompts | Examples |
|----------|---------|----------|
| **📖 Knowledge Base** | 4 prompts | List sections, Get section, Get subsection, Search knowledge |
| **✅ Checklists** | 6 prompts | Security, Code Review, Production, OWASP, Security Headers, Deploy Commands |
| **💡 Code Snippets** | 2 prompts | List topics, Get topic snippets |
| **🔍 Validation** | 3 prompts | Validate plugin structure, Analyze PHP code, Validate plugin header |
| **🤖 Agent Skills** | 2 prompts | List agent skills, Get agent skill instructions |
| **⚡ Actions** | 2 prompts | Create post, Create user |
| **🔵 WordPress Data** | 11 prompts | Get posts, Get users, Get settings, WooCommerce products/orders, Terms, CPTs, Taxonomies |

**Features:**

- **One-Click Copy** — Click "📋 Copy Prompt" to copy any prompt to clipboard
- **Search** — Find prompts by title, description, or tool name
- **Category Filter** — Filter prompts by category using the dropdown
- **Visual Cards** — Each prompt shows icon, title, description, tool name, and example
- **Ready-to-Use** — Copy and paste directly into Claude, Cursor, or Windsurf

**Example Usage:**

1. Open the dashboard and click **"📚 Prompts Library"**
2. Browse or search for the prompt you need
3. Click **"📋 Copy Prompt"** on any card
4. Paste into your AI assistant (Claude, Cursor, Windsurf)

---

### 💻 Advanced Developer Prompts

The dashboard includes **10 professional-grade, multi-step prompts** specifically designed for developers and programmers. These advanced prompts combine multiple MCP tools to maximize productivity:

| Category | Prompt | Description | Difficulty |
|----------|--------|-------------|------------|
| **🔌 Plugin Development** | Complete Plugin Boilerplate | Generate production-ready plugin with enterprise architecture | ⭐⭐⭐ |
| **🔌 Plugin Development** | Security-Hardened Plugin | Build plugin with OWASP guidelines and security best practices | ⭐⭐⭐ |
| **🧩 Gutenberg Blocks** | Custom Gutenberg Block | Create modern block with block.json v3, React, Interactivity API | ⭐⭐⭐ |
| **🛍️ WooCommerce** | Custom Payment Gateway | Build secure WooCommerce payment gateway with hooks | ⭐⭐⭐ |
| **🛍️ WooCommerce** | Custom Product Type | Extend WooCommerce product system with custom types | ⭐⭐ |
| **🔌 REST API** | Custom REST Endpoint | Build secure REST API with authentication and validation | ⭐⭐⭐ |
| **🔒 Security** | Security Audit Workflow | Comprehensive security audit using MCP tools | ⭐⭐ |
| **⚡ Performance** | Performance Optimization | Optimize for Core Web Vitals and enterprise standards | ⭐⭐⭐ |
| **💾 Database** | Custom Database Tables | Create tables with schema, indexes, dbDelta, CRUD class | ⭐⭐⭐ |
| **🧪 Testing** | Unit Tests Setup | Set up PHPUnit, WP_Mock, integration tests, CI/CD | ⭐⭐⭐ |

**Features:**

- **Expandable Cards** — Click header to expand full instructions
- **Step-by-Step Guides** — Detailed multi-step instructions for complex tasks
- **Tools Used** — Shows which MCP tools will be invoked
- **Difficulty Rating** — 1-3 star difficulty indicator
- **Expected Output** — Clear description of what you'll get
- **One-Click Copy** — Copy entire multi-step prompt instantly

**How to Use:**

1. Open dashboard and click **"💻 Developer Prompts"**
2. Filter by category (Plugin, Block, WooCommerce, REST API, Security, etc.)
3. Click a card to expand and see full instructions
4. Click **"📋 Copy Full Prompt"**
5. Paste into your AI assistant and get production-ready code

---

## 🆕 WP-AGENT Ultimate Features (v2026.ULTIMATE)

### 🎯 Multi-Editor Switchboard (6 New Tools)

| Builder | MCP Tool | Description |
|---------|----------|-------------|
| **Gutenberg** | `get_gutenberg_scaffold` | Generate block.json v3 + React components |
| **Elementor** | `get_elementor_scaffold` | Widget_Base class with controls |
| **Divi** | `get_divi_scaffold` | ET_Builder_Module with whitelisted_fields |
| **WPBakery** | `get_wpbakery_scaffold` | vc_map shortcode configuration |
| **Comparison** | `get_editor_comparison` | Builder comparison table |
| **CSS Vars** | `get_builder_css_vars` | CSS custom properties for builders |

### 🛍️ WooCommerce Enterprise (5 New Tools)

| Feature | MCP Tool | Description |
|---------|----------|-------------|
| **Subscriptions** | `get_subscriptions_guide` | WC_Subscription CRUD, renewal hooks |
| **Multi-Vendor** | `get_multivendor_guide` | Dokan/WCFM commission handling |
| **HPOS** | `get_hpos_guide` | High-Performance Order Storage |
| **Import/Export** | `get_import_export_guide` | Batch processing with Action Scheduler |
| **Product Add-ons** | `get_product_addons_guide` | Cart item data, custom pricing |

### 🎨 Figma-to-Code Engine (4 New Tools)

| Feature | MCP Tool | Description |
|---------|----------|-------------|
| **Token Extraction** | `extract_figma_tokens` | Colors, typography, spacing from Figma |
| **theme.json** | `generate_theme_json` | WordPress theme.json from tokens |
| **Block Generation** | `generate_block_from_figma` | Auto-generate Gutenberg blocks |
| **Component Detection** | `detect_component_type` | Map Figma to WordPress blocks |

### 🧪 Testing & CI/CD (5 New Tools)

| Feature | MCP Tool | Description |
|---------|----------|-------------|
| **PHPUnit** | `get_phpunit_config` | WordPress plugin test setup |
| **Pest PHP** | `get_pest_config` | Modern PHP testing |
| **WP_Mock** | `get_wpmock_setup` | Mock WordPress functions |
| **Playwright** | `get_playwright_setup` | E2E testing |
| **GitHub Actions** | `get_github_actions_workflow` | CI/CD pipeline |

---

## 📊 Total Capabilities

| Category | Count |
|----------|-------|
| **MCP Tools** | 50+ |
| **Basic Prompts** | 28 |
| **Advanced Developer Prompts** | 70+ |
| **Total Prompts** | 100+ |
| **Knowledge Base Sections** | 67 |
| **Code Snippet Topics** | 80+ |

---

## 📁 Project Structure

```
wp-agent/
├── README.md                 # This file
├── user.md                   # Detailed setup guide
├── wc-agent.md               # 67-section WordPress knowledge base (4700+ lines)
├── package-lock.json
├── .git/
└── mcp-server/
    ├── package.json
    ├── server.js             # MCP server entry point
    ├── test-all-commands.js  # Integration tests
    ├── test.log
    ├── lib/
    │   ├── parser.js         # Markdown parsing for wc-agent.md
    │   ├── search.js         # Fuzzy search (Fuse.js)
    │   ├── checklists.js     # Extract checklists from knowledge base
    │   ├── snippets.js       # Code snippet library
    │   ├── validator.js      # PHP static analysis
    │   ├── agent-skills.js   # WordPress/agent-skills integration
    │   ├── wp-actions.js     # WP-CLI action generation
    │   ├── wp-data.js        # Live WordPress data via WP-CLI
    │   └── skills/           # Official WordPress agent skill modules
    ├── public/               # Dashboard static assets
    └── tests/
        └── parser.test.js
```

---

## 📚 Knowledge Base Sections

| Section | Topic |
|---------|-------|
| 1-10 | Core Identity, Coding Standards (PHP/JS/CSS), Security Framework |
| 11-20 | Performance Optimization, Enterprise File Structure, CPTs/Taxonomies |
| 21-30 | Database Architecture, Hooks, Multi-Editor Support (Gutenberg/Elementor/Divi) |
| 31-40 | Plugin Ecosystem (ACF, WooCommerce, SEO, Forms, Membership) |
| 41-50 | Figma→WordPress Engine, REST API, GraphQL, AJAX, WP-CLI, Security Deep Dive |
| 51-60 | Code Review Standards, Testing, Documentation, Internationalization |
| 61-67 | Headless WordPress, Multisite, CI/CD, Production Readiness, Deployment |

---

## 🔐 Security Features

The knowledge base enforces:

- ✅ **Input Sanitization** — `sanitize_text_field()`, `sanitize_email()`, `intval()`
- ✅ **Output Escaping** — `esc_html()`, `esc_attr()`, `esc_url()`
- ✅ **Nonce Protection** — `wp_create_nonce()`, `wp_verify_nonce()`
- ✅ **Permission Checks** — `current_user_can()`, custom capabilities
- ✅ **SQL Injection Prevention** — `$wpdb->prepare()`, prepared statements
- ✅ **File Security** — `defined('ABSPATH')`, `wp_handle_upload()`
- ✅ **Rate Limiting** — Transient-based request throttling

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [WordPress/agent-skills](https://github.com/WordPress/agent-skills) — Official WordPress AI coding skills
- [Model Context Protocol](https://modelcontextprotocol.io) — MCP SDK
- [WordPress Coding Standards](https://developer.wordpress.org/coding-standards/) — WPCS
- [WooCommerce](https://woocommerce.com) — E-commerce framework

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the GitHub repository.

---

**Built with ❤️ for the WordPress community**
