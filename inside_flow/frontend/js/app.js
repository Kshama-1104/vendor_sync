// Inside Flow - Frontend Application
const API_BASE = 'http://localhost:3000/api/v1';
const HEALTH_URL = 'http://localhost:3000/health';

// State
let socket = null;
let currentPage = 'dashboard';
let healthCheckInterval = null;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSocket();
    startHealthCheck();
    loadDashboardData();
});

// Navigation
function initNavigation() {
    document.querySelectorAll('[data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.currentTarget.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(page) {
    // Update nav links
    document.querySelectorAll('[data-page]').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    // Show/hide pages
    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}Page`).classList.add('active');

    currentPage = page;

    // Load page-specific data
    switch(page) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'flows':
            loadFlows();
            break;
        case 'executions':
            loadExecutions();
            break;
        case 'rules':
            loadRules();
            break;
        case 'monitoring':
            loadMonitoringData();
            break;
    }
}

// Socket.io Connection
function initSocket() {
    try {
        socket = io('http://localhost:3000');

        socket.on('connect', () => {
            updateConnectionStatus(true);
            addLog('Connected to server', 'success');
        });

        socket.on('disconnect', () => {
            updateConnectionStatus(false);
            addLog('Disconnected from server', 'error');
        });

        socket.on('flow:updated', (data) => {
            addLog(`Flow updated: ${data.name}`, 'info');
            if (currentPage === 'flows') loadFlows();
        });

        socket.on('execution:started', (data) => {
            addLog(`Execution started: ${data.id}`, 'success');
            if (currentPage === 'executions') loadExecutions();
            if (currentPage === 'dashboard') loadDashboardData();
        });

        socket.on('execution:completed', (data) => {
            addLog(`Execution completed: ${data.id}`, 'success');
            if (currentPage === 'executions') loadExecutions();
            if (currentPage === 'dashboard') loadDashboardData();
        });

        socket.on('execution:failed', (data) => {
            addLog(`Execution failed: ${data.id} - ${data.error}`, 'error');
            if (currentPage === 'executions') loadExecutions();
            if (currentPage === 'dashboard') loadDashboardData();
        });

        socket.on('state:transition', (data) => {
            addLog(`State transition: ${data.from} -> ${data.to}`, 'info');
        });

    } catch (error) {
        console.error('Socket connection failed:', error);
        updateConnectionStatus(false);
    }
}

function updateConnectionStatus(connected) {
    const status = document.getElementById('connectionStatus');
    const wsStatus = document.getElementById('wsStatus');
    const wsProgress = document.getElementById('wsProgress');

    if (connected) {
        status.className = 'badge bg-success';
        status.innerHTML = '<i class="bi bi-circle-fill"></i> Connected';
        if (wsStatus) {
            wsStatus.className = 'badge bg-success';
            wsStatus.textContent = 'Connected';
        }
        if (wsProgress) {
            wsProgress.className = 'progress-bar bg-success';
            wsProgress.style.width = '100%';
        }
    } else {
        status.className = 'badge bg-danger';
        status.innerHTML = '<i class="bi bi-circle-fill"></i> Disconnected';
        if (wsStatus) {
            wsStatus.className = 'badge bg-danger';
            wsStatus.textContent = 'Disconnected';
        }
        if (wsProgress) {
            wsProgress.className = 'progress-bar bg-danger';
            wsProgress.style.width = '0%';
        }
    }
}

// Health Check
function startHealthCheck() {
    checkHealth();
    healthCheckInterval = setInterval(checkHealth, 10000);
}

async function checkHealth() {
    try {
        const response = await fetch(HEALTH_URL);
        const data = await response.json();
        
        document.getElementById('apiStatus').className = 'badge bg-success';
        document.getElementById('apiStatus').textContent = 'Healthy';
        
        // Update uptime
        const uptime = formatUptime(data.uptime);
        document.getElementById('uptime').textContent = uptime;
        
        // Simulate memory usage (would come from real metrics)
        const memUsage = Math.floor(Math.random() * 30) + 20;
        document.getElementById('memoryUsage').textContent = `${memUsage}%`;
        document.getElementById('memoryProgress').style.width = `${memUsage}%`;
        
    } catch (error) {
        document.getElementById('apiStatus').className = 'badge bg-danger';
        document.getElementById('apiStatus').textContent = 'Unhealthy';
    }
}

function formatUptime(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m ${secs}s`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
}

