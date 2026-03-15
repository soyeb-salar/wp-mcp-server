// ============================================
// ADVANCED DEVELOPER PROMPTS (50+ Prompts)
// ============================================
const advancedDeveloperPrompts = [
    // ==================== PLUGIN DEVELOPMENT (10 prompts) ====================
    {
        id: 'dev-plugin-boilerplate',
        category: 'plugin',
        icon: '🔌',
        title: 'Complete Plugin Boilerplate Generator',
        description: 'Generate a production-ready WordPress plugin with enterprise architecture.',
        difficulty: 3,
        tools: ['get_agent_skill', 'get_topic_snippets', 'validate_plugin_structure'],
        prompt: `I need to create a new WordPress plugin from scratch. Please:
1. Get the official agent skill for "wp-plugin-development"
2. Get code snippets for "singleton" pattern and "plugin-architecture"
3. Generate complete plugin boilerplate with proper header, namespace, activation/deactivation hooks, file structure, composer.json, and readme.txt
4. Validate the plugin structure meets enterprise standards`,
        output: 'Complete plugin boilerplate with 15+ files'
    },
    {
        id: 'dev-plugin-security',
        category: 'plugin',
        icon: '🔒',
        title: 'Security-Hardened Plugin Development',
        description: 'Build a plugin with OWASP guidelines and WordPress security best practices.',
        difficulty: 3,
        tools: ['get_security_checklist', 'get_owasp_mapping', 'analyze_php_code'],
        prompt: `I'm building a security-critical WordPress plugin. Please:
1. Get the Advanced Security Checklist and OWASP Top 10 WordPress mapping
2. Help implement: nonce verification, capability checks, input sanitization, output escaping, SQL injection prevention, CSRF protection
3. Analyze my PHP code for security vulnerabilities
4. Provide HTTP security headers configuration`,
        output: 'Security-hardened plugin code with audit report'
    },
    {
        id: 'dev-plugin-admin-page',
        category: 'plugin',
        icon: '⚙️',
        title: 'Plugin Admin Settings Page',
        description: 'Create admin settings page with Options API, validation, and sanitization.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'get_security_checklist'],
        prompt: `I need to create an admin settings page for my WordPress plugin. Please:
1. Get code snippets for "admin-settings" and "options-api"
2. Generate complete admin page with add_menu_page, register_setting, add_settings_section, add_settings_field
3. Include field types: text, textarea, select, checkbox, color picker, file upload
4. Add proper sanitization callbacks and nonce verification`,
        output: 'Complete admin settings page with validation'
    },
    {
        id: 'dev-plugin-ajax',
        category: 'plugin',
        icon: '🔄',
        title: 'AJAX Handler Implementation',
        description: 'Create secure AJAX handlers for admin and frontend with nonce checks.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'get_security_checklist'],
        prompt: `I need to implement AJAX functionality in my WordPress plugin. Please:
1. Get code snippets for "ajax-handler" and "wp-ajax"
2. Generate wp_ajax and wp_ajax_nopriv handlers with nonce verification, capability checks
3. Include JSON response with wp_send_json_success/error
4. Add example JavaScript (jQuery and vanilla fetch)`,
        output: 'Complete AJAX handler with admin and frontend support'
    },
    {
        id: 'dev-plugin-cron',
        category: 'plugin',
        icon: '⏰',
        title: 'WP-Cron Scheduled Events',
        description: 'Set up scheduled tasks using WordPress cron system with proper cleanup.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'search_knowledge'],
        prompt: `I need to implement scheduled tasks using WP-Cron. Please:
1. Get code snippets for "wp-cron" and "scheduled-events"
2. Generate cron implementation with wp_schedule_event on activation, callback function, wp_clear_scheduled_hook on deactivation
3. Include custom recurrence intervals and logging
4. Add WP-CLI command to run cron manually`,
        output: 'Complete WP-Cron implementation with hooks'
    },
    {
        id: 'dev-plugin-meta-box',
        category: 'plugin',
        icon: '🏷️',
        title: 'Custom Meta Boxes for Posts',
        description: 'Create custom meta boxes with proper save, validation, and nonce handling.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'get_security_checklist'],
        prompt: `I need to add custom meta boxes to WordPress posts/pages. Please:
1. Get code snippets for "meta-box" and "custom-fields"
2. Generate add_meta_box with rendering callback, nonce field, save_post handler
3. Include multiple field types with sanitization
4. Add repeatable meta box support`,
        output: 'Complete meta box implementation with save handler'
    },
    {
        id: 'dev-plugin-enqueue',
        category: 'plugin',
        icon: '📦',
        title: 'Script and Style Enqueue System',
        description: 'Properly enqueue scripts/styles with dependencies, versioning, conditional loading.',
        difficulty: 1,
        tools: ['get_topic_snippets'],
        prompt: `I need to properly enqueue scripts and styles in WordPress. Please:
1. Get code snippets for "enqueue-scripts"
2. Generate wp_enqueue_scripts implementation with dependencies, versioning, cache busting
3. Include conditional loading, async/defer attributes, wp_localize_script
4. Add admin enqueue with hook suffix check`,
        output: 'Complete script/style enqueue system'
    },
    {
        id: 'dev-plugin-i18n',
        category: 'plugin',
        icon: '🌐',
        title: 'Internationalization (i18n) Setup',
        description: 'Make plugin translation-ready with proper text domain and translation functions.',
        difficulty: 1,
        tools: ['get_topic_snippets'],
        prompt: `I need to make my WordPress plugin translation-ready. Please:
1. Get code snippets for "internationalization"
2. Generate load_plugin_textdomain implementation
3. Include all translation functions: __, _e, _x, _n, _nx, esc_html__, esc_attr__
4. Add WP-CLI wp i18n make-pot command`,
        output: 'Complete i18n setup with translation functions'
    },
    {
        id: 'dev-plugin-lifecycle',
        category: 'plugin',
        icon: '🚀',
        title: 'Activation/Deactivation/Uninstall Hooks',
        description: 'Implement proper plugin lifecycle hooks with database cleanup and rollback.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'generate_wp_action'],
        prompt: `I need to implement proper plugin lifecycle hooks. Please:
1. Get code snippets for "plugin-hooks" and "dbdelta"
2. Generate register_activation_hook with dbDelta, options, capabilities, cron
3. Add register_deactivation_hook to clear cron and transients
4. Create uninstall.php to delete all data`,
        output: 'Complete plugin lifecycle implementation'
    },
    {
        id: 'dev-plugin-rest-api',
        category: 'plugin',
        icon: '🔌',
        title: 'Custom REST API Endpoint',
        description: 'Create custom REST API routes for plugin with authentication and validation.',
        difficulty: 3,
        tools: ['get_agent_skill', 'get_topic_snippets', 'get_security_checklist'],
        prompt: `I need to create custom REST API endpoints for my plugin. Please:
1. Get the official agent skill for "wp-rest-api"
2. Generate WP_REST_Controller with namespace, routes, permission callbacks, schema
3. Include GET, POST, PUT, DELETE endpoints with proper validation
4. Add JavaScript fetch examples`,
        output: 'Complete REST API controller with CRUD'
    },

    // ==================== GUTENBERG BLOCKS (6 prompts) ====================
    {
        id: 'dev-block-json',
        category: 'block',
        icon: '🧩',
        title: 'Custom Gutenberg Block with block.json',
        description: 'Create modern Gutenberg block using block.json v3, React, and Interactivity API.',
        difficulty: 3,
        tools: ['get_topic_snippets', 'get_agent_skill'],
        prompt: `I need to create a custom Gutenberg block. Please:
1. Get code snippets for "gutenberg-block" and "block-json"
2. Generate block.json v3 with attributes, supports, scripts
3. Create edit.js with useBlockProps, InspectorControls, RichText
4. Add render.php for dynamic rendering, style.css, editor.css`,
        output: 'Complete Gutenberg block with all files'
    },
    {
        id: 'dev-block-dynamic',
        category: 'block',
        icon: '🔄',
        title: 'Dynamic Gutenberg Block',
        description: 'Create server-side rendered dynamic block with PHP render_callback.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to create a dynamic Gutenberg block with server-side rendering. Please:
1. Get code snippets for "dynamic-block"
2. Generate register_block_type with render_callback
3. Create PHP template for server rendering
4. Add block attributes passed to render_callback`,
        output: 'Dynamic block with PHP render_callback'
    },
    {
        id: 'dev-block-patterns',
        category: 'block',
        icon: '🎨',
        title: 'Block Patterns and Variations',
        description: 'Register custom block patterns and block variations for Gutenberg.',
        difficulty: 1,
        tools: ['get_topic_snippets'],
        prompt: `I need to register block patterns and variations. Please:
1. Get code snippets for "block-patterns"
2. Generate register_block_pattern with content, categories
3. Create block variations with attributes, innerBlocks
4. Add pattern category registration`,
        output: 'Block patterns and variations registration'
    },
    {
        id: 'dev-block-innerblocks',
        category: 'block',
        icon: '📦',
        title: 'Block with InnerBlocks Support',
        description: 'Create parent block that accepts and manages InnerBlocks.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to create a block with InnerBlocks support. Please:
1. Get code snippets for "innerblocks"
2. Generate block with InnerBlocks.TemplateLock, allowedBlocks
3. Create parent/child block relationship
4. Add block templates and default content`,
        output: 'Parent block with InnerBlocks support'
    },
    {
        id: 'dev-block-interactivity',
        category: 'block',
        icon: '⚡',
        title: 'Block with Interactivity API',
        description: 'Add frontend interactivity using WordPress Interactivity API.',
        difficulty: 3,
        tools: ['get_topic_snippets', 'search_knowledge'],
        prompt: `I need to add interactivity to my Gutenberg block. Please:
1. Get code snippets for "interactivity-api"
2. Generate block with data-wp-interactive directives
3. Create store with state, actions, callbacks
4. Add server-side state initialization`,
        output: 'Interactive block with Interactivity API'
    },
    {
        id: 'dev-block-metadata',
        category: 'block',
        icon: '📝',
        title: 'Block with Custom Metadata',
        description: 'Register block metadata and custom attributes with proper validation.',
        difficulty: 1,
        tools: ['get_topic_snippets'],
        prompt: `I need to add custom metadata to Gutenberg blocks. Please:
1. Get code snippets for "block-metadata"
2. Generate block.json with custom attributes
3. Add attribute validation and sanitization
4. Include block supports configuration`,
        output: 'Block with custom metadata and validation'
    },

    // ==================== WOOCOMMERCE (8 prompts) ====================
    {
        id: 'dev-woo-gateway',
        category: 'woocommerce',
        icon: '💳',
        title: 'Custom WooCommerce Payment Gateway',
        description: 'Build secure WooCommerce payment gateway with proper hooks and validation.',
        difficulty: 3,
        tools: ['get_topic_snippets', 'get_security_checklist'],
        prompt: `I need to create a custom WooCommerce payment gateway. Please:
1. Get code snippets for "woocommerce-gateway"
2. Generate class extending WC_Payment_Gateway with constructor, form fields, process_payment
3. Add refund functionality, webhook handling, HPOS compatibility
4. Include test/live mode, logging, subscription support`,
        output: 'Complete WooCommerce payment gateway'
    },
    {
        id: 'dev-woo-product-type',
        category: 'woocommerce',
        icon: '🏷️',
        title: 'Custom WooCommerce Product Type',
        description: 'Create custom product type extending WooCommerce product system.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'wp_woo_products'],
        prompt: `I need to create a custom WooCommerce product type. Please:
1. Get code snippets for "woocommerce-product-type"
2. Generate class extending WC_Product with get_type, is_type checks
3. Add admin product data metabox, custom fields
4. Include cart/checkout integration hooks`,
        output: 'Custom product type with admin integration'
    },
    {
        id: 'dev-woo-shipping',
        category: 'woocommerce',
        icon: '🚚',
        title: 'Custom WooCommerce Shipping Method',
        description: 'Create custom shipping method with rate calculation and zones.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to create a custom WooCommerce shipping method. Please:
1. Get code snippets for "woocommerce-shipping"
2. Generate class extending WC_Shipping_Method with calculate_shipping
3. Add admin settings, rate calculation, shipping zones support
4. Include free shipping threshold logic`,
        output: 'Custom shipping method with zones'
    },
    {
        id: 'dev-woo-subscriptions',
        category: 'woocommerce',
        icon: '🔄',
        title: 'WooCommerce Subscriptions Integration',
        description: 'Add subscription support to products with renewal handling.',
        difficulty: 3,
        tools: ['get_topic_snippets', 'search_knowledge'],
        prompt: `I need to integrate WooCommerce Subscriptions. Please:
1. Get code snippets for "woocommerce-subscriptions"
2. Generate subscription product type with billing period, interval
3. Add renewal order handling, suspension, cancellation
4. Include proration and trial period support`,
        output: 'Subscription integration with renewals'
    },
    {
        id: 'dev-woo-email',
        category: 'woocommerce',
        icon: '📧',
        title: 'Custom WooCommerce Email',
        description: 'Create custom WooCommerce transactional email with template.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to create a custom WooCommerce email. Please:
1. Get code snippets for "woocommerce-email"
2. Generate class extending WC_Email with trigger, subject, heading
3. Add email template, plain text version, attachments
4. Include admin email settings`,
        output: 'Custom WooCommerce email with template'
    },
    {
        id: 'dev-woo-cart-checkout',
        category: 'woocommerce',
        icon: '🛒',
        title: 'Cart and Checkout Customization',
        description: 'Customize WooCommerce cart and checkout with custom fields and validation.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'get_security_checklist'],
        prompt: `I need to customize WooCommerce cart and checkout. Please:
1. Get code snippets for "woocommerce-checkout"
2. Generate custom checkout fields with validation
3. Add cart item customization, fees, discounts
4. Include order meta save and display`,
        output: 'Cart/checkout customization with fields'
    },
    {
        id: 'dev-woo-rest-api',
        category: 'woocommerce',
        icon: '🔌',
        title: 'WooCommerce REST API Extension',
        description: 'Extend WooCommerce REST API with custom endpoints and data.',
        difficulty: 3,
        tools: ['get_topic_snippets', 'get_agent_skill'],
        prompt: `I need to extend WooCommerce REST API. Please:
1. Get code snippets for "woocommerce-rest-api"
2. Generate custom endpoints with permission checks
3. Add custom product/order data to responses
4. Include batch operations support`,
        output: 'Extended WooCommerce REST API'
    },
    {
        id: 'dev-woo-hooks',
        category: 'woocommerce',
        icon: '🎣',
        title: 'WooCommerce Hooks Reference',
        description: 'Get comprehensive list of WooCommerce action and filter hooks.',
        difficulty: 1,
        tools: ['search_knowledge', 'get_topic_snippets'],
        prompt: `I need a reference for WooCommerce hooks. Please:
1. Search knowledge base for "woocommerce hooks"
2. Get code snippets for common hook implementations
3. List action hooks: woocommerce_before_cart, woocommerce_checkout_fields, woocommerce_payment_complete
4. List filter hooks: woocommerce_product_get_price, woocommerce_checkout_fields`,
        output: 'Comprehensive WooCommerce hooks reference'
    },

    // ==================== REST API (4 prompts) ====================
    {
        id: 'dev-rest-controller',
        category: 'rest-api',
        icon: '🎮',
        title: 'REST Controller Class',
        description: 'Build complete REST controller extending WP_REST_Controller.',
        difficulty: 3,
        tools: ['get_agent_skill', 'get_topic_snippets'],
        prompt: `I need to create a REST controller class. Please:
1. Get the official agent skill for "wp-rest-api"
2. Generate class extending WP_REST_Controller with register_routes, permission callbacks, schema
3. Include get_items, get_item, create_item, update_item, delete_item
4. Add collection params and pagination`,
        output: 'Complete REST controller class'
    },
    {
        id: 'dev-rest-auth',
        category: 'rest-api',
        icon: '🔐',
        title: 'REST API Authentication',
        description: 'Implement authentication for REST API with application passwords and JWT.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'get_security_checklist'],
        prompt: `I need to implement REST API authentication. Please:
1. Get code snippets for "rest-authentication"
2. Generate application passwords setup
3. Add JWT authentication flow
4. Include custom auth callback`,
        output: 'REST API authentication implementation'
    },
    {
        id: 'dev-rest-batch',
        category: 'rest-api',
        icon: '📦',
        title: 'REST API Batch Requests',
        description: 'Support batch operations in custom REST API endpoints.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to add batch request support to my REST API. Please:
1. Get code snippets for "rest-batch"
2. Generate batch endpoint with multiple operations
3. Add transaction handling and rollback
4. Include error handling for partial failures`,
        output: 'Batch request support for REST API'
    },
    {
        id: 'dev-rest-schema',
        category: 'rest-api',
        icon: '📋',
        title: 'REST API Schema Design',
        description: 'Design comprehensive JSON schema for REST API responses.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to design REST API schema. Please:
1. Get code snippets for "rest-schema"
2. Generate get_item_schema with all properties
3. Add schema validation and sanitization
4. Include nested objects and relationships`,
        output: 'Complete REST API schema design'
    },

    // ==================== SECURITY (5 prompts) ====================
    {
        id: 'dev-security-audit',
        category: 'security',
        icon: '🔍',
        title: 'Complete Security Audit',
        description: 'Perform comprehensive security audit of WordPress code using MCP tools.',
        difficulty: 2,
        tools: ['get_security_checklist', 'get_owasp_mapping', 'analyze_php_code'],
        prompt: `I need to perform a security audit on my WordPress code. Please:
1. Get the Advanced Security Checklist and OWASP Top 10 mapping
2. Analyze code for: input sanitization, nonce implementation, capability checks, output escaping, SQL injection
3. Provide vulnerability report with severity levels
4. Give specific code fixes for each issue`,
        output: 'Security audit report with fixes'
    },
    {
        id: 'dev-security-nonce',
        category: 'security',
        icon: '🎫',
        title: 'Nonce Implementation Guide',
        description: 'Implement proper nonce verification for forms and AJAX.',
        difficulty: 1,
        tools: ['get_topic_snippets', 'get_security_checklist'],
        prompt: `I need to implement nonce verification. Please:
1. Get code snippets for "nonce"
2. Generate wp_nonce_field for forms, wp_create_nonce for AJAX
3. Add verify_nonce on submit with proper error handling
4. Include nonce in REST API headers`,
        output: 'Complete nonce implementation guide'
    },
    {
        id: 'dev-security-capabilities',
        category: 'security',
        icon: '🔑',
        title: 'Custom Capabilities and Roles',
        description: 'Create custom user capabilities and roles for fine-grained access control.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to create custom capabilities and roles. Please:
1. Get code snippets for "capabilities"
2. Generate add_role with custom capabilities
3. Add add_cap to existing roles
4. Include current_user_can checks throughout code`,
        output: 'Custom capabilities and roles setup'
    },
    {
        id: 'dev-security-file-upload',
        category: 'security',
        icon: '📤',
        title: 'Secure File Upload Handling',
        description: 'Implement secure file upload with validation and sanitization.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'get_security_checklist'],
        prompt: `I need to handle file uploads securely. Please:
1. Get code snippets for "file-upload"
2. Generate wp_handle_upload with mime type validation
3. Add file type checking, size limits, virus scanning consideration
4. Include secure storage and access controls`,
        output: 'Secure file upload implementation'
    },
    {
        id: 'dev-security-headers',
        category: 'security',
        icon: '📬',
        title: 'HTTP Security Headers',
        description: 'Configure HTTP security headers for WordPress site.',
        difficulty: 1,
        tools: ['get_security_headers', 'get_topic_snippets'],
        prompt: `I need to add HTTP security headers to WordPress. Please:
1. Get the security headers reference from MCP
2. Generate functions for: Content-Security-Policy, X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security
3. Add headers via .htaccess and PHP
4. Include CSP policy generator`,
        output: 'HTTP security headers configuration'
    },

    // ==================== PERFORMANCE (5 prompts) ====================
    {
        id: 'dev-performance-caching',
        category: 'performance',
        icon: '💾',
        title: 'Caching Strategy Implementation',
        description: 'Implement multi-layer caching with transients, object cache, and full-page cache.',
        difficulty: 3,
        tools: ['get_topic_snippets', 'search_knowledge'],
        prompt: `I need to implement caching strategy. Please:
1. Get code snippets for "caching" and "transients"
2. Generate transient implementation with expiration
3. Add object cache for expensive queries
4. Include full-page cache compatibility`,
        output: 'Multi-layer caching implementation'
    },
    {
        id: 'dev-performance-query',
        category: 'performance',
        icon: '🔍',
        title: 'WP_Query Optimization',
        description: 'Optimize WordPress queries for better performance.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'search_knowledge'],
        prompt: `I need to optimize WP_Query performance. Please:
1. Get code snippets for "wp-query-optimization"
2. Generate query with no_found_rows, update_post_meta_cache, update_post_term_cache
3. Add fields => ids optimization
4. Include query monitoring and debugging`,
        output: 'Optimized WP_Query implementation'
    },
    {
        id: 'dev-performance-assets',
        category: 'performance',
        icon: '📦',
        title: 'Asset Optimization Strategy',
        description: 'Optimize CSS, JS, and images for better Core Web Vitals.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'search_knowledge'],
        prompt: `I need to optimize site assets. Please:
1. Get code snippets for "asset-optimization"
2. Generate conditional script loading, defer/async attributes
3. Add critical CSS, lazy loading, WebP conversion
4. Include preload hints for LCP elements`,
        output: 'Asset optimization strategy'
    },
    {
        id: 'dev-performance-heartbeat',
        category: 'performance',
        icon: '💓',
        title: 'Heartbeat API Control',
        description: 'Control and optimize WordPress Heartbeat API.',
        difficulty: 1,
        tools: ['get_topic_snippets'],
        prompt: `I need to control the Heartbeat API. Please:
1. Get code snippets for "heartbeat"
2. Generate heartbeat_settings filter to change interval
3. Add frontend disable on non-editor pages
4. Include autosave optimization`,
        output: 'Heartbeat API optimization'
    },
    {
        id: 'dev-performance-database',
        category: 'performance',
        icon: '🗄️',
        title: 'Database Optimization',
        description: 'Optimize WordPress database with indexes and query caching.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'search_knowledge'],
        prompt: `I need to optimize the WordPress database. Please:
1. Get code snippets for "database-optimization"
2. Generate custom table with proper indexes
3. Add query caching with $wpdb->get_results
4. Include slow query logging setup`,
        output: 'Database optimization guide'
    },

    // ==================== DATABASE (4 prompts) ====================
    {
        id: 'dev-db-custom-tables',
        category: 'database',
        icon: '📊',
        title: 'Custom Database Tables',
        description: 'Create custom tables with dbDelta, proper schema, and indexes.',
        difficulty: 3,
        tools: ['get_topic_snippets', 'generate_wp_action'],
        prompt: `I need to create custom database tables. Please:
1. Get code snippets for "dbdelta" and "custom-tables"
2. Generate CREATE TABLE with dbDelta compatibility, columns, indexes
3. Add table class with CRUD operations using $wpdb->prepare
4. Include migration system with version tracking`,
        output: 'Custom tables with CRUD class'
    },
    {
        id: 'dev-db-migrations',
        category: 'database',
        icon: '🔄',
        title: 'Database Migrations System',
        description: 'Implement database migrations for schema updates.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to implement database migrations. Please:
1. Get code snippets for "database-migrations"
2. Generate migration class with up/down methods
3. Add version tracking in options
4. Include rollback capability`,
        output: 'Database migrations system'
    },
    {
        id: 'dev-db-queries',
        category: 'database',
        icon: '🔍',
        title: 'Advanced $wpdb Queries',
        description: 'Write complex database queries with $wpdb safely.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to write advanced $wpdb queries. Please:
1. Get code snippets for "wpdb-queries"
2. Generate $wpdb->prepare with placeholders
3. Add INSERT, UPDATE, DELETE with proper escaping
4. Include JOIN queries and subqueries`,
        output: 'Advanced $wpdb queries guide'
    },
    {
        id: 'dev-db-indexes',
        category: 'database',
        icon: '📑',
        title: 'Database Indexing Strategy',
        description: 'Design proper database indexes for query performance.',
        difficulty: 2,
        tools: ['get_topic_snippets', 'search_knowledge'],
        prompt: `I need to design database indexes. Please:
1. Get code snippets for "database-indexes"
2. Generate ALTER TABLE ADD INDEX for WHERE columns
3. Add composite indexes for multi-column queries
4. Include EXPLAIN query analysis`,
        output: 'Database indexing strategy'
    },

    // ==================== TESTING (4 prompts) ====================
    {
        id: 'dev-testing-phpunit',
        category: 'testing',
        icon: '🧪',
        title: 'PHPUnit Test Setup',
        description: 'Set up PHPUnit testing environment for WordPress plugin.',
        difficulty: 3,
        tools: ['search_knowledge', 'get_topic_snippets'],
        prompt: `I need to set up PHPUnit testing. Please:
1. Get code snippets for "phpunit" and "testing"
2. Generate composer.json with testing dependencies, phpunit.xml
3. Add bootstrap.php and test base class
4. Include GitHub Actions workflow`,
        output: 'PHPUnit testing setup'
    },
    {
        id: 'dev-testing-wpmock',
        category: 'testing',
        icon: '🎭',
        title: 'WP_Mock Unit Tests',
        description: 'Write unit tests mocking WordPress functions.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to write unit tests with WP_Mock. Please:
1. Get code snippets for "wpmock"
2. Generate test class extending WP_Mock\TestCase
3. Mock WordPress functions with expectAction, expectFilter
4. Add data providers and assertions`,
        output: 'WP_Mock unit tests'
    },
    {
        id: 'dev-testing-integration',
        category: 'testing',
        icon: '🔗',
        title: 'Integration Tests',
        description: 'Write integration tests with WordPress test suite.',
        difficulty: 3,
        tools: ['search_knowledge'],
        prompt: `I need to write integration tests. Please:
1. Search for "integration-tests"
2. Generate test class with WP_UnitTestCase
3. Add factory usage for posts, users, terms
4. Include setUp and tearDown methods`,
        output: 'Integration tests setup'
    },
    {
        id: 'dev-testing-e2e',
        category: 'testing',
        icon: '🌐',
        title: 'E2E Tests with Playwright',
        description: 'Set up end-to-end testing for WordPress with Playwright.',
        difficulty: 2,
        tools: ['search_knowledge'],
        prompt: `I need to set up E2E testing. Please:
1. Search for "e2e-testing"
2. Generate Playwright config for WordPress
3. Add test for login, post creation, plugin activation
4. Include CI/CD integration`,
        output: 'E2E testing with Playwright'
    },

    // ==================== THEME DEVELOPMENT (4 prompts) ====================
    {
        id: 'dev-theme-setup',
        category: 'theme',
        icon: '🎨',
        title: 'Theme Setup and Features',
        description: 'Set up theme with proper supports, menus, widgets, and customizer.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to set up a WordPress theme. Please:
1. Get code snippets for "theme-setup"
2. Generate add_theme_support for post-thumbnails, custom-logo, menus
3. Add register_nav_menus, register_sidebar
4. Include customizer settings`,
        output: 'Complete theme setup'
    },
    {
        id: 'dev-theme-json',
        category: 'theme',
        icon: '📋',
        title: 'theme.json Configuration',
        description: 'Configure theme.json for block editor settings and styles.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to configure theme.json. Please:
1. Get code snippets for "theme-json"
2. Generate settings for colors, typography, spacing
3. Add custom templates and template parts
4. Include style variations`,
        output: 'theme.json configuration'
    },
    {
        id: 'dev-theme-customizer',
        category: 'theme',
        icon: '⚙️',
        title: 'Customizer API Implementation',
        description: 'Add custom Customizer panels, sections, and controls.',
        difficulty: 2,
        tools: ['get_topic_snippets'],
        prompt: `I need to extend the WordPress Customizer. Please:
1. Get code snippets for "customizer-api"
2. Generate add_panel, add_section, add_setting
3. Add custom controls with sanitization
4. Include live preview with postMessage`,
        output: 'Customizer API implementation'
    },
    {
        id: 'dev-theme-child',
        category: 'theme',
        icon: '👶',
        title: 'Child Theme Creation',
        description: 'Create child theme with proper inheritance and overrides.',
        difficulty: 1,
        tools: ['get_topic_snippets'],
        prompt: `I need to create a child theme. Please:
1. Get code snippets for "child-theme"
2. Generate style.css with Template header
3. Add functions.php with wp_enqueue_style for parent
4. Include template overrides`,
        output: 'Child theme setup'
    },

    // ==================== MULTI-EDITOR SWITCHBOARD (6 prompts) ====================
    {
        id: 'dev-editor-gutenberg',
        category: 'multi-editor',
        icon: '🧩',
        title: 'Gutenberg Block with block.json v3',
        description: 'Generate modern Gutenberg block with block.json v3, React, and Interactivity API.',
        difficulty: 3,
        tools: ['get_gutenberg_scaffold', 'get_topic_snippets', 'get_agent_skill'],
        prompt: `I need to create a custom Gutenberg block. Please:
1. Get Gutenberg scaffold with block.json v3 for block named "hero-section"
2. Get code snippets for "gutenberg-block" and "interactivity-api"
3. Get the official agent skill for "wp-block-development"
4. Generate complete block with edit.js, save.js, render.php, and styles`,
        output: 'Complete Gutenberg block with all files'
    },
    {
        id: 'dev-editor-elementor',
        category: 'multi-editor',
        icon: '🎨',
        title: 'Elementor Widget Development',
        description: 'Create custom Elementor widget extending Widget_Base class.',
        difficulty: 2,
        tools: ['get_elementor_scaffold', 'get_topic_snippets'],
        prompt: `I need to create a custom Elementor widget. Please:
1. Get Elementor scaffold for widget "price-table"
2. Get code snippets for "elementor-widget"
3. Generate widget with register_controls(), render(), and _content_template()
4. Include all control types: text, textarea, select, color, repeater`,
        output: 'Complete Elementor widget class'
    },
    {
        id: 'dev-editor-divi',
        category: 'multi-editor',
        icon: '🔷',
        title: 'Divi Module Development',
        description: 'Create custom Divi module extending ET_Builder_Module.',
        difficulty: 2,
        tools: ['get_divi_scaffold', 'get_topic_snippets'],
        prompt: `I need to create a custom Divi module. Please:
1. Get Divi scaffold for module "testimonial-slider"
2. Get code snippets for "divi-module"
3. Generate module with get_fields(), render(), and whitelisted_fields
4. Include advanced design fields support`,
        output: 'Complete Divi module class'
    },
    {
        id: 'dev-editor-comparison',
        category: 'multi-editor',
        icon: '📊',
        title: 'Page Builder Comparison',
        description: 'Get detailed comparison of Gutenberg, Elementor, Divi, and WPBakery.',
        difficulty: 1,
        tools: ['get_editor_comparison'],
        prompt: `Get comparison table of all page builders with:
- Architecture and best use cases
- Learning curve and market share
- Recommendations for different project types`,
        output: 'Builder comparison table'
    },
    {
        id: 'dev-editor-css-vars',
        category: 'multi-editor',
        icon: '🎨',
        title: 'Builder CSS Variables Reference',
        description: 'Get CSS custom properties for Elementor, Divi, or Gutenberg.',
        difficulty: 1,
        tools: ['get_builder_css_vars'],
        prompt: `Get CSS variables for "elementor" builder including:
- Global colors (--e-global-color-*)
- Typography (--e-global-typography-*)
- Spacing variables`,
        output: 'CSS variables reference'
    },

    // ==================== WOOCOMMERCE ENTERPRISE (8 prompts) ====================
    {
        id: 'dev-woo-subscriptions',
        category: 'woocommerce-enterprise',
        icon: '🔄',
        title: 'WooCommerce Subscriptions Integration',
        description: 'Integrate WooCommerce Subscriptions with renewal handling.',
        difficulty: 3,
        tools: ['get_subscriptions_guide', 'get_topic_snippets'],
        prompt: `I need to integrate WooCommerce Subscriptions. Please:
1. Get Subscriptions guide with hooks and examples
2. Generate subscription product creation code
3. Implement wcs_renewal_order_created hook
4. Add subscription meta handling with WC_Subscription CRUD`,
        output: 'Subscriptions integration code'
    },
    {
        id: 'dev-woo-multivendor',
        category: 'woocommerce-enterprise',
        icon: '🏪',
        title: 'Multi-Vendor Marketplace (Dokan/WCFM)',
        description: 'Integrate Dokan or WCFM multi-vendor functionality.',
        difficulty: 3,
        tools: ['get_multivendor_guide', 'get_topic_snippets'],
        prompt: `I need to build a multi-vendor marketplace. Please:
1. Get Multi-Vendor guide for Dokan
2. Generate vendor commission calculation code
3. Implement dokan_get_seller_earnings_by_order
4. Add vendor-specific shipping logic`,
        output: 'Multi-vendor integration'
    },
    {
        id: 'dev-woo-hpos',
        category: 'woocommerce-enterprise',
        icon: '⚡',
        title: 'HPOS Compatibility',
        description: 'Make plugin compatible with High-Performance Order Storage.',
        difficulty: 2,
        tools: ['get_hpos_guide', 'get_topic_snippets'],
        prompt: `I need HPOS compatibility for my plugin. Please:
1. Get HPOS guide
2. Generate declare_compatibility code for before_woocommerce_init
3. Convert WP_Query to wc_get_orders
4. Add proper order CRUD with WC_Order`,
        output: 'HPOS-compatible code'
    },
    {
        id: 'dev-woo-import',
        category: 'woocommerce-enterprise',
        icon: '📥',
        title: 'Product Import/Export with Batch Processing',
        description: 'Implement batch product import/export with Action Scheduler.',
        difficulty: 3,
        tools: ['get_import_export_guide', 'get_topic_snippets'],
        prompt: `I need to import 1000+ products. Please:
1. Get Import/Export guide with WC_Product_CSV_Importer
2. Generate batch processing with Action Scheduler
3. Add vendor assignment for multi-vendor
4. Include error handling and logging`,
        output: 'Batch import system'
    },

    // ==================== FIGMA-TO-CODE (4 prompts) ====================
    {
        id: 'dev-figma-tokens',
        category: 'figma-to-code',
        icon: '🎨',
        title: 'Extract Design Tokens from Figma',
        description: 'Extract colors, typography, and spacing from Figma design.',
        difficulty: 2,
        tools: ['extract_figma_tokens', 'generate_theme_json'],
        prompt: `I have Figma design data. Please:
1. Extract design tokens (colors, typography, spacing, shadows)
2. Generate WordPress theme.json from tokens
3. Create CSS custom properties
4. Map Figma components to WordPress blocks`,
        output: 'Design tokens and theme.json'
    },
    {
        id: 'dev-figma-block',
        category: 'figma-to-code',
        icon: '🧩',
        title: 'Generate Gutenberg Block from Figma',
        description: 'Convert Figma component to Gutenberg block automatically.',
        difficulty: 3,
        tools: ['generate_block_from_figma', 'detect_component_type'],
        prompt: `Convert this Figma component to Gutenberg block:
1. Detect component type (Button → core/button, etc.)
2. Generate block.json with proper attributes
3. Create edit.js and save.js components
4. Add CSS variables from Figma tokens`,
        output: 'Complete Gutenberg block'
    },

    // ==================== TESTING & CI/CD (6 prompts) ====================
    {
        id: 'dev-testing-phpunit',
        category: 'testing',
        icon: '🧪',
        title: 'PHPUnit Test Suite Setup',
        description: 'Set up complete PHPUnit testing for WordPress plugin.',
        difficulty: 3,
        tools: ['get_phpunit_config', 'get_wpmock_setup'],
        prompt: `I need PHPUnit testing for my plugin. Please:
1. Get PHPUnit configuration with composer.json
2. Generate phpunit.xml and bootstrap.php
3. Set up WP_Mock for WordPress function mocking
4. Create example unit tests for main plugin class`,
        output: 'Complete PHPUnit setup'
    },
    {
        id: 'dev-testing-pest',
        category: 'testing',
        icon: '🐛',
        title: 'Pest PHP Testing',
        description: 'Set up modern Pest PHP testing with elegant syntax.',
        difficulty: 2,
        tools: ['get_pest_config'],
        prompt: `I want to use Pest PHP for testing. Please:
1. Get Pest configuration with composer.json
2. Generate pest.php config file
3. Create example tests with expect() syntax
4. Add custom expectations for WordPress`,
        output: 'Pest PHP testing setup'
    },
    {
        id: 'dev-testing-e2e',
        category: 'testing',
        icon: '🌐',
        title: 'Playwright E2E Testing',
        description: 'Set up Playwright for WordPress E2E testing.',
        difficulty: 3,
        tools: ['get_playwright_setup'],
        prompt: `I need E2E testing for my WordPress site. Please:
1. Get Playwright setup with @playwright/test
2. Generate playwright.config.js
3. Create tests for: login, post creation, plugin activation, WooCommerce checkout
4. Add GitHub Actions integration`,
        output: 'Playwright E2E tests'
    },
    {
        id: 'dev-testing-github-actions',
        category: 'testing',
        icon: '⚙️',
        title: 'GitHub Actions CI/CD Pipeline',
        description: 'Set up complete CI/CD pipeline with testing and deployment.',
        difficulty: 3,
        tools: ['get_github_actions_workflow'],
        prompt: `I need CI/CD for my WordPress plugin. Please:
1. Get GitHub Actions workflow with matrix testing
2. Include PHP 8.1/8.2/8.3 and WordPress latest
3. Add MySQL service for integration tests
4. Include PHPUnit, PHPCS, PHPStan, and E2E jobs`,
        output: 'Complete CI/CD workflow'
    }
];
