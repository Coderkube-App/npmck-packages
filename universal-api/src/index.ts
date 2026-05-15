// Universal API Client - Core Implementation
// Supports Next.js, React, React Native, and Vanilla.js

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type BodyType = 'json' | 'formdata' | 'text' | 'none';

export interface RequestConfig {
  baseURL?: string;
  body?: unknown;
  bodyType?: BodyType;
  token?: string;
  tokenType?: 'Bearer' | 'APIKey' | 'Custom';
  tokenPrefix?: string;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  retryStatusCodes?: number[];
  onRequest?: RequestInterceptor;
  onResponse?: ResponseInterceptor;
  onError?: ErrorInterceptor;
}

export interface RequestInterceptor {
  (config: RequestConfig): RequestConfig | Promise<RequestConfig>;
}

export interface ResponseInterceptor {
  <T>(response: ApiResponse<T>): ApiResponse<T> | Promise<ApiResponse<T>>;
}

export interface ErrorInterceptor {
  (error: ApiError): ApiError | Promise<ApiError>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  response?: ApiResponse;
  config: RequestConfig;
}

export interface UniversalApiClient {
  get<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  post<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  put<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  patch<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  delete<T = unknown>(url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
  request<T = unknown>(method: HttpMethod, url: string, config?: RequestConfig): Promise<ApiResponse<T>>;
}

function buildURL(baseURL: string, url: string, params?: Record<string, string | number | boolean>): string {
  const fullURL = baseURL + url;
  if (!params || Object.keys(params).length === 0) return fullURL;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value));
  });

  const separator = fullURL.includes('?') ? '&' : '?';
  return fullURL + separator + searchParams.toString();
}

function buildHeaders(config: RequestConfig): Record<string, string> {
  const headers: Record<string, string> = { ...config.headers };

  if (config.token) {
    const prefix = config.tokenPrefix || (config.tokenType === 'Bearer' ? 'Bearer' : config.tokenType === 'APIKey' ? '' : '');
    headers['Authorization'] = `${prefix} ${config.token}`.trim();
  }

  if (config.bodyType === 'json' && config.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json';
  } else if (config.bodyType === 'formdata' && config.body instanceof FormData) {
    // Let browser set Content-Type with boundary
  }

  return headers;
}

function buildBody(body: unknown, bodyType?: BodyType): unknown {
  if (bodyType === 'none' || body === undefined) return undefined;
  if (bodyType === 'formdata' || body instanceof FormData) return body;
  if (bodyType === 'text') return body;
  return JSON.stringify(body);
}

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function createApiClient(defaultConfig: RequestConfig = {}): UniversalApiClient {
  const client: UniversalApiClient = {
    async request<T = unknown>(method: HttpMethod, url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
      let mergedConfig: RequestConfig = {
        ...defaultConfig,
        ...config,
        headers: { ...defaultConfig.headers, ...config.headers },
        params: { ...defaultConfig.params, ...config.params },
      };

      // Request interceptor
      if (mergedConfig.onRequest) {
        mergedConfig = { ...(await mergedConfig.onRequest(mergedConfig)) };
      }

      const finalURL = buildURL(mergedConfig.baseURL || '', url, mergedConfig.params);
      const headers = buildHeaders(mergedConfig);
      const body = buildBody(mergedConfig.body, mergedConfig.bodyType);
      const timeout = mergedConfig.timeout || 30000;
      const retries = mergedConfig.retries || 0;
      const retryDelay = mergedConfig.retryDelay || 1000;
      const retryStatusCodes = mergedConfig.retryStatusCodes || [408, 429, 500, 502, 503, 504];

      let lastError: ApiError | undefined;
      let attempt = 0;

      while (attempt <= retries) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), timeout);

          const fetchOptions: RequestInit = {
            method,
            headers,
            body: body as BodyInit | undefined,
            signal: controller.signal,
          };

          const response = await fetch(finalURL, fetchOptions);
          clearTimeout(timeoutId);

          const responseHeaders: Record<string, string> = {};
          response.headers.forEach((value, key) => {
            responseHeaders[key] = value;
          });

          let data: T;
          const contentType = response.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            data = await response.json();
          } else {
            data = await response.text() as unknown as T;
          }

          const apiResponse: ApiResponse<T> = {
            data,
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
          };

          // Response interceptor
          if (mergedConfig.onResponse) {
            return await mergedConfig.onResponse(apiResponse);
          }

          return apiResponse;
        } catch (error) {
          lastError = error as ApiError;

          // Error interceptor
          if (mergedConfig.onError && attempt === retries) {
            const handledError = await mergedConfig.onError(lastError as ApiError);
            if (handledError) throw handledError;
          }

          // Check if retryable
          const status = (error as ApiError)?.status;
          if (status && !retryStatusCodes.includes(status)) {
            throw error;
          }

          attempt++;
          if (attempt <= retries) {
            await delay(retryDelay * attempt);
          }
        }
      }

      throw lastError;
    },

    get<T = unknown>(url: string, config?: RequestConfig) {
      return this.request<T>('GET', url, config);
    },

    post<T = unknown>(url: string, config?: RequestConfig) {
      return this.request<T>('POST', url, { ...config, bodyType: config?.bodyType || 'json' });
    },

    put<T = unknown>(url: string, config?: RequestConfig) {
      return this.request<T>('PUT', url, { ...config, bodyType: config?.bodyType || 'json' });
    },

    patch<T = unknown>(url: string, config?: RequestConfig) {
      return this.request<T>('PATCH', url, { ...config, bodyType: config?.bodyType || 'json' });
    },

    delete<T = unknown>(url: string, config?: RequestConfig) {
      return this.request<T>('DELETE', url, config);
    },
  };

  return client;
}

// Default client instance
export const api = createApiClient();

// Utility types for better DX
export interface ApiEndpoint<TBody = unknown, TResponse = unknown> {
  url: string;
  method: HttpMethod;
  config?: RequestConfig;
}

export type ApiEndpoints = Record<string, ApiEndpoint>;