// Dashboard Data
async function loadDashboardData() {
    try {
        // Load stats (simulated for now since API might not have these endpoints)
        document.getElementById('totalFlows').textContent = '3';
        document.getElementById('activeExecutions').textContent = '1';
        document.getElementById('completedToday').textContent = '12';
        document.getElementById('failedToday').textContent = '0';

        // Load recent executions
        const executions = [
            { id: 'exec-001', flow: 'Order Processing', state: 'completed', started: '2 min ago', duration: '45s', status: 'completed' },
            { id: 'exec-002', flow: 'User Onboarding', state: 'running', started: '5 min ago', duration: '2m 30s', status: 'running' },
            { id: 'exec-003', flow: 'Payment Flow', state: 'completed', started: '15 min ago', duration: '1m 12s', status: 'completed' }
        ];

        renderRecentExecutions(executions);
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
    }
}

function renderRecentExecutions(executions) {
    const tbody = document.getElementById('recentExecutions');
    
    if (executions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No recent executions</td></tr>';
        return;
    }

    tbody.innerHTML = executions.map(exec => `
        <tr>
            <td><code>${exec.id}</code></td>
            <td>${exec.flow}</td>
            <td>${exec.state}</td>
            <td>${exec.started}</td>
            <td>${exec.duration}</td>
            <td><span class="badge status-${exec.status}">${exec.status}</span></td>
        </tr>
    `).join('');
}

// Flows Management
async function loadFlows() {
    try {
        // Simulated flows data
        const flows = [
            { id: 1, name: 'Order Processing', description: 'Handle customer orders', states: 5, status: 'active', created: '2026-01-15' },
            { id: 2, name: 'User Onboarding', description: 'New user registration flow', states: 4, status: 'active', created: '2026-01-20' },
            { id: 3, name: 'Payment Flow', description: 'Process payments', states: 6, status: 'inactive', created: '2026-01-25' }
        ];

        renderFlows(flows);
    } catch (error) {
        console.error('Failed to load flows:', error);
        showToast('Error', 'Failed to load flows', 'error');
    }
}

