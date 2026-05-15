# universal-api-hooks

Cross-platform API client for Next.js, React, React Native, and Vanilla.js with interceptors, retries, and full TypeScript support.

## Features

- **Body** - Request body (JSON, FormData, text)
- **Token** - Auth token (Bearer, API key, Custom)
- **Params** - Query string parameters
- **Headers** - Custom headers
- **Timeout** - Request timeout
- **Retries** - Auto retry on failure
- **Interceptors** - Before/after request hooks
- **Methods** - GET, POST, PUT, PATCH, DELETE
- **TypeScript** - Full type definitions

## Installation

```bash
npm install universal-api-hooks
```

## Usage

### Vanilla JS / Node.js

```javascript
import { createApiClient, api } from 'universal-api-hooks';

// Create client with base URL
const client = createApiClient({
  baseURL: 'https://api.example.com',
  token: 'your-token',
  tokenType: 'Bearer',
  timeout: 30000,
});

// GET request
const response = await client.get('/users');

// POST request
const response = await client.post('/users', {
  body: { name: 'John', email: 'john@example.com' },
});

// PUT request
const response = await client.put('/users/1', {
  body: { name: 'John Updated' },
});

// PATCH request
const response = await client.patch('/users/1', {
  body: { name: 'John' },
});

// DELETE request
const response = await client.delete('/users/1');
```

### React

```tsx
import { useApi, useGet, usePost, useMutation, ApiProvider } from 'universal-api-hooks/react';

// Wrap your app with provider
function App() {
  return (
    <ApiProvider config={{ baseURL: 'https://api.example.com', token: 'xxx' }}>
      <MyComponent />
    </ApiProvider>
  );
}

// Using useGet hook
function UserList() {
  const { data, loading, error, execute } = useGet('/users', {
    immediate: true,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data?.map(user => <div key={user.id}>{user.name}</div>)}</div>;
}

// Using useMutation
function CreateUser() {
  const { mutate, data, loading, error } = useMutation('/users', 'POST', {
    onSuccess: (data) => console.log('Created:', data),
  });

  return (
    <button onClick={() => mutate({ body: { name: 'John' } })}>
      {loading ? 'Creating...' : 'Create User'}
    </button>
  );
}

// Manual execute
function ManualFetch() {
  const { data, loading, execute } = useApi('/users', 'GET', { immediate: false });

  return <button onClick={() => execute()}>Fetch Users</button>;
}
```

### React Native

```javascript
import { createApiClient, api, useApi } from 'universal-api-hooks/react-native';

const client = createApiClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,
});

const response = await client.get('/users');
```

### Next.js

Same as React usage - works with both client and server components.

## API Reference

### RequestConfig

| Option | Type | Description |
|--------|------|-------------|
| `baseURL` | `string` | Base URL for all requests |
| `body` | `unknown` | Request body |
| `bodyType` | `'json' \| 'formdata' \| 'text' \| 'none'` | Body content type |
| `token` | `string` | Auth token |
| `tokenType` | `'Bearer' \| 'APIKey' \| 'Custom'` | Token type |
| `tokenPrefix` | `string` | Custom token prefix |
| `params` | `Record<string>` | Query parameters |
| `headers` | `Record<string>` | Custom headers |
| `timeout` | `number` | Request timeout (ms) |
| `retries` | `number` | Number of retry attempts |
| `retryDelay` | `number` | Delay between retries (ms) |
| `retryStatusCodes` | `number[]` | Status codes that trigger retry |
| `onRequest` | `RequestInterceptor` | Request interceptor function |
| `onResponse` | `ResponseInterceptor` | Response interceptor function |
| `onError` | `ErrorInterceptor` | Error interceptor function |

### Interceptors

```javascript
const client = createApiClient({
  baseURL: 'https://api.example.com',

  // Before request
  onRequest: (config) => {
    console.log('Request:', config.url);
    config.headers['X-Custom-Header'] = 'value';
    return config;
  },

  // After response
  onResponse: (response) => {
    console.log('Response status:', response.status);
    return response;
  },

  // On error
  onError: (error) => {
    console.log('Error:', error.message);
    return error;
  },
});
```

### ApiResponse

```typescript
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}
```

## License

MIT