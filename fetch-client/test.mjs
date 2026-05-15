// Test file for universal-api

import { createApiClient, api } from './dist/index.mjs';

console.log('Testing universal-api package...\n');

// Test 1: Create client with base URL
console.log('Test 1: Create client with baseURL');
const client = createApiClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

console.log('✓ Client created with baseURL: https://jsonplaceholder.typicode.com\n');

// Test 2: GET request
console.log('Test 2: GET /posts/1');
try {
  const response = await client.get('/posts/1');
  console.log('✓ Status:', response.status);
  console.log('✓ Data keys:', Object.keys(response.data).slice(0, 5));
  console.log('');
} catch (error) {
  console.log('✗ Error:', error.message);
}

// Test 3: POST request
console.log('Test 3: POST /posts');
try {
  const response = await client.post('/posts', {
    body: { title: 'Test Post', body: 'Content', userId: 1 },
  });
  console.log('✓ Status:', response.status);
  console.log('✓ Created ID:', response.data.id);
  console.log('');
} catch (error) {
  console.log('✗ Error:', error.message);
}

// Test 4: With token
console.log('Test 4: GET with token');
const clientWithToken = createApiClient({
  baseURL: 'https://jsonplaceholder.typicode.com',
  token: 'my-secret-token',
  tokenType: 'Bearer',
});
console.log('✓ Client created with Bearer token\n');

// Test 5: Using default export
console.log('Test 5: Using default api export');
try {
  const response = await api.get('https://jsonplaceholder.typicode.com/posts/2');
  console.log('✓ Default api works, status:', response.status);
  console.log('');
} catch (error) {
  console.log('✗ Error:', error.message);
}

console.log('All tests completed!');