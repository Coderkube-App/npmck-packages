// Vanilla JS implementation for Universal API Client
// Works in browser, Node.js, and any JavaScript environment

import { createApiClient } from './index';
import type { RequestConfig, ApiResponse, HttpMethod, BodyType, UniversalApiClient } from './index';

export { createApiClient };
export { api } from './index';
export type {
  RequestConfig,
  ApiResponse,
  HttpMethod,
  BodyType,
  UniversalApiClient,
} from './index';

// Create a global API instance
const globalApi = createApiClient();

// Auto-detect environment and expose appropriate API
function setupGlobalApi() {
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).$api = globalApi;
  }

  if (typeof global !== 'undefined') {
    (global as unknown as Record<string, unknown>).$api = globalApi;
  }
}

// Helper to quickly configure the API client
export function configureApi(config: RequestConfig): UniversalApiClient {
  return createApiClient(config);
}

// Quick request helpers for browser console/quick usage
export function $get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
  return globalApi.get<T>(url, config);
}

export function $post<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
  return globalApi.post<T>(url, config);
}

export function $put<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
  return globalApi.put<T>(url, config);
}

export function $patch<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
  return globalApi.patch<T>(url, config);
}

export function $delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
  return globalApi.delete<T>(url, config);
}

// Class-based API client for better organization
export class ApiClient {
  private client: UniversalApiClient;
  private baseConfig: RequestConfig;

  constructor(baseConfig: RequestConfig = {}) {
    this.baseConfig = baseConfig;
    this.client = createApiClient(baseConfig);
  }

  get url() {
    return this.baseConfig.baseURL || '';
  }

  setBaseURL(url: string) {
    this.baseConfig.baseURL = url;
    this.client = createApiClient(this.baseConfig);
  }

  setToken(token: string, type: 'Bearer' | 'APIKey' | 'Custom' = 'Bearer', prefix?: string) {
    this.baseConfig.token = token;
    this.baseConfig.tokenType = type;
    this.baseConfig.tokenPrefix = prefix;
    this.client = createApiClient(this.baseConfig);
  }

  get<T = unknown>(endpoint: string, config?: RequestConfig) {
    return this.client.get<T>(endpoint, { ...this.baseConfig, ...config });
  }

  post<T = unknown>(endpoint: string, config?: RequestConfig) {
    return this.client.post<T>(endpoint, { ...this.baseConfig, ...config });
  }

  put<T = unknown>(endpoint: string, config?: RequestConfig) {
    return this.client.put<T>(endpoint, { ...this.baseConfig, ...config });
  }

  patch<T = unknown>(endpoint: string, config?: RequestConfig) {
    return this.client.patch<T>(endpoint, { ...this.baseConfig, ...config });
  }

  delete<T = unknown>(endpoint: string, config?: RequestConfig) {
    return this.client.delete<T>(endpoint, { ...this.baseConfig, ...config });
  }
}

// Initialize global helpers
if (typeof window !== 'undefined' || typeof global !== 'undefined') {
  setupGlobalApi();
}

export { globalApi };