/**
 * Centralized API Barrel Export
 *
 * All service modules re-exported through a single entry point for backward
 * compatibility. Existing `import * as api from '../services/api'` calls
 * continue to work unchanged.
 *
 * For new code, prefer importing from the specific service module:
 *   import { loginAdmin } from '../services/authService';
 *   import { getProjects } from '../services/projectService';
 */

// HTTP client & URL config
export { API_V1_URL, BASE_URL } from './httpClient';

// Token management
export { setAuthToken, getAuthToken, clearAuthToken } from './tokenManager';

// Authentication
export { loginAdmin, logoutAdmin, getMe, refreshToken, changePassword } from './authService';

// Projects
export { getProjects, getProjectById, createProject, updateProject, deleteProject, reorderProjects } from './projectService';

// Portfolio data (profile, skills, status, health, api-endpoints, admin profile)
export { getHealth, getProfile, getSkills, getStatus, getApiEndpoint, updateApiEndpoint, updateStatus, updateAdminProfile } from './portfolioService';
