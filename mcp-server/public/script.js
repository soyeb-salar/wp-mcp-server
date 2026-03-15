// WP-MCP Server Dashboard - Advanced Analytics Edition
// Connect to Socket.io server
const socket = io();

// ============================================
// PROMPTS LIBRARY (30+ Basic Prompts)
// ============================================
const promptsLibrary = [
    { id: 'kb-list-sections', category: 'knowledge', icon: '📖', title: 'List All Knowledge Sections', description: 'View all 67 major sections in the WP-AGENT knowledge base.', tool: 'list_sections', prompt: 'Use the wp-mcp-server to list all available knowledge base sections.', usage: 'Browse topics' },
    { id: 'kb-get-section', category: 'knowledge', icon: '📄', title: 'Get Specific Section', description: 'Retrieve full content of a section by number (1-67).', tool: 'get_section', prompt: 'Get section 41 from wp-mcp-server. I need the complete security guidelines.', usage: 'Deep dive' },
    { id: 'kb-get-subsection', category: 'knowledge', icon: '📑', title: 'Get Specific Subsection', description: 'Retrieve a specific subsection (e.g., 41.4 for SQL Injection).', tool: 'get_subsection', prompt: 'Get subsection 41.4 from wp-mcp-server for SQL injection prevention.', usage: 'Targeted lookup' },
    { id: 'kb-search', category: 'knowledge', icon: '🔍', title: 'Search Knowledge Base', description: 'Fuzzy search across the entire knowledge base.', tool: 'search_knowledge', prompt: 'Search wp-mcp-server for "nonce verification" with top 5 results.', usage: 'Find info' },
    { id: 'cl-security', category: 'checklist', icon: '🔒', title: 'Security Checklist', description: 'Get the pre-ship Advanced Security checklist.', tool: 'get_security_checklist', prompt: 'Get the Advanced Security Checklist from wp-mcp-server.', usage: 'Pre-ship check' },
    { id: 'cl-code-review', category: 'checklist', icon: '📝', title: 'Code Review Checklist', description: 'Get the 5-part Code Review checklist for PRs.', tool: 'get_code_review_checklist', prompt: 'Get the Code Review Checklist from wp-mcp-server for my PR.', usage: 'PR prep' },
    { id: 'cl-production', category: 'checklist', icon: '🚀', title: 'Production Readiness', description: 'Get the 7-part Production Readiness checklist.', tool: 'get_production_checklist', prompt: 'Get the Production Readiness Checklist from wp-mcp-server.', usage: 'Deploy prep' },
    { id: 'cl-owasp', category: 'checklist', icon: '🛡️', title: 'OWASP Mapping', description: 'Get OWASP Top 10 WordPress mapping.', tool: 'get_owasp_mapping', prompt: 'Get the OWASP Top 10 WordPress mapping.', usage: 'Security audit' },
    { id: 'cl-security-headers', category: 'checklist', icon: '📬', title: 'Security Headers', description: 'Get HTTP Security Headers reference.', tool: 'get_security_headers', prompt: 'Get HTTP Security Headers reference.', usage: 'Server config' },
    { id: 'cl-deploy', category: 'checklist', icon: '⌨️', title: 'WP-CLI Deploy', description: 'Get WP-CLI post-deploy commands.', tool: 'get_deploy_commands', prompt: 'Get WP-CLI post-deploy commands.', usage: 'Deployment' },
    { id: 'sn-list', category: 'snippet', icon: '📚', title: 'List Snippet Topics', description: 'List all available snippet topics.', tool: 'list_snippet_topics', prompt: 'List all snippet topics from wp-mcp-server.', usage: 'Browse code' },
    { id: 'sn-get', category: 'snippet', icon: '💻', title: 'Get Topic Snippets', description: 'Get code examples for a topic.', tool: 'get_topic_snippets', prompt: 'Get PHP snippets for "custom post types".', usage: 'Get code' },
    { id: 'val-structure', category: 'validation', icon: '🏗️', title: 'Validate Plugin Structure', description: 'Check plugin has required files.', tool: 'validate_plugin_structure', prompt: 'Check if my plugin has all required enterprise files.', usage: 'Audit' },
    { id: 'val-analyze', category: 'validation', icon: '🔬', title: 'Analyze PHP Code', description: 'Run static analysis on PHP code.', tool: 'analyze_php_code', prompt: 'Analyze this PHP code for security issues.', usage: 'Code review' },
    { id: 'val-header', category: 'validation', icon: '🏷️', title: 'Validate Plugin Header', description: 'Check plugin header meets standards.', tool: 'validate_plugin_header', prompt: 'Validate this plugin header.', usage: 'Compliance' },
    { id: 'ag-list', category: 'agent', icon: '🎓', title: 'List Agent Skills', description: 'List official WordPress agent skills.', tool: 'list_agent_skills', prompt: 'List all WordPress agent skills.', usage: 'Browse' },
    { id: 'ag-get', category: 'agent', icon: '📖', title: 'Get Agent Skill', description: 'Get skill instructions.', tool: 'get_agent_skill', prompt: 'Get skill instructions for "wp-plugin-development".', usage: 'Learn' },
    { id: 'act-post', category: 'action', icon: '📝', title: 'Create Post', description: 'Generate WP-CLI to create post.', tool: 'generate_wp_action', prompt: 'Generate WP-CLI to create draft post "Hello World".', usage: 'Create' },
    { id: 'act-user', category: 'action', icon: '👤', title: 'Create User', description: 'Generate WP-CLI to create user.', tool: 'generate_wp_action', prompt: 'Generate WP-CLI to create user "testuser".', usage: 'Create' },
    { id: 'wp-posts', category: 'wordpress', icon: '📰', title: 'Get Posts', description: 'Read live posts from site.', tool: 'wp_get_posts', prompt: 'Get 10 recent blog posts.', usage: 'Query' },
    { id: 'wp-post', category: 'wordpress', icon: '📄', title: 'Get Single Post', description: 'Read post by ID.', tool: 'wp_get_post', prompt: 'Get post ID 42.', usage: 'Query' },
    { id: 'wp-users', category: 'wordpress', icon: '👥', title: 'Get Users', description: 'Read live users.', tool: 'wp_get_users', prompt: 'Get all administrator users.', usage: 'Query' },
    { id: 'wp-settings', category: 'wordpress', icon: '⚙️', title: 'Get Settings', description: 'Read WordPress options.', tool: 'wp_get_settings', prompt: 'Get all autoloaded settings.', usage: 'Query' },
    { id: 'wp-products', category: 'wordpress', icon: '🛍️', title: 'Get Products', description: 'Read WooCommerce products.', tool: 'wp_woo_products', prompt: 'Get 10 published products.', usage: 'Query' },
    { id: 'wp-orders', category: 'wordpress', icon: '📦', title: 'Get Orders', description: 'Read WooCommerce orders.', tool: 'wp_woo_orders', prompt: 'Get recent completed orders.', usage: 'Query' },
    { id: 'wp-terms', category: 'wordpress', icon: '🏷️', title: 'Get Terms', description: 'Read taxonomy terms.', tool: 'wp_get_terms', prompt: 'Get all categories.', usage: 'Query' },
    { id: 'wp-cpts', category: 'wordpress', icon: '📋', title: 'Get Post Types', description: 'Read registered post types.', tool: 'wp_get_post_types', prompt: 'List all custom post types.', usage: 'Query' },
    { id: 'wp-tax', category: 'wordpress', icon: '🔖', title: 'Get Taxonomies', description: 'Read registered taxonomies.', tool: 'wp_get_taxonomies', prompt: 'List all taxonomies.', usage: 'Query' }
];

