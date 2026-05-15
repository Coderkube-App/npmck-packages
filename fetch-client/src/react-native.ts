// React Native implementation for Universal API Client
import { createApiClient } from './index';
export { createApiClient, api } from './index';
export * from './react';

// Re-export types
export type {
  HttpMethod,
  BodyType,
  RequestConfig,
  ApiResponse,
  ApiError,
  UniversalApiClient,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
} from './index';

// Additional React Native helpers
export interface UseNetworkState {
  isConnected: boolean | null;
}

export async function checkNetworkStatus(): Promise<boolean> {
  // In React Native, you would use @react-native-community/netinfo
  // For now, we return true as a fallback
  return true;
}

export function createRNApiClient(config: import('./index').RequestConfig = {}) {
  return createApiClient({
    timeout: 30000,
    retries: 3,
    retryDelay: 1000,
    ...config,
  });
}