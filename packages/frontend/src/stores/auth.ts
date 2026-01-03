import { reactive, computed, watch } from 'vue';
import { useRouter } from 'vue-router';

// Types
interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  rememberMe: boolean;
  lastActivity: number;
  expiresIn: number;
}

interface LoginResponse {
  token: string;
  refreshToken: string;
  user: AuthUser;
}

// Constants
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
const REMEMBER_ME_DURATION = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const DEFAULT_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Storage keys
const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  USER: 'auth_user',
  REMEMBER_ME: 'auth_remember_me',
  LAST_ACTIVITY: 'auth_last_activity',
  EXPIRES_AT: 'auth_expires_at',
};

// State
const state = reactive<AuthState>({
  token: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  rememberMe: false,
  lastActivity: Date.now(),
  expiresIn: DEFAULT_SESSION_DURATION,
});

// Inactivity timeout timer
let inactivityTimer: number | null = null;
let sessionCheckTimer: number | null = null;

/**
 * Get storage based on remember me preference
 */
function getStorage(): Storage {
  return state.rememberMe ? localStorage : sessionStorage;
}

/**
 * Load auth state from storage
 */
function loadFromStorage(): void {
  const rememberMe = localStorage.getItem(STORAGE_KEYS.REMEMBER_ME) === 'true';
  const storage = rememberMe ? localStorage : sessionStorage;

  const token = storage.getItem(STORAGE_KEYS.TOKEN);
  const refreshToken = storage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  const userStr = storage.getItem(STORAGE_KEYS.USER);
  const lastActivityStr = storage.getItem(STORAGE_KEYS.LAST_ACTIVITY);
  const expiresAtStr = storage.getItem(STORAGE_KEYS.EXPIRES_AT);

  if (token && userStr) {
    state.token = token;
    state.refreshToken = refreshToken;
    state.user = JSON.parse(userStr);
    state.rememberMe = rememberMe;
    state.isAuthenticated = true;
    state.lastActivity = lastActivityStr ? parseInt(lastActivityStr) : Date.now();

    // Calculate expires in
    if (expiresAtStr) {
      const expiresAt = parseInt(expiresAtStr);
      state.expiresIn = Math.max(0, expiresAt - Date.now());
    }

    // Check if session is expired
    if (state.expiresIn <= 0) {
      logout();
      return;
    }

    // Start session monitoring
    startActivityTracking();
    startSessionCheck();
  }
}

/**
 * Save auth state to storage
 */
function saveToStorage(): void {
  const storage = getStorage();

  if (state.token) {
    storage.setItem(STORAGE_KEYS.TOKEN, state.token);
    storage.setItem(STORAGE_KEYS.USER, JSON.stringify(state.user));
    storage.setItem(STORAGE_KEYS.LAST_ACTIVITY, state.lastActivity.toString());
    storage.setItem(STORAGE_KEYS.EXPIRES_AT, (Date.now() + state.expiresIn).toString());

    if (state.refreshToken) {
      storage.setItem(STORAGE_KEYS.REFRESH_TOKEN, state.refreshToken);
    }
  } else {
    // Clear storage
    storage.removeItem(STORAGE_KEYS.TOKEN);
    storage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    storage.removeItem(STORAGE_KEYS.USER);
    storage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
    storage.removeItem(STORAGE_KEYS.EXPIRES_AT);
  }

  // Always store remember me in localStorage
  localStorage.setItem(STORAGE_KEYS.REMEMBER_ME, state.rememberMe.toString());
}

/**
 * Clear auth state from both storage types
 */
function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
  localStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);

  sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  sessionStorage.removeItem(STORAGE_KEYS.USER);
  sessionStorage.removeItem(STORAGE_KEYS.LAST_ACTIVITY);
  sessionStorage.removeItem(STORAGE_KEYS.EXPIRES_AT);
}

/**
 * Update last activity timestamp
 */
function updateActivity(): void {
  state.lastActivity = Date.now();
  saveToStorage();
  resetInactivityTimer();
}

/**
 * Reset inactivity timer
 */
function resetInactivityTimer(): void {
  if (inactivityTimer !== null) {
    clearTimeout(inactivityTimer);
  }

  inactivityTimer = window.setTimeout(() => {
    // If remember me is checked, we don't auto-logout on inactivity
    // Just log a warning
    if (state.rememberMe) {
      console.warn('User inactive for 30 minutes. Session will expire at:', new Date(Date.now() + state.expiresIn));
    } else {
      // Auto logout for regular sessions
      logout();
    }
  }, SESSION_TIMEOUT);
}