// ============================================
// STATE MANAGEMENT
// ============================================
const state = {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    totalResponseTime: 0,
    responseTimes: [],
    toolCounts: {},
    categoryCounts: {
        knowledge: 0,
        checklist: 0,
        snippet: 0,
        validation: 0,
        agentSkill: 0,
        action: 0,
        wpData: 0
    },
    activeCalls: new Map(),
    logs: [],
    timelineData: [],
    requestsPerMinute: [],
    dataProcessed: 0
};

// Tool category mapping
const toolCategories = {
    list_sections: 'knowledge', get_section: 'knowledge', get_subsection: 'knowledge', search_knowledge: 'knowledge',
    get_security_checklist: 'checklist', get_code_review_checklist: 'checklist', get_production_checklist: 'checklist',
    get_owasp_mapping: 'checklist', get_security_headers: 'checklist', get_deploy_commands: 'checklist',
    list_snippet_topics: 'snippet', get_topic_snippets: 'snippet',
    validate_plugin_structure: 'validation', analyze_php_code: 'validation', validate_plugin_header: 'validation',
    list_agent_skills: 'agentSkill', get_agent_skill: 'agentSkill',
    generate_wp_action: 'action',
    wp_get_posts: 'wpData', wp_get_post: 'wpData', wp_get_users: 'wpData', wp_get_settings: 'wpData',
    wp_woo_products: 'wpData', wp_woo_orders: 'wpData', wp_get_terms: 'wpData',
    wp_get_post_types: 'wpData', wp_get_taxonomies: 'wpData'
};

