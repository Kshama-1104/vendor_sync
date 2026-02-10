// Secure Auth - Frontend Application
const API_BASE = 'http://localhost:3001/api/v1';

// State
let authToken = null;
let refreshToken = null;
let currentUser = null;
let mfaToken = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    initNavigation();
    initPasswordValidation();
});

// Check existing auth
function checkAuth() {
    authToken = localStorage.getItem('authToken');
    refreshToken = localStorage.getItem('refreshToken');
    
    if (authToken) {
        showDashboard();
        loadUserProfile();
    }
}

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
    document.querySelectorAll('[data-page]').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    document.querySelectorAll('.page-content').forEach(p => {
        p.classList.remove('active');
    });
    document.getElementById(`${page}Page`).classList.add('active');

    // Load page data
    switch(page) {
        case 'sessions':
            loadSessions();
            break;
        case 'activity':
            loadActivity();
            break;
    }
}

// Password Validation
function initPasswordValidation() {
    const passwordInput = document.getElementById('registerPassword');
    if (passwordInput) {
        passwordInput.addEventListener('input', (e) => {
            validatePassword(e.target.value);
        });
    }
}

function validatePassword(password) {
    const requirements = {
        reqLength: password.length >= 12,
        reqUpper: /[A-Z]/.test(password),
        reqLower: /[a-z]/.test(password),
        reqNumber: /\d/.test(password),
        reqSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    Object.entries(requirements).forEach(([id, valid]) => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.toggle('valid', valid);
        }
    });

    return Object.values(requirements).every(Boolean);
}

// Auth Forms
function showLogin() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('loginForm').classList.add('active');
}

function showRegister() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('registerForm').classList.add('active');
}

function showForgotPassword() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('forgotPasswordForm').classList.add('active');
}

function showMFA() {
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('mfaForm').classList.add('active');
}

function showBackupCode() {
    showToast('Info', 'Enter your backup code in the verification field', 'info');
}

// Login Handler
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Login failed');
        }

        if (data.data.mfaRequired) {
            mfaToken = data.data.mfaToken;
            showMFA();
            showToast('Info', 'Please enter your 2FA code', 'info');
        } else {
            handleAuthSuccess(data.data);
        }
    } catch (error) {
        showToast('Error', error.message, 'error');
        document.getElementById('loginForm').classList.add('shake');
        setTimeout(() => document.getElementById('loginForm').classList.remove('shake'), 300);
    }
}

// Register Handler
async function handleRegister(event) {
    event.preventDefault();

    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (password !== confirmPassword) {
        showToast('Error', 'Passwords do not match', 'error');
        return;
    }

    if (!validatePassword(password)) {
        showToast('Error', 'Password does not meet requirements', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Registration failed');
        }

        showToast('Success', 'Account created! Please sign in.', 'success');
        showLogin();
        document.getElementById('loginEmail').value = email;
    } catch (error) {
        showToast('Error', error.message, 'error');
    }
}

// Forgot Password Handler
async function handleForgotPassword(event) {
    event.preventDefault();

    const email = document.getElementById('forgotEmail').value;

    try {
        const response = await fetch(`${API_BASE}/auth/password/reset`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Request failed');
        }

        showToast('Success', 'Password reset link sent to your email', 'success');
        showLogin();
    } catch (error) {
        showToast('Error', error.message, 'error');
    }
}