/**
 * Start activity tracking
 */
function startActivityTracking(): void {
  // Track user activity events
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

  events.forEach(event => {
    window.addEventListener(event, updateActivity, { passive: true });
  });

  resetInactivityTimer();
}

/**
 * Stop activity tracking
 */
function stopActivityTracking(): void {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

  events.forEach(event => {
    window.removeEventListener(event, updateActivity);
  });

  if (inactivityTimer !== null) {
    clearTimeout(inactivityTimer);
    inactivityTimer = null;
  }

  if (sessionCheckTimer !== null) {
    clearInterval(sessionCheckTimer);
    sessionCheckTimer = null;
  }
}

/**
 * Start session expiration check
 */
function startSessionCheck(): void {
  // Check session expiration every minute
  sessionCheckTimer = window.setInterval(async () => {
    if (state.expiresIn <= 0) {
      logout();
      return;
    }

    // If remember me is checked and we have less than 1 hour left, try to refresh
    if (state.rememberMe && state.expiresIn < 60 * 60 * 1000 && state.refreshToken) {
      try {
        await refreshToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        logout();
      }
    }

    // Update expiresIn
    state.expiresIn -= 60 * 1000;
    saveToStorage();
  }, 60 * 1000);
}

/**
 * Login function
 */
async function login(email: string, password: string, rememberMe: boolean = false): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  const data: LoginResponse = await response.json();

  // Update state
  state.token = data.token;
  state.refreshToken = data.refreshToken;
  state.user = data.user;
  state.isAuthenticated = true;
  state.rememberMe = rememberMe;
  state.lastActivity = Date.now();

  // Set expiration based on remember me
  state.expiresIn = rememberMe ? REMEMBER_ME_DURATION : DEFAULT_SESSION_DURATION;

  // Save to storage
  saveToStorage();

  // Start activity tracking
  startActivityTracking();
  startSessionCheck();

  return data;
}

/**
 * Logout function
 */
async function logout(): Promise<void> {
  try {
    // Call backend logout endpoint if we have a token
    if (state.token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${state.token}`,
          'Content-Type': 'application/json',
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Continue with local logout even if backend call fails
  }

  // Clear state
  state.token = null;
  state.refreshToken = null;
  state.user = null;
  state.isAuthenticated = false;
  state.lastActivity = Date.now();
  state.expiresIn = 0;

  // Clear storage
  clearStorage();

  // Stop activity tracking
  stopActivityTracking();

  // Navigate to login page
  const router = useRouter();
  if (router) {
    router.push('/login');
  }
}

/**
 * Refresh token function
 */
async function refreshToken(): Promise<void> {
  if (!state.refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken: state.refreshToken }),
  });

  if (!response.ok) {
    throw new Error('Token refresh failed');
  }

  const data: LoginResponse = await response.json();

  // Update state
  state.token = data.token;
  state.refreshToken = data.refreshToken;

  // Reset expiration
  state.expiresIn = state.rememberMe ? REMEMBER_ME_DURATION : DEFAULT_SESSION_DURATION;

  // Save to storage
  saveToStorage();
}

/**
 * Check if user is authenticated
 */
function checkAuth(): boolean {
  if (!state.isAuthenticated || !state.token) {
    return false;
  }

  // Check if session is expired
  if (state.expiresIn <= 0) {
    logout();
    return false;
  }

  // Check inactivity timeout (only for non-remember me sessions)
  if (!state.rememberMe) {
    const inactiveTime = Date.now() - state.lastActivity;
    if (inactiveTime > SESSION_TIMEOUT) {
      logout();
      return false;
    }
  }

  return true;
}

/**
 * Get authorization header
 */
function getAuthHeader(): { Authorization: string } | {} {
  if (!state.token) {
    return {};
  }
  return { Authorization: `Bearer ${state.token}` };
}

/**
 * Initialize auth store
 */
function initialize(): void {
  loadFromStorage();

  // Watch for changes and save to storage
  watch(
    () => state,
    () => saveToStorage(),
    { deep: true }
  );
}

// Initialize on import
initialize();

// Export store
export const authStore = {
  state,
  login,
  logout,
  refreshToken,
  checkAuth,
  getAuthHeader,
  updateActivity,
};

// Export as composable
export function useAuth() {
  return {
    ...authStore,
    isAuthenticated: computed(() => state.isAuthenticated),
    user: computed(() => state.user),
    rememberMe: computed(() => state.rememberMe),
    expiresIn: computed(() => state.expiresIn),
    lastActivity: computed(() => state.lastActivity),
  };
}

export default authStore;
