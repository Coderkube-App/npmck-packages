// React Native implementation for Universal API Client
// Uses fetch API (available in React Native)

export { createApiClient, api } from './index';

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

// Additional React Native helpers can be added here
export interface UseNetworkState {
  isConnected: boolean | null;
}

export async function checkNetworkStatus(): Promise<boolean> {
  // In React Native, you would use @react-native-community/netinfo
  // For now, we return true as a fallback
  return true;
}

export function createRNApiClient(config: Parameters<typeof import('./index').createApiClient>[0]) {
  return import('./index').then(({ createApiClient }) =>
    createApiClient({
      timeout: 30000,
      retries: 3,
      retryDelay: 1000,
      ...config,
    })
  );
}