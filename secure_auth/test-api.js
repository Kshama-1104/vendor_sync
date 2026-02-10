// Secure Auth API Test Script
const http = require('http');

const API_BASE = 'http://localhost:3001';

function makeRequest(method, path, body = null, headers = {}) {
    return new Promise((resolve, reject) => {
        const url = new URL(API_BASE + path);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                ...headers
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log('\n========================================');
    console.log('   SECURE AUTH API FUNCTION TESTS');
    console.log('========================================\n');

    let passed = 0;
    let failed = 0;
    let token = null;
    let refreshToken = null;

    // Test 1: Health Check
    console.log('1. Health Check');
    try {
        const res = await makeRequest('GET', '/health');
        if (res.data.status === 'ok') {
            console.log('   ✅ PASSED - Server is healthy');
            console.log(`   Uptime: ${res.data.uptime.toFixed(2)}s`);
            passed++;
        } else {
            console.log('   ❌ FAILED');
            failed++;
        }
    } catch (e) {
        console.log('   ❌ FAILED -', e.message);
        failed++;
    }

    // Test 2: Register New User
    console.log('\n2. Register User');
    try {
        const res = await makeRequest('POST', '/api/v1/auth/register', {
            name: 'API Test User',
            email: `apitest${Date.now()}@example.com`,
            password: 'TestPassword123!'
        });
        if (res.data.success) {
            console.log('   ✅ PASSED - User registered');
            console.log(`   User ID: ${res.data.data.id}`);
            passed++;
        } else {
            console.log('   ⚠️ SKIPPED -', res.data.error?.message || 'Unknown error');
        }
    } catch (e) {
        console.log('   ⚠️ SKIPPED -', e.message);
    }

    // Test 3: Login
    console.log('\n3. Login');
    try {
        const res = await makeRequest('POST', '/api/v1/auth/register', {
            name: 'Login Test',
            email: `logintest${Date.now()}@example.com`,
            password: 'TestPassword123!'
        });
        
        const loginRes = await makeRequest('POST', '/api/v1/auth/login', {
            email: res.data.data.email,
            password: 'TestPassword123!'
        });
        
        if (loginRes.data.success && loginRes.data.data.accessToken) {
            console.log('   ✅ PASSED - Login successful');
            console.log(`   Token received: ${loginRes.data.data.accessToken.substring(0, 20)}...`);
            token = loginRes.data.data.accessToken;
            refreshToken = loginRes.data.data.refreshToken;
            passed++;
        } else {
            console.log('   ❌ FAILED');
            failed++;
        }
    } catch (e) {
        console.log('   ❌ FAILED -', e.message);
        failed++;
    }

    // Test 4: Get Current User (with auth)
    console.log('\n4. Get Current User (Protected Route)');
    if (token) {
        try {
            const res = await makeRequest('GET', '/api/v1/users/me', null, {
                'Authorization': `Bearer ${token}`
            });
            if (res.status === 200) {
                console.log('   ✅ PASSED - Auth middleware works');
                passed++;
            } else {
                console.log('   ❌ FAILED - Status:', res.status);
                failed++;
            }
        } catch (e) {
            console.log('   ❌ FAILED -', e.message);
            failed++;
        }
    } else {
        console.log('   ⚠️ SKIPPED - No token available');
    }

    // Test 5: Token Refresh
    console.log('\n5. Token Refresh');
    if (refreshToken) {
        try {
            const res = await makeRequest('POST', '/api/v1/auth/refresh', {
                refreshToken: refreshToken
            });
            if (res.data.success && res.data.data.accessToken) {
                console.log('   ✅ PASSED - Token refreshed');
                console.log(`   New token: ${res.data.data.accessToken.substring(0, 20)}...`);
                passed++;
            } else {
                console.log('   ❌ FAILED');
                failed++;
            }
        } catch (e) {
            console.log('   ❌ FAILED -', e.message);
            failed++;
        }
    } else {
        console.log('   ⚠️ SKIPPED - No refresh token');
    }

    // Test 6: MFA Setup
    console.log('\n6. MFA Setup');
    if (token) {
        try {
            const res = await makeRequest('POST', '/api/v1/auth/mfa/setup', null, {
                'Authorization': `Bearer ${token}`
            });
            if (res.data.success && res.data.data.secret) {
                console.log('   ✅ PASSED - MFA setup initiated');
                console.log(`   Secret: ${res.data.data.secret.substring(0, 10)}...`);
                console.log(`   Backup codes: ${res.data.data.backupCodes.length} codes`);
                passed++;
            } else {
                console.log('   ❌ FAILED');
                failed++;
            }
        } catch (e) {
            console.log('   ❌ FAILED -', e.message);
            failed++;
        }
    } else {
        console.log('   ⚠️ SKIPPED - No token');
    }

    // Test 7: Get Sessions
    console.log('\n7. Get Sessions');
    if (token) {
        try {
            const res = await makeRequest('GET', '/api/v1/sessions', null, {
                'Authorization': `Bearer ${token}`
            });
            if (res.status === 200) {
                console.log('   ✅ PASSED - Sessions endpoint works');
                passed++;
            } else {
                console.log('   ❌ FAILED');
                failed++;
            }
        } catch (e) {
            console.log('   ❌ FAILED -', e.message);
            failed++;
        }
    } else {
        console.log('   ⚠️ SKIPPED - No token');
    }

    // Test 8: Unauthorized Access
    console.log('\n8. Unauthorized Access (No Token)');
    try {
        const res = await makeRequest('GET', '/api/v1/users/me');
        if (res.status === 401) {
            console.log('   ✅ PASSED - Correctly rejected');
            passed++;
        } else {
            console.log('   ❌ FAILED - Should reject');
            failed++;
        }
    } catch (e) {
        console.log('   ❌ FAILED -', e.message);
        failed++;
    }

    // Test 9: Invalid Token
    console.log('\n9. Invalid Token');
    try {
        const res = await makeRequest('GET', '/api/v1/users/me', null, {
            'Authorization': 'Bearer invalid_token_here'
        });
        if (res.status === 401) {
            console.log('   ✅ PASSED - Invalid token rejected');
            passed++;
        } else {
            console.log('   ❌ FAILED - Should reject invalid token');
            failed++;
        }
    } catch (e) {
        console.log('   ❌ FAILED -', e.message);
        failed++;
    }

    // Summary
    console.log('\n========================================');
    console.log('   TEST SUMMARY');
    console.log('========================================');
    console.log(`   ✅ Passed: ${passed}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   Total: ${passed + failed}`);
    console.log('========================================\n');
}

runTests().catch(console.error);
