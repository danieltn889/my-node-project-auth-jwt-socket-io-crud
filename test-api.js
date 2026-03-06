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
    console.log(`${method} ${endpoint}: ${res.status}`);
    console.log(JSON.stringify(data, null, 2));
    return data;
  } catch (err) {
    console.log(`Error ${method} ${endpoint}: ${err.message}`);
    return null;
  }
}

async function runTests() {
  console.log('Testing API endpoints...\n');

  // Test register
  console.log('1. Registering a new user...');
  const registerData = await testEndpoint('POST', '/api/auth/register', {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });

  // Test login
  console.log('\n2. Logging in...');
  const loginData = await testEndpoint('POST', '/api/auth/login', {
    email: 'daniel@gmail.com', // Use existing user
    password: 'password123' // Assuming this password
  });

  if (loginData && loginData.data && loginData.data.token) {
    const token = loginData.data.token;
    console.log('\nToken obtained:', token);

    // Test protected endpoints
    console.log('\n3. Getting books...');
    await testEndpoint('GET', '/api/books', null, token);

    console.log('\n4. Adding a book...');
    await testEndpoint('POST', '/api/books', { title: 'Test Book', author: 'Test Author' }, token);

    console.log('\n5. Getting products...');
    await testEndpoint('GET', '/api/products', null, token);

    console.log('\n6. Adding a product...');
    await testEndpoint('POST', '/api/products', { name: 'Test Product', price: 10 }, token);

    console.log('\n7. Getting authors...');
    await testEndpoint('GET', '/api/authors', null, token);

    console.log('\n8. Adding an author...');
    await testEndpoint('POST', '/api/authors', { name: 'Test Author' }, token);

    console.log('\n9. Getting images...');
    await testEndpoint('GET', '/api/images', null, token);

    console.log('\n10. Getting home...');
    await testEndpoint('GET', '/api/home', null, token);

    console.log('\n11. Getting admin...');
    await testEndpoint('GET', '/api/admin', null, token);
  } else {
    console.log('Login failed, cannot test protected endpoints.');
  }
}

runTests();