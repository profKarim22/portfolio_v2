import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaShieldAlt, FaServer, FaEye, FaEyeSlash, FaCheck, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/admin/AdminLayout';
import { API_V1_URL } from '../../services/api';

export default function AdminSettings() {
  const { changePassword, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentPassword) {
      setError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    setIsChanging(true);
    try {
      await changePassword(currentPassword, newPassword);
      showToast('Password changed successfully! Please log in with your new password.', 'success');
      await logout();
      navigate('/admin/login');
    } catch (err) {
      setError(err.message || 'Failed to change password.');
      showToast(err.message || 'Failed to change password.', 'error');
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-heading">Security &amp; System Settings</h2>
          <p className="admin-subheading">
            Manage account security credentials and inspect backend communication parameters.
          </p>
        </div>
      </div>

      <div className="admin-two-col-grid">
        {/* Change Password Card */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Change Password</h3>
          </div>
          <div className="card-body">
            {error && <div className="login-error-banner">{error}</div>}

            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Current Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowCurrent(!showCurrent)}
                  >
                    {showCurrent ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>New Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNew(!showNew)}
                  >
                    {showNew ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  className="btn-primary-action"
                  disabled={isChanging}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {isChanging ? <FaSpinner className="spin-icon" /> : <FaShieldAlt />}
                  <span>{isChanging ? 'Updating Password...' : 'Save New Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Backend & Security Diagnostic */}
        <div className="admin-card">
          <div className="card-header">
            <h3>Backend Diagnostic</h3>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>Target API Base URL:</span>
              <span style={{ fontFamily: 'var(--adm-font-mono)', fontSize: '0.8rem', color: 'var(--adm-accent)' }}>
                {API_V1_URL}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>Security Protocol:</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-secondary)' }}>
                Cross-origin HTTP-only / In-Memory Bearer authentication with automatic single-retry token refresh on 401.
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--adm-text-muted)' }}>Persistence Guarantee:</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--adm-text-secondary)' }}>
                Sensitive credentials are never written to unencrypted browser storage (localStorage).
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
