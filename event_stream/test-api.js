const jwt = require('jsonwebtoken');
const http = require('http');

const BASE_URL = 'http://localhost:3000';
const JWT_SECRET = 'change-this-secret-in-production';

// Generate test tokens
function generateToken(role, permissions) {
  return jwt.sign(
    { 
      userId: 'test-user-1', 
      email: 'test@example.com',
      role,
      permissions
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
}

// Admin token with all permissions
const adminToken = generateToken('admin', ['*']);
// Producer token
const producerToken = generateToken('producer', ['produce:all', 'read:topics']);
// Consumer token
const consumerToken = generateToken('consumer', ['consume:all', 'read:topics']);

function makeRequest(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            data
          });
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
  console.log('🚀 Event Stream API Tests\n');
  console.log('='.repeat(50));
  
  let passed = 0;
  let failed = 0;
  
  // Test 1: Health Check
  console.log('\n📋 Test 1: Health Check');
  try {
    const res = await makeRequest('GET', '/health', null, null);
    if (res.status === 200 && res.data.status === 'ok') {
      console.log('   ✅ PASSED - Health endpoint working');
      passed++;
    } else {
      console.log('   ❌ FAILED - Health endpoint not responding correctly');
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  // Test 2: Create Topic (with admin token)
  console.log('\n📋 Test 2: Create Topic (Admin)');
  try {
    const res = await makeRequest('POST', '/api/v1/topics', {
      name: 'test-topic',
      partitions: 3,
      replicationFactor: 1
    }, adminToken);
    if (res.status === 201 && res.data.success) {
      console.log('   ✅ PASSED - Topic created successfully');
      passed++;
    } else {
      console.log('   ❌ FAILED -', JSON.stringify(res.data));
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  // Test 3: List Topics
  console.log('\n📋 Test 3: List Topics');
  try {
    const res = await makeRequest('GET', '/api/v1/topics', null, adminToken);
    if (res.status === 200 && res.data.success) {
      console.log('   ✅ PASSED - Topics listed successfully');
      console.log('   📊 Topics:', res.data.data.length);
      passed++;
    } else {
      console.log('   ❌ FAILED -', JSON.stringify(res.data));
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  // Test 4: Get Topic Details
  console.log('\n📋 Test 4: Get Topic Details');
  try {
    const res = await makeRequest('GET', '/api/v1/topics/test-topic', null, adminToken);
    if (res.status === 200 && res.data.success) {
      console.log('   ✅ PASSED - Topic details retrieved');
      console.log('   📊 Topic:', res.data.data.name);
      passed++;
    } else {
      console.log('   ❌ FAILED -', JSON.stringify(res.data));
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  // Test 5: Publish Event
  console.log('\n📋 Test 5: Publish Event to Topic');
  try {
    const res = await makeRequest('POST', '/api/v1/topics/test-topic/events', {
      key: 'user.created',
      value: { userId: 'user-123', email: 'user@example.com' },
      headers: { source: 'test-api' }
    }, producerToken);
    if (res.status === 201 && res.data.success) {
      console.log('   ✅ PASSED - Event published successfully');
      passed++;
    } else {
      console.log('   ❌ FAILED -', JSON.stringify(res.data));
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  // Test 6: Publish Batch Events
  console.log('\n📋 Test 6: Publish Batch Events');
  try {
    const res = await makeRequest('POST', '/api/v1/topics/test-topic/events/batch', {
      events: [
        { key: 'user.updated', value: { userId: 'user-124' }, headers: {} },
        { key: 'user.updated', value: { userId: 'user-125' }, headers: {} },
        { key: 'user.deleted', value: { userId: 'user-126' }, headers: {} }
      ]
    }, producerToken);
    if (res.status === 201 && res.data.success) {
      console.log('   ✅ PASSED - Batch events published');
      passed++;
    } else {
      console.log('   ❌ FAILED -', JSON.stringify(res.data));
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  // Test 7: Get Events from Topic
  console.log('\n📋 Test 7: Get Events from Topic');
  try {
    const res = await makeRequest('GET', '/api/v1/topics/test-topic/events', null, consumerToken);
    if (res.status === 200 && res.data.success) {
      console.log('   ✅ PASSED - Events retrieved');
      console.log('   📊 Event count:', res.data.data.length);
      passed++;
    } else {
      console.log('   ❌ FAILED -', JSON.stringify(res.data));
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  // Test 8: Create Consumer Group
  console.log('\n📋 Test 8: Create Consumer Group');
  try {
    const res = await makeRequest('POST', '/api/v1/consumer-groups', {
      name: 'test-consumer-group',
      topics: ['test-topic']
    }, adminToken);
    if (res.status === 201 && res.data.success) {
      console.log('   ✅ PASSED - Consumer group created');
      passed++;
    } else {
      console.log('   ❌ FAILED -', JSON.stringify(res.data));
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  // Test 9: Get Metrics
  console.log('\n📋 Test 9: Get Metrics');
  try {
    const res = await makeRequest('GET', '/api/v1/metrics', null, adminToken);
    if (res.status === 200 && res.data.success) {
      console.log('   ✅ PASSED - Metrics retrieved');
      passed++;
    } else {
      console.log('   ❌ FAILED -', JSON.stringify(res.data));
      failed++;
    }
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  // Test 10: Authentication Required (No Token)
  console.log('\n📋 Test 10: Authentication Required (No Token)');
  try {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/v1/topics',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }, (res) => {
      if (res.statusCode === 401) {
        console.log('   ✅ PASSED - Correctly requires authentication');
        passed++;
      } else {
        console.log('   ❌ FAILED - Should require authentication');
        failed++;
      }
      printSummary();
    });
    req.end();
    return;
  } catch (err) {
    console.log('   ❌ FAILED -', err.message);
    failed++;
  }

  function printSummary() {
    console.log('\n' + '='.repeat(50));
    console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
    console.log(`   Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);
    
    if (failed === 0) {
      console.log('\n🎉 All tests passed! Event Stream is working correctly.');
    } else {
      console.log('\n⚠️  Some tests failed. Please check the issues above.');
    }
  }
}

runTests();
