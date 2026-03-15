// Connect to Socket.io server
const socket = io();

// DOM Elements
const connectionStatus = document.getElementById('connection-status');
const activityFeed = document.getElementById('activity-feed');
const emptyState = document.getElementById('empty-state');
const totalRequestsEl = document.getElementById('total-requests');
const recentToolsList = document.getElementById('recent-tools-list');
const clearLogsBtn = document.getElementById('clear-logs-btn');
const searchInput = document.getElementById('search-logs');

// State
let totalRequests = 0;
const toolCounts = {};
const activeCalls = new Map(); // Store active calls to append responses to them

// Connection Events
socket.on('connect', () => {
    connectionStatus.className = 'status-indicator connected';
    connectionStatus.querySelector('span').textContent = 'Connected';
});

socket.on('disconnect', () => {
    connectionStatus.className = 'status-indicator disconnected';
    connectionStatus.querySelector('span').textContent = 'Disconnected';
});

// Tool Call Events
socket.on('tool_call', (data) => {
    if (emptyState) emptyState.style.display = 'none';
    
    // Update Stats
    totalRequests++;
    totalRequestsEl.textContent = totalRequests;
    
    // Update Recent Tools List
    toolCounts[data.name] = (toolCounts[data.name] || 0) + 1;
    updateRecentTools();
    
    // Add to Feed
    addCallLog(data);
});

socket.on('tool_response', (data) => {
    // Append response to existing log if it exists
    const callLog = activeCalls.get(data.id);
    if (callLog) {
        appendResponseToLog(callLog, data);
        activeCalls.delete(data.id);
    } else {
        // Fallback if we somehow missed the call event
        addResponseLog(data);
    }
});

// Helper Functions
function addCallLog(data) {
    const logCard = document.createElement('div');
    logCard.className = 'log-card';
    logCard.dataset.id = data.id;
    logCard.dataset.tool = data.name.toLowerCase();
    logCard.dataset.search = JSON.stringify(data.arguments).toLowerCase();
    
    const time = new Date(data.timestamp).toLocaleTimeString();
    
    logCard.innerHTML = `
        <div class="log-header">
            <div class="log-meta">
                <span class="log-type type-call">CALL</span>
                <span class="log-tool-name">${data.name}</span>
            </div>
            <div class="log-time" id="time-${data.id}">
                <div class="pending-indicator">
                    <div class="pending-spinner"></div>
                    <span>Executing...</span>
                </div>
            </div>
        </div>
        <div class="log-body">
            <div class="log-section">
                <h4>Arguments <button class="copy-btn" onclick="copyToClipboard('${data.id}-args')">Copy</button></h4>
                <pre><code id="${data.id}-args">${syntaxHighlight(JSON.stringify(data.arguments, null, 2))}</code></pre>
            </div>
            <div id="response-${data.id}" class="log-section response-section" style="display: none;">
                <!-- Response will be injected here -->
            </div>
        </div>
    `;
    
    // Insert at the top of the feed
    if (activityFeed.firstChild === emptyState) {
        activityFeed.appendChild(logCard);
    } else {
        activityFeed.insertBefore(logCard, activityFeed.firstChild);
    }
    
    // Store reference for the response
    activeCalls.set(data.id, logCard);
    
    // Keep feed trimmed (e.g., max 100 items)
    if (activityFeed.children.length > 50) {
        activityFeed.removeChild(activityFeed.lastChild);
    }
}

