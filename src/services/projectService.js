/**
 * Project API Service
 * Public and admin CRUD operations for portfolio projects.
 */
import { request } from './httpClient';

// ── Public Endpoints ──
export const getProjects = () => request('/projects');
export const getProjectById = (id) => request(`/projects/${id}`);

// ── Admin Protected Endpoints ──
export const createProject = (data) =>
  request('/admin/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });

export const updateProject = (id, data) =>
  request(`/admin/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });

export const deleteProject = (id) =>
  request(`/admin/projects/${id}`, {
    method: 'DELETE',
  });

export const reorderProjects = (orderedIds) =>
  request('/admin/projects/reorder', {
    method: 'PATCH',
    body: JSON.stringify({ orderedIds, projectIds: orderedIds }),
  });