// Chart instances
let charts = { requests: null, distribution: null, responseTime: null, successError: null, category: null };

// ============================================
// DOM ELEMENTS
// ============================================
const elements = {
    connectionStatus: document.getElementById('connection-status'),
    activityFeed: document.getElementById('activity-feed'),
    emptyState: document.getElementById('empty-state'),
    totalRequests: document.getElementById('total-requests'),
    avgResponseTime: document.getElementById('avg-response-time'),
    successRate: document.getElementById('success-rate'),
    requestsPerMinute: document.getElementById('requests-per-minute'),
    recentToolsList: document.getElementById('recent-tools-list'),
    activityTimeline: document.getElementById('activity-timeline'),
    clearLogsBtn: document.getElementById('clear-logs-btn'),
    exportLogsBtn: document.getElementById('export-logs-btn'),
    searchInput: document.getElementById('search-logs'),
    filterType: document.getElementById('filter-type'),
    viewToggles: document.querySelectorAll('.view-toggle'),
    analyticsView: document.getElementById('analytics-view'),
    activityFeedView: document.getElementById('activity-feed'),
    promptsView: document.getElementById('prompts-view'),
    promptsGrid: document.getElementById('prompts-grid'),
    searchPrompts: document.getElementById('search-prompts'),
    filterCategory: document.getElementById('filter-category'),
    customPromptsView: document.getElementById('custom-prompts-view'),
    customPromptsContainer: document.getElementById('custom-prompts-container'),
    searchCustomPrompts: document.getElementById('search-custom-prompts'),
    filterCustomCategory: document.getElementById('filter-custom-category'),
    rtMin: document.getElementById('rt-min'), rtAvg: document.getElementById('rt-avg'),
    rtMax: document.getElementById('rt-max'), rtP95: document.getElementById('rt-p95'),
    successCount: document.getElementById('success-count'), errorCount: document.getElementById('error-count'),
    successRateDetail: document.getElementById('success-rate-detail'),
    metricTotalCalls: document.getElementById('metric-total-calls'),
    metricKbQueries: document.getElementById('metric-kb-queries'),
    metricValidations: document.getElementById('metric-validations'),
    metricWpData: document.getElementById('metric-wp-data'),
    metricUniqueTools: document.getElementById('metric-unique-tools'),
    metricDataSize: document.getElementById('metric-data-size')
};

// ============================================
// SOCKET CONNECTION
// ============================================
socket.on('connect', () => {
    elements.connectionStatus.className = 'status-indicator connected';
    elements.connectionStatus.querySelector('span').textContent = 'Connected';
});

socket.on('disconnect', () => {
    elements.connectionStatus.className = 'status-indicator disconnected';
    elements.connectionStatus.querySelector('span').textContent = 'Disconnected';
});

socket.on('tool_call', (data) => {
    if (elements.emptyState) elements.emptyState.style.display = 'none';
    state.totalRequests++;
    state.activeCalls.set(data.id, { ...data, startTime: Date.now() });
    const category = toolCategories[data.name] || 'knowledge';
    state.categoryCounts[category]++;
    updateStats();
    updateRecentTools();
    updateTimeline(data);
    addCallLog(data);
    updateRequestsPerMinute();
});

