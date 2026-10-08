import React, { useState } from 'react';
import { FaUserShield, FaCheckCircle, FaSave, FaSpinner, FaIdBadge, FaServer, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/admin/AdminLayout';
import * as api from '../../services/api';

export default function AdminProfile() {
  const { user } = useAuth();
  const { portfolioData, refreshData } = usePortfolio();
  const { showToast } = useToast();

  const profile = portfolioData?.profile || {};
  const [engineer, setEngineer] = useState(profile.engineer || profile.name || '');
  const [role, setRole] = useState(profile.role || profile.title || '');
  const [standing, setStanding] = useState(profile.standing || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.updateAdminProfile({
        name: engineer,
        title: role,
        standing,
      });
      await refreshData();
      showToast('Profile attributes updated successfully.');
    } catch (err) {
      showToast(err.message || 'Failed to update profile.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-heading">Administrator Profile &amp; Session</h2>
          <p className="admin-subheading">
            Authenticated administrator identity and public engineer identity attributes.
          </p>
        </div>
      </div>

      <div className="admin-two-col-grid">
        {/* Session Security Identity Card */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Authentication Identity</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: 'var(--adm-bg)',
                borderRadius: 'var(--adm-radius-md)',
                border: '1px solid var(--adm-border-subtle)',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  background: 'var(--adm-accent-subtle)',
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                  color: 'var(--adm-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                }}
              >
                <FaUserShield />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--adm-text-primary)' }}>
                  {user?.email || 'Administrator'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <span
                    style={{
                      fontFamily: 'var(--adm-font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--adm-accent)',
                      background: 'var(--adm-accent-subtle)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                    }}
                  >
                    ROLE: {user?.role?.toUpperCase() || 'ADMIN'}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--adm-font-mono)',
                      fontSize: '0.68rem',
                      color: 'var(--adm-success)',
                      background: 'var(--adm-success-subtle)',
                      padding: '0.1rem 0.4rem',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <FaCheckCircle style={{ fontSize: '0.6rem' }} /> ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Telemetry specs list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div className="profile-spec-row">
                <span className="profile-spec-label">
                  <FaIdBadge /> Admin Identifier:
                </span>
                <span className="profile-spec-val mono">
                  {user?.id || 'Primary Root Admin'}
                </span>
              </div>

              <div className="profile-spec-row">
                <span className="profile-spec-label">
                  <FaServer /> Session Authority:
                </span>
                <span className="profile-spec-val">
                  Vercel Serverless REST Backend
                </span>
              </div>

              <div className="profile-spec-row">
                <span className="profile-spec-label">
                  <FaLock /> Token Management:
                </span>
                <span className="profile-spec-val sub">
                  In-Memory Bearer (Never in localStorage)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Public Profile Attributes Card */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Public Profile Sync</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Engineer Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={engineer}
                  onChange={(e) => setEngineer(e.target.value)}
                  placeholder="e.g. Karim Abbas Elashiry"
                />
              </div>

              <div className="form-group">
                <label>Primary Role Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Backend Developer & Computer Science Senior"
                />
              </div>

              <div className="form-group">
                <label>Academic Standing</label>
                <input
                  type="text"
                  className="form-input"
                  value={standing}
                  onChange={(e) => setStanding(e.target.value)}
                  placeholder="e.g. Level 04 CS Senior (HICIS 6th of Oct)"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-primary-action"
                  disabled={isSaving}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {isSaving ? <FaSpinner className="spin-icon" /> : <FaSave />}
                  <span>{isSaving ? 'Updating...' : 'Update Public Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
