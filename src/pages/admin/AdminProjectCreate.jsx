import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import ProjectForm from '../../components/admin/ProjectForm';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/admin/AdminLayout';

export default function AdminProjectCreate() {
  const navigate = useNavigate();
  const { addProject, refreshData } = usePortfolio();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (projectData) => {
    setIsLoading(true);
    try {
      await addProject(projectData);
      await refreshData();
      showToast('Project published successfully!');
      navigate('/admin/projects');
    } catch (err) {
      showToast(err.message || 'Failed to publish project.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <Link to="/admin/projects" className="btn-back-breadcrumb">
            <FaArrowLeft /> <span>Back to Projects</span>
          </Link>
          <h2 className="admin-heading mt-2">New Engineering Project</h2>
          <p className="admin-subheading">
            Create and publish a verified project directly to the MongoDB production database.
          </p>
        </div>
      </div>

      <ProjectForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