socket.on('tool_response', (data) => {
    const call = state.activeCalls.get(data.id);
    if (call) {
        const duration = data.duration || (Date.now() - call.startTime);
        const isError = data.result && data.result.isError;
        state.responseTimes.push(duration);
        state.totalResponseTime += duration;
        if (isError) state.failedRequests++;
        else state.successfulRequests++;
        state.dataProcessed += JSON.stringify(data.result).length;
        state.activeCalls.delete(data.id);
        updateStats();
        appendResponseToLog(call, data, duration, isError);
        updateCharts();
    }
});

// ============================================
// STATS UPDATES
// ============================================
function updateStats() {
    elements.totalRequests.textContent = state.totalRequests.toLocaleString();
    const avgTime = state.totalRequests > 0 ? Math.round(state.totalResponseTime / state.totalRequests) : 0;
    elements.avgResponseTime.textContent = `${avgTime}ms`;
    const total = state.successfulRequests + state.failedRequests;
    const rate = total > 0 ? Math.round((state.successfulRequests / total) * 100) : 100;
    elements.successRate.textContent = `${rate}%`;
    elements.metricTotalCalls.textContent = state.totalRequests.toLocaleString();
    elements.metricKbQueries.textContent = state.categoryCounts.knowledge.toLocaleString();
    elements.metricValidations.textContent = state.categoryCounts.validation.toLocaleString();
    elements.metricWpData.textContent = state.categoryCounts.wpData.toLocaleString();
    elements.metricUniqueTools.textContent = Object.keys(state.toolCounts).length.toLocaleString();
    elements.metricDataSize.textContent = formatBytes(state.dataProcessed);
}

function updateRequestsPerMinute() {
    const now = Date.now();
    const recentLogs = state.logs.filter(log => log.timestamp > now - 60000);
    elements.requestsPerMinute.textContent = recentLogs.length;
    state.requestsPerMinute.push({ time: now, count: recentLogs.length });
    if (state.requestsPerMinute.length > 60) state.requestsPerMinute.shift();
}

function updateRecentTools() {
    elements.recentToolsList.innerHTML = '';
    const sortedTools = Object.entries(state.toolCounts).sort((a, b) => b[1] - a[1]).slice(0, 8);
    sortedTools.forEach(([name, count], index) => {
        const li = document.createElement('li');
        li.className = 'tool-list-item';
        li.innerHTML = `<div class="tool-name-wrapper"><span class="tool-rank">${index + 1}</span><span>${name}</span></div><span class="tool-count-badge">${count}</span>`;
        li.addEventListener('click', () => filterByTool(name));
        elements.recentToolsList.appendChild(li);
    });
}

function updateTimeline(data) {
    const time = new Date(data.timestamp).toLocaleTimeString();
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `<span class="timeline-time">${time}</span><div class="timeline-content"><span class="timeline-tool">${data.name}</span></div>`;
    elements.activityTimeline.insertBefore(timelineItem, elements.activityTimeline.firstChild);
    if (elements.activityTimeline.children.length > 10) elements.activityTimeline.removeChild(elements.activityTimeline.lastChild);
}

// ============================================
// LOG CARDS
// ============================================
function addCallLog(data) {
    const logCard = document.createElement('div');
    logCard.className = 'log-card';
    logCard.dataset.id = data.id;
    logCard.dataset.tool = data.name.toLowerCase();
    logCard.dataset.category = toolCategories[data.name] || 'knowledge';
    state.logs.push({ id: data.id, name: data.name, timestamp: Date.now(), arguments: data.arguments, type: 'call' });
    logCard.innerHTML = `
        <div class="log-header">
            <div class="log-meta"><span class="log-type type-call">CALL</span><span class="log-tool-name">${data.name}</span></div>
            <div class="log-time" id="time-${data.id}"><div class="pending-indicator"><div class="pending-spinner"></div><span>Executing...</span></div></div>
        </div>
        <div class="log-body">
            <div class="log-section"><h4>Arguments <button class="copy-btn" onclick="copyToClipboard('${data.id}-args')">Copy</button></h4><pre><code id="${data.id}-args">${syntaxHighlight(JSON.stringify(data.arguments, null, 2))}</code></pre></div>
            <div id="response-${data.id}" class="log-section response-section" style="display: none;"></div>
        </div>`;
    if (elements.activityFeed.firstChild === elements.emptyState) elements.activityFeed.appendChild(logCard);
    else elements.activityFeed.insertBefore(logCard, elements.activityFeed.firstChild);
    if (elements.activityFeed.children.length > 50) elements.activityFeed.removeChild(elements.activityFeed.lastChild);
}

