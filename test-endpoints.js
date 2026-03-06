const fetch = require('node-fetch');

const API_BASE = 'https://my-node-project-auth-jwt-socket-io.vercel.app';

async function testEndpoint(method, endpoint, body = null, token = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`;
  }
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    console.log(`\n${method} ${endpoint}: ${res.status}`);
    console.log(JSON.stringify(data, null, 2));
    return { status: res.status, data };
  } catch (err) {
    console.log(`\nError ${method} ${endpoint}: ${err.message}`);
    return { error: err.message };
  }
}

async function runTests() {
  console.log('Testing API endpoints...\n');

  // Login with existing user
  console.log('1. Logging in...');
  const loginData = await testEndpoint('POST', '/api/auth/login', {
    email: 'daniel@gmail.com',
    password: 'password123'
  });

  if (loginData.data && loginData.data.data && loginData.data.data.token) {
    const token = loginData.data.data.token;
    console.log('\nToken obtained:', token);

    // Test all endpoints
    console.log('\n2. Getting books...');
    await testEndpoint('GET', '/api/books/get', null, token);

    console.log('\n3. Adding a book...');
    await testEndpoint('POST', '/api/books/add', { title: 'Test Book', author: 'Test Author' }, token);

    console.log('\n4. Getting product stats...');
    await testEndpoint('GET', '/api/products/stats', null, token);

    console.log('\n5. Inserting sample products...');
    await testEndpoint('GET', '/api/products/insert-sample-products', null, token);

    console.log('\n6. Getting authors...');
    await testEndpoint('GET', '/api/authors/stats', null, token);

    console.log('\n7. Adding an author...');
    await testEndpoint('POST', '/api/books/author', { name: 'Test Author', bio: 'Test bio', birthDate: '1990-01-01' }, token);

    console.log('\n8. Getting images...');
    await testEndpoint('GET', '/api/images/get', null, token);

    console.log('\n9. Getting home...');
    await testEndpoint('GET', '/api/home', null, token);

    console.log('\n10. Getting admin...');
    await testEndpoint('GET', '/api/admin', null, token);
  } else {
    console.log('Login failed, cannot test protected endpoints.');
  }
}

runTests();