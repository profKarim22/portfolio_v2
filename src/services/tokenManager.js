/**
 * Authentication Service
 * Handles token management, login, logout, and session verification.
 */

// ── In-Memory & Session Token Handling (No long-lived secrets in localStorage) ──
let memoryToken = null;

export const setAuthToken = (token) => {
  memoryToken = token || null;
  if (token) {
    try {
      sessionStorage.setItem('adm_token', token);
    } catch {
      // Ignore storage restrictions
    }
  } else {
    try {
      sessionStorage.removeItem('adm_token');
    } catch {
      // Ignore
    }
  }
};

export const getAuthToken = () => {
  if (memoryToken) return memoryToken;
  try {
    const stored = sessionStorage.getItem('adm_token');
    if (stored) {
      memoryToken = stored;
      return stored;
    }
  } catch {
    // Ignore
  }
  return null;
};

export const clearAuthToken = () => {
  setAuthToken(null);
};