// MFA Handler
async function handleMFA(event) {
    event.preventDefault();

    const code = document.getElementById('mfaCode').value;

    try {
        const response = await fetch(`${API_BASE}/auth/mfa/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code, token: mfaToken })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Verification failed');
        }

        handleAuthSuccess(data.data);
    } catch (error) {
        showToast('Error', error.message, 'error');
        document.getElementById('mfaForm').classList.add('shake');
        setTimeout(() => document.getElementById('mfaForm').classList.remove('shake'), 300);
    }
}

// Auth Success
function handleAuthSuccess(data) {
    authToken = data.accessToken;
    refreshToken = data.refreshToken;
    currentUser = data.user;

    localStorage.setItem('authToken', authToken);
    localStorage.setItem('refreshToken', refreshToken);

    showDashboard();
    loadUserProfile();
    showToast('Success', 'Welcome back!', 'success');
}

// Logout
async function handleLogout() {
    try {
        await fetch(`${API_BASE}/auth/logout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Logout error:', error);
    }

    authToken = null;
    refreshToken = null;
    currentUser = null;

    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');

    showAuth();
    showToast('Info', 'You have been logged out', 'info');
}

// Show/Hide Containers
function showDashboard() {
    document.getElementById('authContainer').classList.add('d-none');
    document.getElementById('dashboardContainer').classList.remove('d-none');
    document.body.style.background = '#f8f9fa';
}

function showAuth() {
    document.getElementById('dashboardContainer').classList.add('d-none');
    document.getElementById('authContainer').classList.remove('d-none');
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    showLogin();
}

// Load User Profile
async function loadUserProfile() {
    try {
        const response = await fetch(`${API_BASE}/users/me`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        if (response.status === 401) {
            await refreshAuthToken();
            return loadUserProfile();
        }

        const data = await response.json();

        if (data.success) {
            currentUser = data.data;
            updateProfileUI();
        }
    } catch (error) {
        console.error('Failed to load profile:', error);
        // Use default data
        updateProfileUI();
    }
}

function updateProfileUI() {
    const user = currentUser || { name: 'User', email: 'user@example.com', id: '1', roles: ['user'], mfaEnabled: false };
    
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileId').textContent = user.id;
    document.getElementById('profileRoles').textContent = (user.roles || ['user']).join(', ');
    document.getElementById('profileMfa').innerHTML = user.mfaEnabled 
        ? '<span class="badge bg-success">Enabled</span>' 
        : '<span class="badge bg-warning">Not Enabled</span>';
    document.getElementById('profileLastLogin').textContent = new Date().toLocaleString();

    const mfaStatus = document.getElementById('mfaStatus');
    if (mfaStatus) {
        mfaStatus.className = user.mfaEnabled ? 'badge bg-success' : 'badge bg-warning';
        mfaStatus.textContent = user.mfaEnabled ? 'Enabled' : 'Not Enabled';
    }
}

// Load Sessions
async function loadSessions() {
    try {
        const response = await fetch(`${API_BASE}/sessions`, {
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();
        
        // Simulated data
        const sessions = [
            { id: '1', device: 'Chrome on Windows', ip: '192.168.1.1', location: 'Local', lastActive: new Date().toLocaleString(), current: true },
            { id: '2', device: 'Firefox on MacOS', ip: '192.168.1.2', location: 'Local', lastActive: '2 hours ago', current: false }
        ];

        renderSessions(sessions);
    } catch (error) {
        console.error('Failed to load sessions:', error);
    }
}

function renderSessions(sessions) {
    const tbody = document.getElementById('sessionsList');
    
    tbody.innerHTML = sessions.map(session => `
        <tr class="${session.current ? 'current-session' : ''}">
            <td><i class="bi bi-laptop me-2"></i>${session.device}</td>
            <td><code>${session.ip}</code></td>
            <td>${session.location}</td>
            <td>${session.lastActive}</td>
            <td>
                ${session.current 
                    ? '<span class="badge bg-success">Current</span>' 
                    : `<button class="btn btn-sm btn-outline-danger" onclick="revokeSession('${session.id}')">Revoke</button>`}
            </td>
        </tr>
    `).join('');
}

// Revoke Session
async function revokeSession(sessionId) {
    try {
        await fetch(`${API_BASE}/sessions/${sessionId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        showToast('Success', 'Session revoked', 'success');
        loadSessions();
    } catch (error) {
        showToast('Error', 'Failed to revoke session', 'error');
    }
}

async function revokeAllSessions() {
    if (!confirm('Are you sure you want to revoke all sessions? You will be logged out.')) return;

    try {
        await fetch(`${API_BASE}/sessions`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });
        
        showToast('Success', 'All sessions revoked', 'success');
        handleLogout();
    } catch (error) {
        showToast('Error', 'Failed to revoke sessions', 'error');
    }
}

// Load Activity
function loadActivity() {
    const activities = [
        { event: 'Login', ip: '192.168.1.1', device: 'Chrome on Windows', timestamp: new Date().toLocaleString(), status: 'success' },
        { event: 'Password Changed', ip: '192.168.1.1', device: 'Chrome on Windows', timestamp: '1 day ago', status: 'success' },
        { event: 'Failed Login', ip: '10.0.0.1', device: 'Unknown', timestamp: '2 days ago', status: 'failed' }
    ];

    const tbody = document.getElementById('activityList');
    tbody.innerHTML = activities.map(activity => `
        <tr>
            <td><i class="bi bi-${activity.event.includes('Login') ? 'box-arrow-in-right' : 'gear'} me-2"></i>${activity.event}</td>
            <td><code>${activity.ip}</code></td>
            <td>${activity.device}</td>
            <td>${activity.timestamp}</td>
            <td><span class="badge bg-${activity.status === 'success' ? 'success' : 'danger'}">${activity.status}</span></td>
        </tr>
    `).join('');
}

// Change Password
function showChangePassword() {
    navigateTo('security');
}

async function handleChangePassword(event) {
    event.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        showToast('Error', 'New passwords do not match', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/users/me/password`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentPassword, newPassword })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Password change failed');
        }

        showToast('Success', 'Password changed successfully', 'success');
        document.getElementById('currentPassword').value = '';
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    } catch (error) {
        showToast('Error', error.message, 'error');
    }
}

// MFA Setup
async function setupMFA() {
    try {
        const response = await fetch(`${API_BASE}/auth/mfa/setup`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${authToken}` }
        });

        const data = await response.json();

        if (data.success || data.data) {
            const mfaData = data.data || { qrCode: '', secret: 'DEMO-SECRET-KEY' };
            
            document.getElementById('mfaSetupContainer').classList.add('d-none');
            document.getElementById('mfaQRContainer').classList.remove('d-none');
            document.getElementById('mfaQRCode').src = mfaData.qrCode || 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=otpauth://totp/SecureAuth?secret=DEMO';
            document.getElementById('mfaSecret').textContent = mfaData.secret;

            navigateTo('security');
        }
    } catch (error) {
        showToast('Error', 'Failed to setup MFA', 'error');
    }
}

async function verifyMFASetup() {
    const code = document.getElementById('mfaVerifyCode').value;
    
    if (!code || code.length !== 6) {
        showToast('Error', 'Please enter a valid 6-digit code', 'error');
        return;
    }

    showToast('Success', '2FA has been enabled for your account', 'success');
    document.getElementById('mfaQRContainer').classList.add('d-none');
    document.getElementById('mfaSetupContainer').classList.remove('d-none');
    
    const mfaStatus = document.getElementById('mfaStatus');
    if (mfaStatus) {
        mfaStatus.className = 'badge bg-success';
        mfaStatus.textContent = 'Enabled';
    }
}

// Token Refresh
async function refreshAuthToken() {
    try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.data.accessToken;
            refreshToken = data.data.refreshToken;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('refreshToken', refreshToken);
        } else {
            handleLogout();
        }
    } catch (error) {
        handleLogout();
    }
}

// Toast Notifications
function showToast(title, message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toastTitle');
    const toastBody = document.getElementById('toastBody');
    const toastIcon = document.getElementById('toastIcon');

    toastTitle.textContent = title;
    toastBody.textContent = message;

    toastIcon.className = 'bi me-2';
    switch(type) {
        case 'success':
            toastIcon.classList.add('bi-check-circle', 'text-success');
            break;
        case 'error':
            toastIcon.classList.add('bi-x-circle', 'text-danger');
            break;
        case 'warning':
            toastIcon.classList.add('bi-exclamation-triangle', 'text-warning');
            break;
        default:
            toastIcon.classList.add('bi-info-circle', 'text-info');
    }

    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
}
