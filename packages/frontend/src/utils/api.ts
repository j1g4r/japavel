import { useAuth } from '../stores/auth';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Request options interface
interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  skipAuth?: boolean;
}

// Build URL with query parameters
function buildUrl(endpoint: string, params?: Record<string, string>): string {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  if (!params) {
    return url;
  }

  const queryString = new URLSearchParams(params).toString();
  return queryString ? `${url}?${queryString}` : url;
}

// Main API function
async function api<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const auth = useAuth();
  const {
    method = 'GET',
    headers = {},
    body,
    params,
    skipAuth = false,
  } = options;

  // Prepare request headers
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // Add authorization header if not skipped
  if (!skipAuth) {
    const authHeader = auth.getAuthHeader();
    Object.assign(requestHeaders, authHeader);
  }

  // Prepare request config
  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  // Add body if present
  if (body && method !== 'GET') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  // Make the request
  const url = buildUrl(endpoint, params);
  const response = await fetch(url, config);

  // Handle non-OK responses
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: response.statusText };
    }

    // Handle 401 Unauthorized - token might be expired
    if (response.status === 401 && !skipAuth) {
      // Try to refresh token
      try {
        await auth.refreshToken();
        // Retry the request with new token
        return api<T>(endpoint, { ...options, skipAuth: false });
      } catch {
        // Refresh failed, logout user
        await auth.logout();
        throw new ApiError(
          'Session expired. Please log in again.',
          response.status,
          errorData
        );
      }
    }

    throw new ApiError(
      errorData.error || errorData.message || 'API request failed',
      response.status,
      errorData
    );
  }

  // Handle no content response
  if (response.status === 204) {
    return undefined as T;
  }

  // Parse and return response
  try {
    return await response.json();
  } catch {
    return undefined as T;
  }
}

// Convenience methods
export const apiClient = {
  get: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    api<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    api<T>(endpoint, { ...options, method: 'POST', body: data }),

  put: <T = any>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    api<T>(endpoint, { ...options, method: 'PUT', body: data }),

  patch: <T = any>(endpoint: string, data?: any, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    api<T>(endpoint, { ...options, method: 'PATCH', body: data }),

  delete: <T = any>(endpoint: string, options?: Omit<RequestOptions, 'method'>) =>
    api<T>(endpoint, { ...options, method: 'DELETE' }),
};

// Export default
export default apiClient;
