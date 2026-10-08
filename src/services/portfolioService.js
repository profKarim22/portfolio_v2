/**
 * Portfolio Data API Service
 * Profile, skills, status, API endpoint, and health operations.
 */
import { request } from './httpClient';
import { BASE_URL } from './httpClient';

// ── Health & Diagnostics ──
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const message =
      errorBody?.error?.message ||
      errorBody?.message ||
      `HTTP ${response.status}: ${response.statusText}`;
    const err = new Error(message);
    err.status = response.status;
    throw err;
  }
  return response.json();
};

export const getHealth = () =>
  fetch(`${BASE_URL}/api/health`, { credentials: 'include' }).then(handleResponse);

// ── Public Endpoints ──
export const getProfile = () => request('/profile');
export const getSkills = () => request('/skills');
export const getStatus = () => request('/status');
export const getApiEndpoint = (key) => request(`/api-endpoints/${key}`);

// ── Admin Protected Endpoints ──
export const updateApiEndpoint = (key, data) =>
  request(`/admin/api-endpoints/${key}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const updateStatus = (data) => {
  const payload = typeof data === 'string' ? { mode: data } : data;
  return request('/admin/status', {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const updateAdminProfile = (data) =>
  request('/admin/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