function appendResponseToLog(callData, responseData, duration, isError) {
    const logCard = document.querySelector(`[data-id="${responseData.id}"]`);
    if (!logCard) return;
    const timeDiv = logCard.querySelector(`#time-${responseData.id}`);
    const timeStr = new Date(responseData.timestamp).toLocaleTimeString();
    const typeClass = isError ? 'type-error' : 'type-response';
    logCard.querySelector('.log-type').className = `log-type ${typeClass}`;
    logCard.querySelector('.log-type').textContent = isError ? 'ERROR' : 'SUCCESS';
    logCard.dataset.status = isError ? 'error' : 'success';
    let durationClass = duration > 1000 ? 'slow' : duration > 3000 ? 'very-slow' : '';
    timeDiv.innerHTML = `<span class="duration-badge ${durationClass}">${duration}ms</span><span>${timeStr}</span>`;
    const timelineItem = Array.from(elements.activityTimeline.children).find(item => item.querySelector('.timeline-tool')?.textContent === callData.name);
    if (timelineItem) {
        timelineItem.className = `timeline-item ${isError ? 'error' : 'success'}`;
        const durationEl = document.createElement('span');
        durationEl.className = 'timeline-duration';
        durationEl.textContent = `${duration}ms`;
        timelineItem.querySelector('.timeline-content').appendChild(durationEl);
    }
    const responseContainer = logCard.querySelector(`#response-${responseData.id}`);
    let resultString = '';
    try {
        if (responseData.result?.content?.[0]?.text) {
            const parsed = JSON.parse(responseData.result.content[0].text);
            resultString = syntaxHighlight(JSON.stringify(parsed, null, 2));
        } else resultString = syntaxHighlight(JSON.stringify(responseData.result, null, 2));
    } catch (e) { resultString = escapeHtml(JSON.stringify(responseData.result, null, 2)); }
    logCard.dataset.search = resultString.toLowerCase();
    logCard.dataset.duration = duration;
    responseContainer.style.display = 'block';
    responseContainer.innerHTML = `<h4>Result <button class="copy-btn" onclick="copyToClipboard('${responseData.id}-res')">Copy</button></h4><pre><code id="${responseData.id}-res">${resultString}</code></pre>`;
}

