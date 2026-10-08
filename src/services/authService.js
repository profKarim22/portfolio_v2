/**
 * Authentication API Service
 * Login, logout, session verification, password change, and token refresh.
 */
import { request } from './httpClient';
import { setAuthToken, clearAuthToken } from './tokenManager';

export const loginAdmin = async (email, password) => {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const token = result?.data?.token || result?.token;
  if (token) {
    setAuthToken(token);
  }
  return result;
};

export const logoutAdmin = async () => {
  try {
    await request('/auth/logout', { method: 'POST' });
  } catch (err) {
    console.warn('Backend logout notice:', err.message);
  } finally {
    clearAuthToken();
  }
};

export const getMe = () => request('/auth/me');

export const refreshToken = () => request('/auth/refresh', { method: 'POST' });

export const changePassword = (currentPassword, newPassword) =>
  request('/admin/profile/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
