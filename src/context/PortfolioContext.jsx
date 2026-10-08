import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import * as api from "../services/api";
import defaultData from "../data/defaultProjects.json";
import { normalizeProject, normalizeProjects } from "../utils/dataProjections";

const PortfolioContext = createContext();

/**
 * Merges projects from the live API with the configured project catalog.
 * - Live API projects take precedence as the source of truth for updated values and sorting.
 * - Configured projects not yet present in the remote backend are seamlessly retained.
 * - If new projects are added dynamically in the backend (e.g. via dashboard), they are included.
 */
function reconcileProjects(apiList, defaultList) {
  const normalizedApi = Array.isArray(apiList) ? apiList : [];
  const normalizedDefault = Array.isArray(defaultList) ? defaultList : [];

  if (normalizedApi.length === 0) {
    return normalizedDefault;
  }

  // Set of identifiers in the API response
  const apiIdSet = new Set(
    normalizedApi
      .map((p) => String(p?.id || p?._id || p?.title || "").toLowerCase().trim())
      .filter(Boolean)
  );

  const merged = [...normalizedApi];

  // Append any default configured project not yet present in the API response
  for (const defProj of normalizedDefault) {
    const defId = String(defProj?.id || defProj?._id || defProj?.title || "").toLowerCase().trim();
    if (defId && !apiIdSet.has(defId)) {
      merged.push(defProj);
    }
  }

  return merged;
}

export function PortfolioProvider({ children }) {
  const [portfolioData, setPortfolioData] = useState({
    profile: defaultData.apiEndpoints?.profile || null,
    projects: normalizeProjects(defaultData.projects || []),
    skills: defaultData.apiEndpoints?.skills || null,
    statusConfig: defaultData.statusConfig || { mode: "available", modes: {} },
    apiEndpoints: defaultData.apiEndpoints || {},
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  // Fetch initial data from backend
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [healthRes, profileRes, projectsRes, skillsRes, statusRes] =
        await Promise.all([
          api.getHealth().catch((err) => {
            console.warn("Backend health check:", err.message);
            return null;
          }),
          api.getProfile().catch((err) => {
            console.warn("API /profile fetch failed:", err.message);
            return null;
          }),
          api.getProjects().catch((err) => {
            console.warn("API /projects fetch failed:", err.message);
            return null;
          }),
          api.getSkills().catch((err) => {
            console.warn("API /skills fetch failed:", err.message);
            return null;
          }),
          api.getStatus().catch((err) => {
            console.warn("API /status fetch failed:", err.message);
            return null;
          }),
        ]);

      // Extract data safely per backend contract: { success: true, data: ... }
      const apiProjects = projectsRes?.data !== undefined ? projectsRes.data : projectsRes;
      const apiProfile = profileRes?.data !== undefined ? profileRes.data : profileRes;
      const apiSkills = skillsRes?.data !== undefined ? skillsRes.data : skillsRes;
      const apiStatus = statusRes?.data !== undefined ? statusRes.data : statusRes;

      // Primary source is backend; seamlessly reconciled with configured projects so none are dropped
      const finalProjects = reconcileProjects(apiProjects, defaultData.projects);

      const finalProfile =
        apiProfile && typeof apiProfile === "object" && Object.keys(apiProfile).length > 0
          ? apiProfile
          : defaultData.apiEndpoints.profile;

      const finalSkills =
        apiSkills && typeof apiSkills === "object" && Object.keys(apiSkills).length > 0
          ? apiSkills
          : defaultData.apiEndpoints.skills;

      const finalStatus =
        apiStatus && typeof apiStatus === "object" && Object.keys(apiStatus).length > 0
          ? apiStatus
          : defaultData.statusConfig;

      setPortfolioData({
        profile: finalProfile,
        projects: normalizeProjects(finalProjects),
        skills: finalSkills,
        statusConfig: finalStatus,
        apiEndpoints: defaultData.apiEndpoints || {},
      });
      setError(null);
    } catch (err) {
      console.error("Failed to load portfolio data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // ── Project Actions (Optimistic UI + API call) ──
  const updateProjects = useCallback((newProjects) => {
    setPortfolioData((prev) => ({ ...prev, projects: normalizeProjects(newProjects) }));
  }, []);

  const addProject = useCallback(async (project) => {
    try {
      const result = await api.createProject(project);
      const newProject = normalizeProject(result.data || result);
      setPortfolioData((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject],
      }));
    } catch (err) {
      console.error("Failed to add project:", err);
      throw err;
    }
  }, []);

  const editProject = useCallback(async (projectId, updatedProject) => {
    try {
      const result = await api.updateProject(projectId, updatedProject);
      const savedProject = normalizeProject(result.data || result);
      setPortfolioData((prev) => ({
        ...prev,
        projects: prev.projects.map((p) =>
          p._id === projectId || p.id === projectId ? savedProject : p,
        ),
      }));
    } catch (err) {
      console.error("Failed to update project:", err);
      throw err;
    }
  }, []);

  const deleteProject = useCallback(async (projectId) => {
    try {
      await api.deleteProject(projectId);
      setPortfolioData((prev) => ({
        ...prev,
        projects: prev.projects.filter(
          (p) => p._id !== projectId && p.id !== projectId,
        ),
      }));
    } catch (err) {
      console.error("Failed to delete project:", err);
      throw err;
    }
  }, []);

  const reorderProject = useCallback(async (index, direction) => {
    setPortfolioData((prev) => {
      const projects = [...prev.projects];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= projects.length) return prev;
      [projects[index], projects[newIndex]] = [
        projects[newIndex],
        projects[index],
      ];

      // Sync reorder to backend
      api
        .reorderProjects(projects.map((p) => p.id || p._id))
        .catch((err) => console.error("Failed to sync reorder", err));

      return { ...prev, projects };
    });
  }, []);

  // ── API Endpoints (Admin specific) ──
  const updateApiEndpoint = useCallback(async (key, data) => {
    try {
      await api.updateApiEndpoint(key, data);
      setPortfolioData((prev) => ({
        ...prev,
        apiEndpoints: { ...prev.apiEndpoints, [key]: data },
      }));
    } catch (err) {
      console.error("Failed to update api endpoint:", err);
      throw err;
    }
  }, []);

  // ── Status ──
  const updateStatus = useCallback(async (statusData) => {
    try {
      const payload = typeof statusData === 'string' ? { mode: statusData } : statusData;
      const result = await api.updateStatus(payload);
      setPortfolioData((prev) => ({
        ...prev,
        statusConfig: result.data || result,
      }));
    } catch (err) {
      console.error("Failed to update status:", err);
      throw err;
    }
  }, []);

  // ── Reset/Export (Admin features) ──
  const resetToDefault = useCallback(() => {
    // With a real backend, reset might mean re-seeding the DB.
    // For now, just refetch from backend.
    fetchAllData();
  }, [fetchAllData]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(portfolioData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "portfolio-data-export.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [portfolioData]);

  return (
    <PortfolioContext.Provider
      value={{
        portfolioData,
        loading,
        error,
        refreshData: fetchAllData,
        updateProjects,
        addProject,
        editProject,
        deleteProject,
        reorderProject,
        updateApiEndpoint,
        updateStatus,
        resetToDefault,
        exportData,

      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