// ============================================
// CHARTS
// ============================================
function initCharts() {
    charts.requests = new Chart(document.getElementById('requests-chart').getContext('2d'), {
        type: 'line',
        data: { labels: [], datasets: [{ label: 'Requests', data: [], borderColor: '#38bdf8', backgroundColor: 'rgba(56, 189, 248, 0.1)', fill: true, tension: 0.4, pointRadius: 3 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8', stepSize: 1 } } } }
    });
    charts.distribution = new Chart(document.getElementById('tool-distribution-chart').getContext('2d'), {
        type: 'doughnut',
        data: { labels: [], datasets: [{ data: [], backgroundColor: ['#38bdf8', '#c084fc', '#22d3ee', '#34d399', '#f87171', '#fbbf24', '#f472b6', '#fb923c'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right', labels: { color: '#94a3b8', font: { size: 10 } } } } }
    });
    charts.responseTime = new Chart(document.getElementById('response-time-chart').getContext('2d'), {
        type: 'bar',
        data: { labels: ['0-100ms', '100-500ms', '500-1000ms', '1000-2000ms', '>2000ms'], datasets: [{ data: [0, 0, 0, 0, 0], backgroundColor: ['rgba(52,211,153,0.7)', 'rgba(34,211,238,0.7)', 'rgba(251,191,36,0.7)', 'rgba(251,191,36,0.5)', 'rgba(248,113,113,0.7)'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } } } }
    });
    charts.successError = new Chart(document.getElementById('success-error-chart').getContext('2d'), {
        type: 'pie',
        data: { labels: ['Success', 'Errors'], datasets: [{ data: [1, 0], backgroundColor: ['rgba(52,211,153,0.7)', 'rgba(248,113,113,0.7)'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } } }
    });
    charts.category = new Chart(document.getElementById('category-chart').getContext('2d'), {
        type: 'bar',
        data: { labels: ['Knowledge', 'Checklist', 'Snippet', 'Validation', 'Agent Skill', 'Action', 'WP Data'], datasets: [{ data: [0, 0, 0, 0, 0, 0, 0], backgroundColor: ['rgba(56,189,248,0.7)', 'rgba(192,132,252,0.7)', 'rgba(34,211,238,0.7)', 'rgba(251,191,36,0.7)', 'rgba(244,114,182,0.7)', 'rgba(251,146,60,0.7)', 'rgba(52,211,153,0.7)'], borderWidth: 0 }] },
        options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 9 } } }, y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } } } }
    });
}

function updateCharts() {
    if (state.responseTimes.length > 0) {
        const sorted = [...state.responseTimes].sort((a, b) => a - b);
        elements.rtMin.textContent = `${Math.min(...sorted)}ms`;
        elements.rtAvg.textContent = `${Math.round(state.totalResponseTime / state.totalRequests)}ms`;
        elements.rtMax.textContent = `${Math.max(...sorted)}ms`;
        elements.rtP95.textContent = `${sorted[Math.floor(sorted.length * 0.95)] || 0}ms`;
        const buckets = [0, 0, 0, 0, 0];
        state.responseTimes.forEach(rt => { if (rt <= 100) buckets[0]++; else if (rt <= 500) buckets[1]++; else if (rt <= 1000) buckets[2]++; else if (rt <= 2000) buckets[3]++; else buckets[4]++; });
        charts.responseTime.data.datasets[0].data = buckets;
        charts.responseTime.update();
    }
    elements.successCount.textContent = state.successfulRequests.toLocaleString();
    elements.errorCount.textContent = state.failedRequests.toLocaleString();
    const total = state.successfulRequests + state.failedRequests;
    elements.successRateDetail.textContent = `${total > 0 ? Math.round((state.successfulRequests / total) * 100) : 100}%`;
    charts.successError.data.datasets[0].data = [state.successfulRequests, state.failedRequests];
    charts.successError.update();
    const toolEntries = Object.entries(state.toolCounts).slice(0, 8);
    charts.distribution.data.labels = toolEntries.map(([name]) => name);
    charts.distribution.data.datasets[0].data = toolEntries.map(([, count]) => count);
    charts.distribution.update();
    charts.category.data.datasets[0].data = [state.categoryCounts.knowledge, state.categoryCounts.checklist, state.categoryCounts.snippet, state.categoryCounts.validation, state.categoryCounts.agentSkill, state.categoryCounts.action, state.categoryCounts.wpData];
    charts.category.update();
}

function updateRequestsChart() {
    const now = Date.now();
    const labels = [], data = [];
    for (let i = 59; i >= 0; i--) {
        const time = now - (i * 1000);
        const count = state.logs.filter(log => log.timestamp >= time - 1000 && log.timestamp < time).length;
        labels.push(new Date(time).toLocaleTimeString());
        data.push(count);
    }
    charts.requests.data.labels = labels;
    charts.requests.data.datasets[0].data = data;
    charts.requests.update('none');
}

// ============================================
// EVENT LISTENERS
// ============================================
elements.clearLogsBtn.addEventListener('click', () => {
    elements.activityFeed.innerHTML = '';
    elements.activityFeed.appendChild(elements.emptyState);
    elements.emptyState.style.display = 'flex';
    state.activeCalls.clear();
    state.logs = [];
    state.responseTimes = [];
    state.totalResponseTime = 0;
    state.successfulRequests = 0;
    state.failedRequests = 0;
    state.dataProcessed = 0;
    updateStats();
    updateCharts();
});

elements.exportLogsBtn.addEventListener('click', () => {
    const exportData = { exportDate: new Date().toISOString(), totalRequests: state.totalRequests, toolCounts: state.toolCounts, categoryCounts: state.categoryCounts, logs: state.logs };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wp-mcp-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
});

elements.searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    elements.activityFeed.querySelectorAll('.log-card').forEach(card => {
        const searchText = [card.dataset.tool, card.dataset.search, card.dataset.category].filter(Boolean).join(' ').toLowerCase();
        card.style.display = searchText.includes(searchTerm) ? 'block' : 'none';
    });
});

