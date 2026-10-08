import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ProjectForm from '../../components/admin/ProjectForm';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/admin/AdminLayout';
import * as api from '../../services/api';

export default function AdminProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { portfolioData, editProject, refreshData } = usePortfolio();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // First attempt to locate in loaded context
    const existing = (portfolioData?.projects || []).find(
      (p) => (p._id && p._id === id) || (p.id && p.id === id),
    );

    if (existing) {
      setProject(existing);
      setIsFetching(false);
      return;
    }

    // Fallback: fetch from API
    api
      .getProjectById(id)
      .then((res) => {
        if (isMounted) {
          const loaded = res?.data || res;
          setProject(loaded);
        }
      })
      .catch((err) => {
        if (isMounted) {
          showToast(err.message || 'Project not found.', 'error');
        }
      })
      .finally(() => {
        if (isMounted) setIsFetching(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id, portfolioData?.projects, showToast]);

  const handleSubmit = async (updatedData) => {
    setIsSaving(true);
    try {
      const projectId = project?._id || project?.id || id;
      await editProject(projectId, updatedData);
      await refreshData();
      showToast('Project updated successfully!');
      navigate('/admin/projects');
    } catch (err) {
      showToast(err.message || 'Failed to update project.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isFetching) {
    return (
      <div className="admin-page-container">
        <div className="empty-state-box">
          <p>Loading project details from backend...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="admin-page-container">
        <div className="empty-state-box">
          <p>Project not found.</p>
          <Link to="/admin/projects" className="btn-primary-action mt-3 inline-block">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <Link to="/admin/projects" className="btn-back-breadcrumb">
            <FaArrowLeft /> <span>Back to Projects</span>
          </Link>
          <h2 className="admin-heading mt-2">Edit Project: {project.title}</h2>
          <p className="admin-subheading">
            Modify specifications, metrics, highlights, and links in MongoDB.
          </p>
        </div>
      </div>

      <ProjectForm initialData={project} onSubmit={handleSubmit} isLoading={isSaving} />
    </div>
  );
}
