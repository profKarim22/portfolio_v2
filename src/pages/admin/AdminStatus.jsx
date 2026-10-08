import React, { useState } from 'react';
import { FaToggleOn, FaCheckCircle, FaSpinner, FaEye } from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/admin/AdminLayout';

export default function AdminStatus() {
  const { portfolioData, updateStatus, refreshData } = usePortfolio();
  const { showToast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const statusConfig = portfolioData?.statusConfig || {
    mode: 'available',
    modes: {
      available: {
        label: 'Open for Opportunities',
        color: '#10b981',
        borderColor: 'rgba(16, 185, 129, 0.35)',
        bgColor: 'rgba(16, 185, 129, 0.08)',
        description: 'Displayed across public hero and terminal. Indicates immediate availability for engineering roles.',
      },
      committed: {
        label: 'Committed to Contract',
        color: '#f59e0b',
        borderColor: 'rgba(245, 158, 11, 0.35)',
        bgColor: 'rgba(245, 158, 11, 0.08)',
        description: 'Indicates active engineering engagements. Available only for high-leverage architectural advisory.',
      },
      offgrid: {
        label: 'Off-Grid // Deep Architecture',
        color: '#f43f5e',
        borderColor: 'rgba(244, 63, 94, 0.35)',
        bgColor: 'rgba(244, 63, 94, 0.08)',
        description: 'Deep focus mode on proprietary systems and research. Not accepting new client proposals.',
      },
    },
  };

  const currentMode = statusConfig.mode || 'available';
  const activeConfig = statusConfig.modes?.[currentMode] || {
    label: currentMode.toUpperCase(),
    color: '#10b981',
  };

  const handleModeSelect = async (modeKey) => {
    if (modeKey === currentMode || isUpdating) return;

    setIsUpdating(true);
    try {
      await updateStatus(modeKey);
      await refreshData();
      showToast(`Status updated to "${statusConfig.modes[modeKey]?.label || modeKey}".`);
    } catch (err) {
      showToast(err.message || 'Failed to update status.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-heading">Portfolio Availability Status</h2>
          <p className="admin-subheading">
            Controls the real-time availability indicator shown on the public site and terminal.
          </p>
        </div>
      </div>

      {/* Live Preview Box */}
      <div className="admin-card">
        <div className="card-header">
          <h3>Public Presentation Preview</h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>
            Live component preview
          </span>
        </div>
        <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--adm-text-secondary)', marginBottom: '0.35rem' }}>
              How visitors and hiring managers see your availability:
            </div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--adm-radius-sm)',
                border: `1px solid ${activeConfig.borderColor || activeConfig.color}`,
                background: activeConfig.bgColor || 'rgba(16, 185, 129, 0.08)',
                color: activeConfig.color,
                fontFamily: 'var(--adm-font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: activeConfig.color,
                  boxShadow: `0 0 8px ${activeConfig.color}`,
                }}
              />
              <span>{activeConfig.label}</span>
            </div>
          </div>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary-action"
          >
            <FaEye /> <span>Inspect Live Portfolio</span>
          </a>
        </div>
      </div>

      {/* Mode Selectors */}
      <div className="admin-card">
        <div className="card-header">
          <h3>Select Operational Mode</h3>
          {isUpdating && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--adm-accent)', fontSize: '0.78rem' }}>
              <FaSpinner className="spin-icon" /> <span>Syncing with server...</span>
            </span>
          )}
        </div>

        <div className="card-body">
          <div className="status-mode-cards-grid">
            {Object.entries(statusConfig.modes || {}).map(([key, cfg]) => {
              const isActive = currentMode === key;
              return (
                <div
                  key={key}
                  onClick={() => handleModeSelect(key)}
                  className={`status-selectable-card ${isActive ? 'active' : ''}`}
                  style={{
                    '--card-color': cfg.color,
                    '--card-border': cfg.borderColor || cfg.color,
                    '--card-bg': cfg.bgColor || 'rgba(255, 255, 255, 0.03)',
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleModeSelect(key);
                    }
                  }}
                >
                  <div className="card-top-row">
                    <span className="status-dot-indicator" style={{ backgroundColor: cfg.color }} />
                    <span className="status-key-label">{key.toUpperCase()}</span>
                    {isActive && <FaCheckCircle className="check-icon" />}
                  </div>

                  <div className="card-mid-row">
                    <h4>{cfg.label}</h4>
                    <p>{cfg.description || 'Public availability profile setting.'}</p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--adm-border-subtle)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--adm-font-mono)', fontSize: '0.72rem', color: isActive ? 'var(--adm-text-primary)' : 'var(--adm-text-muted)' }}>
                      {isActive ? '● Currently Active' : 'Click to Activate'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