elements.filterType.addEventListener('change', (e) => {
    const filter = e.target.value;
    elements.activityFeed.querySelectorAll('.log-card').forEach(card => {
        if (filter === 'all') card.style.display = 'block';
        else if (filter === 'call' && !card.dataset.status) card.style.display = 'block';
        else if (filter === 'success' && card.dataset.status === 'success') card.style.display = 'block';
        else if (filter === 'error' && card.dataset.status === 'error') card.style.display = 'block';
        else card.style.display = 'none';
    });
});

elements.viewToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
        elements.viewToggles.forEach(t => t.classList.remove('active'));
        toggle.classList.add('active');
        const view = toggle.dataset.view;
        if (view === 'analytics') {
            elements.analyticsView.style.display = 'flex';
            elements.activityFeedView.style.display = 'none';
            elements.promptsView.style.display = 'none';
            elements.customPromptsView.style.display = 'none';
            updateRequestsChart();
        } else if (view === 'prompts') {
            elements.analyticsView.style.display = 'none';
            elements.activityFeedView.style.display = 'none';
            elements.promptsView.style.display = 'flex';
            elements.customPromptsView.style.display = 'none';
            renderPromptsLibrary();
        } else if (view === 'custom') {
            elements.analyticsView.style.display = 'none';
            elements.activityFeedView.style.display = 'none';
            elements.promptsView.style.display = 'none';
            elements.customPromptsView.style.display = 'flex';
            renderCustomPrompts();
        } else {
            elements.analyticsView.style.display = 'none';
            elements.promptsView.style.display = 'none';
            elements.customPromptsView.style.display = 'none';
            elements.activityFeedView.style.display = 'flex';
        }
    });
});

// ============================================
// PROMPTS LIBRARY FUNCTIONS
// ============================================
function renderPromptsLibrary(filter = 'all', searchTerm = '') {
    elements.promptsGrid.innerHTML = '';
    const filtered = promptsLibrary.filter(prompt => {
        const matchesCategory = filter === 'all' || prompt.category === filter;
        const matchesSearch = searchTerm === '' || prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) || prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || prompt.tool.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    filtered.forEach(prompt => {
        const card = document.createElement('div');
        card.className = `prompt-card category-${prompt.category}`;
        card.innerHTML = `
            <div class="prompt-header"><span class="prompt-icon">${prompt.icon}</span><span class="prompt-title">${prompt.title}</span><span class="prompt-category ${prompt.category}">${prompt.category}</span></div>
            <p class="prompt-description">${prompt.description}</p>
            <span class="prompt-tool">🔧 ${prompt.tool}</span>
            <div class="prompt-example">${escapeHtml(prompt.prompt)}</div>
            <div class="prompt-footer"><span class="prompt-usage">${prompt.usage}</span><button class="copy-prompt-btn" data-prompt="${prompt.id}">📋 Copy Prompt</button></div>`;
        card.querySelector('.copy-prompt-btn').addEventListener('click', (e) => { e.stopPropagation(); copyPromptToClipboard(prompt.prompt, e.target); });
        elements.promptsGrid.appendChild(card);
    });
}

function copyPromptToClipboard(promptText, btn) {
    navigator.clipboard.writeText(promptText).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = originalText; btn.classList.remove('copied'); }, 2000);
    });
}

if (elements.searchPrompts) elements.searchPrompts.addEventListener('input', (e) => renderPromptsLibrary(elements.filterCategory?.value || 'all', e.target.value.toLowerCase()));
if (elements.filterCategory) elements.filterCategory.addEventListener('change', (e) => renderPromptsLibrary(e.target.value, elements.searchPrompts?.value || ''));

