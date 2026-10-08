/**
 * HTTP Request Dispatcher
 * Core fetch wrapper with Authorization header injection, 401 refresh handling, and error mapping.
 * All service modules import `request` from here instead of duplicating fetch logic.
 */
import { getAuthToken, setAuthToken, clearAuthToken } from './tokenManager';

const env = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env : {};
const RAW_API_BASE =
  env.VITE_API_BASE_URL ||
  (env.VITE_API_URL ? `${env.VITE_API_URL}/api/v1` : 'https://portfolio-backend-ashen-eta.vercel.app/api/v1');

// Clean base URLs
export const API_V1_URL = RAW_API_BASE.replace(/\/+$/, '');
export const BASE_URL = API_V1_URL.replace(/\/api\/v1\/?$/, '');

// ── Request Dispatcher with Single 401 Refresh Handling ──
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (token) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody?.error?.message ||
      errorBody?.message ||
      `HTTP ${response.status}: ${response.statusText}`;
    const err = new Error(message);
    err.status = response.status;
    err.code = errorBody?.error?.code || errorBody?.code;
    err.data = errorBody;
    throw err;
  }
  return response.json();
};

export const request = async (endpoint, options = {}, isRetry = false) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_V1_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // AbortController with configurable timeout (default 15s)
  const timeoutMs = options.timeout || 15000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  const config = {
    ...options,
    headers,
    credentials: 'include', // Support HttpOnly secure cookies if configured by backend
    signal: options.signal || controller.signal,
  };
  // Remove non-fetch keys so they don't get passed through
  delete config.timeout;

  try {
    const res = await fetch(url, config);

    // 401 Unauthorized handling (excluding login/refresh endpoints)
    if (res.status === 401 && !isRetry && !url.includes('/auth/login') && !url.includes('/auth/refresh')) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshRes = await fetch(`${API_V1_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
          });

          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            const newToken = refreshData?.data?.token || refreshData?.token;
            if (newToken) {
              setAuthToken(newToken);
              isRefreshing = false;
              onRefreshed(newToken);
              return request(endpoint, options, true);
            }
          }
          // Refresh failed
          clearAuthToken();
          isRefreshing = false;
          window.dispatchEvent(new CustomEvent('auth:expired'));
        } catch {
          clearAuthToken();
          isRefreshing = false;
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
      } else {
        // Wait for active refresh
        return new Promise((resolve, reject) => {
          addRefreshSubscriber((newToken) => {
            if (newToken) {
              resolve(request(endpoint, options, true));
            } else {
              reject(new Error('Session expired. Please log in again.'));
            }
          });
        });
      }
    }

    return handleResponse(res);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const timeoutErr = new Error(`Request to ${endpoint} timed out after ${timeoutMs}ms`);
      timeoutErr.code = 'TIMEOUT';
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
};