function appendResponseToLog(logCard, data) {
    const timeDiv = logCard.querySelector(`#time-${data.id}`);
    const timeStr = new Date(data.timestamp).toLocaleTimeString();
    
    // Calculate if error
    const isError = data.result && data.result.isError;
    const duration = data.duration ? `${data.duration}ms` : '';
    
    // Update Header
    const typeClass = isError ? 'type-error' : 'type-response';
    const typeText = isError ? 'ERROR' : 'SUCCESS';
    
    logCard.querySelector('.log-type').className = `log-type ${typeClass}`;
    logCard.querySelector('.log-type').textContent = typeText;
    
    timeDiv.innerHTML = `
        ${duration ? `<span class="duration-badge">${duration}</span>` : ''}
        ${timeStr}
    `;
    
    // Append Response Body
    const responseContainer = logCard.querySelector(`#response-${data.id}`);
    
    let resultString = '';
    if (data.result && data.result.content && data.result.content.length > 0) {
        // Try to parse JSON from the text if it's JSON
        try {
            const parsed = JSON.parse(data.result.content[0].text);
            resultString = syntaxHighlight(JSON.stringify(parsed, null, 2));
        } catch (e) {
            resultString = escapeHtml(data.result.content[0].text);
        }
    } else {
        resultString = syntaxHighlight(JSON.stringify(data.result, null, 2));
    }
    
    // Add to search context
    logCard.dataset.search += ' ' + logCard.dataset.tool + ' ' + (typeof resultString === 'string' ? resultString.toLowerCase() : '');
    
    responseContainer.style.display = 'block';
    responseContainer.innerHTML = `
        <h4>Result <button class="copy-btn" onclick="copyToClipboard('${data.id}-res')">Copy</button></h4>
        <pre><code id="${data.id}-res">${resultString}</code></pre>
    `;
}

// Fallback if we only receive a response without a call log
function addResponseLog(data) {
    const logCard = document.createElement('div');
    logCard.className = 'log-card';
    const time = new Date(data.timestamp).toLocaleTimeString();
    const isError = data.result && data.result.isError;
    const typeClass = isError ? 'type-error' : 'type-response';
    const typeText = isError ? 'ERROR' : 'RESPONSE';
    
    let resultString = '';
    if (data.result && data.result.content && data.result.content.length > 0) {
        try {
            const parsed = JSON.parse(data.result.content[0].text);
            resultString = syntaxHighlight(JSON.stringify(parsed, null, 2));
        } catch (e) {
            resultString = escapeHtml(data.result.content[0].text);
        }
    }
    
    logCard.innerHTML = `
        <div class="log-header">
            <div class="log-meta">
                <span class="log-type ${typeClass}">${typeText}</span>
                <span class="log-tool-name">${data.name || 'Unknown Tool'}</span>
            </div>
            <div class="log-time">${time}</div>
        </div>
        <div class="log-body">
            <div class="log-section">
                <h4>Result</h4>
                <pre><code>${resultString}</code></pre>
            </div>
        </div>
    `;
    
    activityFeed.insertBefore(logCard, activityFeed.firstChild);
}

function updateRecentTools() {
    recentToolsList.innerHTML = '';
    
    // Sort tools by count
    const sortedTools = Object.entries(toolCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8); // Top 8
        
    sortedTools.forEach(([name, count]) => {
        const li = document.createElement('li');
        li.className = 'tool-list-item';
        li.innerHTML = `
            <span>${name}</span>
            <span class="tool-count-badge">${count}</span>
        `;
        recentToolsList.appendChild(li);
    });
}

// UI Interactions
clearLogsBtn.addEventListener('click', () => {
    activityFeed.innerHTML = '';
    activityFeed.appendChild(emptyState);
    emptyState.style.display = 'flex';
    activeCalls.clear();
});

// Search functionality
searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const cards = activityFeed.querySelectorAll('.log-card');
    
    cards.forEach(card => {
        const text = card.dataset.search || card.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Accordion-like behavior for logs (optional, if we want them collapsible)
activityFeed.addEventListener('click', (e) => {
    const isHeader = e.target.closest('.log-header');
    if (isHeader) {
        const card = isHeader.closest('.log-card');
        const body = card.querySelector('.log-body');
        // Toggle visibility if needed, currently we leave it always open
        // body.style.display = body.style.display === 'none' ? 'grid' : 'none';
    }
});

// Utils
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    let textToCopy = element.innerText || element.textContent;
    // Remove syntax highlight HTML if present, though innerText usually handles it
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Find the button and show visual feedback
        const btn = element.parentNode.previousElementSibling.querySelector('button');
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'json-number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'json-key';
                // Remove quotes from key for cleaner look
                match = match.replace(/"/g, ''); 
            } else {
                cls = 'json-string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'json-boolean';
        } else if (/null/.test(match)) {
            cls = 'json-null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