// ============================================
// CUSTOM DEVELOPER PROMPTS FUNCTIONS
// ============================================
function renderCustomPrompts(filter = 'all', searchTerm = '') {
    elements.customPromptsContainer.innerHTML = '';
    const filtered = advancedDeveloperPrompts.filter(prompt => {
        const matchesCategory = filter === 'all' || prompt.category === filter;
        const matchesSearch = searchTerm === '' || prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) || prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) || prompt.prompt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    filtered.forEach(prompt => {
        const card = document.createElement('div');
        card.className = `custom-prompt-card category-${prompt.category}`;
        const difficultyDots = Array(3).fill(0).map((_, i) => `<span class="difficulty-dot ${i < prompt.difficulty ? 'active' : ''}"></span>`).join('');
        const toolsHtml = prompt.tools.map(tool => `<span class="tool-tag">🔧 ${tool}</span>`).join('');
        card.innerHTML = `
            <div class="custom-prompt-header">
                <div class="custom-prompt-title"><span class="custom-prompt-icon">${prompt.icon}</span><h4>${prompt.title}</h4></div>
                <div class="custom-prompt-meta"><span class="custom-prompt-category ${prompt.category}">${prompt.category}</span><div class="custom-prompt-difficulty"><div class="difficulty-dots">${difficultyDots}</div></div><span class="expand-indicator">▼</span></div>
            </div>
            <div class="custom-prompt-body">
                <p class="custom-prompt-description">${prompt.description}</p>
                <div class="custom-prompt-section"><h5><span class="section-icon">🛠️</span> Tools Used</h5><div class="custom-prompt-tools-used">${toolsHtml}</div></div>
                <div class="custom-prompt-section"><h5><span class="section-icon">📋</span> Instructions</h5><div class="custom-prompt-instructions">${formatPromptText(prompt.prompt)}</div></div>
                <div class="custom-prompt-section"><h5><span class="section-icon">📤</span> Expected Output</h5><p class="custom-prompt-output">${prompt.output}</p></div>
                <div class="custom-prompt-footer"><span class="custom-prompt-output">💡 Copy and paste this prompt into your AI assistant</span><button class="copy-full-prompt-btn" data-prompt="${prompt.id}">📋 Copy Full Prompt</button></div>
            </div>`;
        card.querySelector('.custom-prompt-header').addEventListener('click', () => card.classList.toggle('expanded'));
        card.querySelector('.copy-full-prompt-btn').addEventListener('click', (e) => { e.stopPropagation(); copyCustomPrompt(prompt, e.target); });
        elements.customPromptsContainer.appendChild(card);
    });
}

function formatPromptText(text) { return escapeHtml(text).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n\n/g, '<br><br>').replace(/\n/g, '<br>'); }
function copyCustomPrompt(prompt, btn) {
    navigator.clipboard.writeText(prompt.prompt).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = originalText; btn.classList.remove('copied'); }, 2000);
    });
}

if (elements.searchCustomPrompts) elements.searchCustomPrompts.addEventListener('input', (e) => renderCustomPrompts(elements.filterCustomCategory?.value || 'all', e.target.value.toLowerCase()));
if (elements.filterCustomCategory) elements.filterCustomCategory.addEventListener('change', (e) => renderCustomPrompts(e.target.value, elements.searchCustomPrompts?.value || ''));

// ============================================
// UTILITIES
// ============================================
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    navigator.clipboard.writeText(element.innerText || element.textContent).then(() => {
        const btn = element.parentNode.previousElementSibling?.querySelector('button');
        if (btn) { const originalText = btn.textContent; btn.textContent = '✓ Copied!'; setTimeout(() => { btn.textContent = originalText; }, 2000); }
    });
}

function syntaxHighlight(json) {
    if (typeof json !== 'string') json = JSON.stringify(json, undefined, 2);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'json-number';
        if (/^"/.test(match)) { if (/:$/.test(match)) { cls = 'json-key'; match = match.replace(/"/g, ''); } else cls = 'json-string'; }
        else if (/true|false/.test(match)) cls = 'json-boolean';
        else if (/null/.test(match)) cls = 'json-null';
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function escapeHtml(unsafe) { return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;"); }
function formatBytes(bytes) { if (bytes === 0) return '0 B'; const k = 1024; const sizes = ['B', 'KB', 'MB', 'GB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]; }
function filterByTool(toolName) { elements.searchInput.value = toolName; elements.searchInput.dispatchEvent(new Event('input')); }

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    renderPromptsLibrary();
    renderCustomPrompts();
    setInterval(updateRequestsChart, 1000);
    setInterval(updateRequestsPerMinute, 1000);
});
