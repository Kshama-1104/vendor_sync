// Cloud Queue API Test Script
const http = require('http');

const BASE_URL = 'http://localhost:3000';
const API_KEY = 'demo-api-key';

function makeRequest(method, path, body = null) {
    return new Promise((resolve, reject) => {
        const url = new URL(path, BASE_URL);
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname + url.search,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', reject);

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('========================================');
    console.log('Cloud Queue API Test Suite');
    console.log('========================================\n');

    let passed = 0;
    let failed = 0;

    // Test 1: Health Check
    console.log('Test 1: Health Check');
    try {
        const result = await makeRequest('GET', '/health');
        if (result.status === 200 && result.data.status === 'ok') {
            console.log('✅ PASSED - Server is healthy\n');
            passed++;
        } else {
            console.log('❌ FAILED\n');
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED - Server not responding\n');
        failed++;
        return;
    }

    // Test 2: List Default Queues
    console.log('Test 2: List Default Queues');
    try {
        const result = await makeRequest('GET', '/api/v1/queues');
        if (result.status === 200 && result.data.success) {
            console.log('✅ PASSED - Found', result.data.data.data.length, 'queues');
            passed++;
        } else {
            console.log('❌ FAILED:', result.data);
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED:', e.message);
        failed++;
    }

    // Test 3: Create New Queue
    console.log('\nTest 3: Create New Queue');
    try {
        const result = await makeRequest('POST', '/api/v1/queues', {
            name: 'test-queue-' + Date.now(),
            type: 'standard'
        });
        if (result.status === 201 && result.data.success) {
            console.log('✅ PASSED - Queue created:', result.data.data.name);
            passed++;
        } else {
            console.log('❌ FAILED:', result.data);
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED:', e.message);
        failed++;
    }

    // Test 4: Create Priority Queue
    console.log('\nTest 4: Create Priority Queue');
    try {
        const result = await makeRequest('POST', '/api/v1/queues', {
            name: 'my-priority-queue',
            type: 'priority'
        });
        if (result.status === 201 && result.data.success) {
            console.log('✅ PASSED - Priority queue created');
            passed++;
        } else {
            console.log('❌ FAILED:', result.data);
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED:', e.message);
        failed++;
    }

    // Test 5: Publish Message to Default Queue
    console.log('\nTest 5: Publish Message to Default Queue');
    try {
        const result = await makeRequest('POST', '/api/v1/queues/default-queue/messages', {
            body: { task: 'process-order', orderId: '12345' },
            priority: 8
        });
        if (result.status === 201 && result.data.success) {
            console.log('✅ PASSED - Message published:', result.data.data.messageId);
            passed++;
        } else {
            console.log('❌ FAILED:', result.data);
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED:', e.message);
        failed++;
    }

    // Test 6: Publish Message to Priority Queue
    console.log('\nTest 6: Publish Message to Priority Queue');
    try {
        const result = await makeRequest('POST', '/api/v1/queues/priority-queue/messages', {
            body: { task: 'urgent-task', priority: 'high' },
            priority: 10
        });
        if (result.status === 201 && result.data.success) {
            console.log('✅ PASSED - Priority message published:', result.data.data.messageId);
            passed++;
        } else {
            console.log('❌ FAILED:', result.data);
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED:', e.message);
        failed++;
    }

    // Test 7: Receive Messages
    console.log('\nTest 7: Receive Messages from Default Queue');
    try {
        const result = await makeRequest('GET', '/api/v1/queues/default-queue/messages?maxMessages=5');
        if (result.status === 200 && result.data.success) {
            console.log('✅ PASSED - Received', result.data.data.length, 'messages');
            passed++;
        } else {
            console.log('❌ FAILED:', result.data);
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED:', e.message);
        failed++;
    }

    // Test 8: Get System Metrics
    console.log('\nTest 8: Get System Metrics');
    try {
        const result = await makeRequest('GET', '/api/v1/metrics/system');
        if (result.status === 200 && result.data.success) {
            console.log('✅ PASSED - System metrics retrieved');
            console.log('   - Total queues:', result.data.data.queues.total);
            console.log('   - Uptime:', Math.round(result.data.data.system.uptime), 'seconds');
            passed++;
        } else {
            console.log('❌ FAILED:', result.data);
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED:', e.message);
        failed++;
    }

    // Test 9: Batch Publish
    console.log('\nTest 9: Batch Publish Messages');
    try {
        const result = await makeRequest('POST', '/api/v1/queues/default-queue/messages/batch', {
            messages: [
                { body: { task: 'task1' }, priority: 5 },
                { body: { task: 'task2' }, priority: 7 },
                { body: { task: 'task3' }, priority: 3 }
            ]
        });
        if (result.status === 201 && result.data.success) {
            console.log('✅ PASSED - Batch published:', result.data.data.successful, 'messages');
            passed++;
        } else {
            console.log('❌ FAILED:', result.data);
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED:', e.message);
        failed++;
    }

    // Test 10: Get Queue Metrics
    console.log('\nTest 10: Get Queue Metrics');
    try {
        const result = await makeRequest('GET', '/api/v1/metrics/queues/default-queue');
        if (result.status === 200 && result.data.success) {
            console.log('✅ PASSED - Queue metrics retrieved');
            console.log('   - Queue Depth:', result.data.data.metrics.queueDepth);
            console.log('   - Messages Published:', result.data.data.metrics.messagesPublished);
            passed++;
        } else {
            console.log('❌ FAILED:', result.data);
            failed++;
        }
    } catch (e) {
        console.log('❌ FAILED:', e.message);
        failed++;
    }

    // Summary
    console.log('\n========================================');
    console.log('Test Results Summary');
    console.log('========================================');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`Total: ${passed + failed}`);
    console.log('========================================\n');

    if (failed === 0) {
        console.log('🎉 All tests passed! Cloud Queue is working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Please check the issues above.');
    }
}

runTests().catch(console.error);