function renderFlows(flows) {
    const tbody = document.getElementById('flowsList');
    
    if (flows.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No flows created yet</td></tr>';
        return;
    }

    tbody.innerHTML = flows.map(flow => `
        <tr>
            <td><strong>${flow.name}</strong></td>
            <td>${flow.description}</td>
            <td><span class="badge bg-secondary">${flow.states} states</span></td>
            <td><span class="badge status-${flow.status}">${flow.status}</span></td>
            <td>${flow.created}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-action" onclick="executeFlow(${flow.id})" title="Execute">
                    <i class="bi bi-play-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-secondary btn-action" onclick="editFlow(${flow.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-action" onclick="deleteFlow(${flow.id})" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function createFlow() {
    const name = document.getElementById('flowName').value;
    const description = document.getElementById('flowDescription').value;
    const initialState = document.getElementById('initialState').value;
    const statesJson = document.getElementById('flowStates').value;

    if (!name || !initialState) {
        showToast('Error', 'Please fill required fields', 'error');
        return;
    }

    try {
        let states = [];
        if (statesJson) {
            states = JSON.parse(statesJson);
        }

        // API call would go here
        showToast('Success', `Flow "${name}" created successfully!`, 'success');
        bootstrap.Modal.getInstance(document.getElementById('createFlowModal')).hide();
        document.getElementById('createFlowForm').reset();
        loadFlows();
        addLog(`Created flow: ${name}`, 'success');
    } catch (error) {
        showToast('Error', 'Invalid states JSON format', 'error');
    }
}

function executeFlow(flowId) {
    showToast('Info', `Starting execution for flow ${flowId}...`, 'info');
    addLog(`Execution started for flow ${flowId}`, 'success');
}

function editFlow(flowId) {
    showToast('Info', `Opening editor for flow ${flowId}...`, 'info');
}

function deleteFlow(flowId) {
    if (confirm('Are you sure you want to delete this flow?')) {
        showToast('Success', `Flow ${flowId} deleted`, 'success');
        addLog(`Deleted flow ${flowId}`, 'warning');
        loadFlows();
    }
}

// Executions
async function loadExecutions() {
    const filter = document.getElementById('executionFilter').value;
    
    // Simulated executions
    let executions = [
        { id: 'exec-001', flow: 'Order Processing', state: 'shipping', progress: 80, started: '2026-01-29 10:30', duration: '5m 23s', status: 'running' },
        { id: 'exec-002', flow: 'User Onboarding', state: 'completed', progress: 100, started: '2026-01-29 09:15', duration: '2m 45s', status: 'completed' },
        { id: 'exec-003', flow: 'Payment Flow', state: 'failed', progress: 50, started: '2026-01-29 08:00', duration: '1m 12s', status: 'failed' }
    ];

    if (filter !== 'all') {
        executions = executions.filter(e => e.status === filter);
    }

    renderExecutions(executions);
}

function renderExecutions(executions) {
    const tbody = document.getElementById('executionsList');
    
    if (executions.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No executions found</td></tr>';
        return;
    }

    tbody.innerHTML = executions.map(exec => `
        <tr>
            <td><code>${exec.id}</code></td>
            <td>${exec.flow}</td>
            <td>${exec.state}</td>
            <td>
                <div class="progress" style="width: 100px; height: 8px;">
                    <div class="progress-bar ${exec.status === 'failed' ? 'bg-danger' : ''}" style="width: ${exec.progress}%"></div>
                </div>
            </td>
            <td>${exec.started}</td>
            <td>${exec.duration}</td>
            <td>
                ${exec.status === 'running' ? `
                    <button class="btn btn-sm btn-outline-warning btn-action" onclick="pauseExecution('${exec.id}')" title="Pause">
                        <i class="bi bi-pause-fill"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-action" onclick="stopExecution('${exec.id}')" title="Stop">
                        <i class="bi bi-stop-fill"></i>
                    </button>
                ` : `
                    <button class="btn btn-sm btn-outline-primary btn-action" onclick="retryExecution('${exec.id}')" title="Retry">
                        <i class="bi bi-arrow-clockwise"></i>
                    </button>
                `}
                <button class="btn btn-sm btn-outline-info btn-action" onclick="viewExecution('${exec.id}')" title="View Details">
                    <i class="bi bi-eye"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function pauseExecution(id) {
    showToast('Info', `Pausing execution ${id}...`, 'info');
    addLog(`Paused execution ${id}`, 'warning');
}

function stopExecution(id) {
    showToast('Warning', `Stopping execution ${id}...`, 'warning');
    addLog(`Stopped execution ${id}`, 'error');
}

function retryExecution(id) {
    showToast('Info', `Retrying execution ${id}...`, 'info');
    addLog(`Retrying execution ${id}`, 'info');
}

function viewExecution(id) {
    showToast('Info', `Opening details for ${id}...`, 'info');
}

// Rules
async function loadRules() {
    // Simulated rules
    const rules = [
        { id: 1, name: 'High Value Order', condition: 'order.total > 1000', action: 'Notify Manager', priority: 1, status: 'active' },
        { id: 2, name: 'Failed Payment Retry', condition: 'payment.status === "failed"', action: 'Retry Payment', priority: 2, status: 'active' },
        { id: 3, name: 'VIP Customer', condition: 'customer.tier === "vip"', action: 'Priority Processing', priority: 1, status: 'inactive' }
    ];

    renderRules(rules);
}

function renderRules(rules) {
    const tbody = document.getElementById('rulesList');
    
    if (rules.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No rules defined yet</td></tr>';
        return;
    }

    tbody.innerHTML = rules.map(rule => `
        <tr>
            <td><strong>${rule.name}</strong></td>
            <td><code>${rule.condition}</code></td>
            <td>${rule.action}</td>
            <td><span class="badge bg-info">${rule.priority}</span></td>
            <td><span class="badge status-${rule.status}">${rule.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-secondary btn-action" onclick="editRule(${rule.id})" title="Edit">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger btn-action" onclick="deleteRule(${rule.id})" title="Delete">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function createRule() {
    const name = document.getElementById('ruleName').value;
    const condition = document.getElementById('ruleCondition').value;
    const action = document.getElementById('ruleAction').value;
    const priority = document.getElementById('rulePriority').value;

    if (!name) {
        showToast('Error', 'Please enter rule name', 'error');
        return;
    }

    showToast('Success', `Rule "${name}" created!`, 'success');
    bootstrap.Modal.getInstance(document.getElementById('createRuleModal')).hide();
    document.getElementById('createRuleForm').reset();
    loadRules();
    addLog(`Created rule: ${name}`, 'success');
}

function editRule(id) {
    showToast('Info', `Editing rule ${id}...`, 'info');
}

function deleteRule(id) {
    if (confirm('Are you sure you want to delete this rule?')) {
        showToast('Success', `Rule ${id} deleted`, 'success');
        addLog(`Deleted rule ${id}`, 'warning');
        loadRules();
    }
}

// Monitoring
function loadMonitoringData() {
    initCharts();
}

function initCharts() {
    // Execution Statistics Chart
    const execCtx = document.getElementById('executionChart');
    if (execCtx) {
        new Chart(execCtx, {
            type: 'doughnut',
            data: {
                labels: ['Completed', 'Running', 'Failed', 'Paused'],
                datasets: [{
                    data: [65, 15, 12, 8],
                    backgroundColor: ['#06d6a0', '#4cc9f0', '#ef476f', '#ffd166']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Performance Chart
    const perfCtx = document.getElementById('performanceChart');
    if (perfCtx) {
        new Chart(perfCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Avg Execution Time (ms)',
                    data: [1200, 1900, 1500, 2100, 1800, 800, 600],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

// Activity Log
function addLog(message, type = 'info') {
    const log = document.getElementById('activityLog');
    if (!log) return;

    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span class="text-muted">[${timestamp}]</span> ${message}`;
    
    // Remove "waiting" message if present
    const waiting = log.querySelector('.text-muted');
    if (waiting && waiting.textContent.includes('Waiting')) {
        waiting.remove();
    }
    
    log.insertBefore(entry, log.firstChild);
    
    // Keep only last 50 entries
    while (log.children.length > 50) {
        log.removeChild(log.lastChild);
    }
}

// Toast Notifications
function showToast(title, message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    
    toastTitle.textContent = title;
    toastBody.textContent = message;
    
    // Update icon based on type
    const icon = toast.querySelector('.bi');
    icon.className = 'bi me-2';
    switch(type) {
        case 'success':
            icon.classList.add('bi-check-circle', 'text-success');
            break;
        case 'error':
            icon.classList.add('bi-x-circle', 'text-danger');
            break;
        case 'warning':
            icon.classList.add('bi-exclamation-triangle', 'text-warning');
            break;
        default:
            icon.classList.add('bi-info-circle', 'text-info');
    }
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}

// Filter change handler
document.getElementById('executionFilter')?.addEventListener('change', loadExecutions);
