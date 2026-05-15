// React Hooks for Universal API Client

import { createApiClient, RequestConfig, ApiResponse, HttpMethod, BodyType } from './index';
import { useState, useCallback, useEffect, useRef } from 'react';

export interface UseApiOptions extends RequestConfig {
  immediate?: boolean;
}

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  response: ApiResponse<T> | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  execute: (config?: RequestConfig) => Promise<ApiResponse<T> | undefined>;
  reset: () => void;
}

export interface UseApiMutationOptions<T> {
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
  onSuccess?: (data: T, response: ApiResponse<T>) => void;
  onError?: (error: Error, response?: ApiResponse) => void;
}

export interface UseApiMutationReturn<T> {
  mutate: (config?: RequestConfig) => Promise<ApiResponse<T> | undefined>;
  mutateAsync: (config?: RequestConfig) => Promise<ApiResponse<T>>;
  data: T | null;
  loading: boolean;
  error: Error | null;
  response: ApiResponse<T> | null;
  reset: () => void;
}

function getAxiosErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return String(error);
}

export function useApi<T = unknown>(
  url: string,
  method: HttpMethod = 'GET',
  options: UseApiOptions = {}
): UseApiReturn<T> {
  const {
    immediate = false,
    ...clientConfig
  } = options;

  const client = createApiClient(clientConfig);

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ApiResponse<T> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(async (config?: RequestConfig): Promise<ApiResponse<T> | undefined> => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const res = await client.request<T>(method, url, { ...clientConfig, ...config });

      if (mountedRef.current) {
        setData(res.data);
        setResponse(res);
        setLoading(false);
      }

      return res;
    } catch (err) {
      if (mountedRef.current) {
        const error = new Error(getAxiosErrorMessage(err));
        setError(error);
        setLoading(false);
      }
      return undefined;
    }
  }, [client, method, url, clientConfig]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setResponse(null);
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { data, loading, error, response, execute, reset };
}

export function useGet<T = unknown>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(url, 'GET', options);
}

export function usePost<T = unknown>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(url, 'POST', options);
}

export function usePut<T = unknown>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(url, 'PUT', options);
}

export function usePatch<T = unknown>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(url, 'PATCH', options);
}

export function useDelete<T = unknown>(url: string, options: UseApiOptions = {}) {
  return useApi<T>(url, 'DELETE', options);
}

export function useMutation<T = unknown>(
  url: string,
  method: HttpMethod = 'POST',
  options: UseApiMutationOptions<T> = {}
): UseApiMutationReturn<T> {
  const { onSuccess, onError, ...clientConfig } = options;

  const client = createApiClient(clientConfig);

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [response, setResponse] = useState<ApiResponse<T> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const mutate = useCallback(async (config?: RequestConfig): Promise<ApiResponse<T> | undefined> => {
    if (!mountedRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const res = await client.request<T>(method, url, { ...clientConfig, ...config });

      if (mountedRef.current) {
        setData(res.data);
        setResponse(res);
        setLoading(false);

        if (onSuccess) {
          onSuccess(res.data, res);
        }
      }

      return res;
    } catch (err) {
      if (mountedRef.current) {
        const error = new Error(getAxiosErrorMessage(err));
        setError(error);
        setLoading(false);

        if (onError) {
          onError(error, response || undefined);
        }
      }
      return undefined;
    }
  }, [client, method, url, clientConfig, onSuccess, onError, response]);

  const mutateAsync = useCallback(async (config?: RequestConfig): Promise<ApiResponse<T>> => {
    const result = await mutate(config);
    if (!result) {
      throw new Error('Mutation failed');
    }
    return result;
  }, [mutate]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
    setResponse(null);
  }, []);

  return { mutate, mutateAsync, data, loading, error, response, reset };
}

// Query provider context for React Query-like experience
export interface ApiProviderConfig {
  baseURL?: string;
  token?: string;
  tokenType?: 'Bearer' | 'APIKey' | 'Custom';
  tokenPrefix?: string;
  defaultHeaders?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

interface ApiContextValue {
  config: ApiProviderConfig;
  client: ReturnType<typeof createApiClient>;
}

const ApiContext = React.createContext<ApiContextValue | null>(null);

export function ApiProvider({
  children,
  config
}: {
  children: React.ReactNode;
  config: ApiProviderConfig;
}) {
  const client = createApiClient({
    baseURL: config.baseURL,
    token: config.token,
    tokenType: config.tokenType,
    tokenPrefix: config.tokenPrefix,
    headers: config.defaultHeaders,
    timeout: config.timeout,
    retries: config.retries,
  });

  return (
    <ApiContext.Provider value={{ config, client }}>
      {children}
    </ApiContext.Provider>
  );
}

export function useApiClient() {
  const context = React.useContext(ApiContext);
  if (!context) {
    throw new Error('useApiClient must be used within ApiProvider');
  }
  return context.client;
}

import React from 'react';