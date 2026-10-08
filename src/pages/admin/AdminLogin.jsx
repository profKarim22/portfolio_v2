import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin/index.css';

export default function AdminLogin() {
  const { login, isAuthenticated, isBootstrapping, isLoading, authError, setAuthError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState('');

  // Target destination after login
  const from = location.state?.from?.pathname || '/admin/dashboard';

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isBootstrapping, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setLocalError('Please enter your admin email.');
      return;
    }
    if (!password) {
      setLocalError('Please enter your admin password.');
      return;
    }

    try {
      await login(cleanEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || 'Invalid credentials or server unavailable.');
    }
  };

  if (isBootstrapping) {
    return null; // Prevent flash
  }

  const displayedError = localError || authError;

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Top Controls: Back to Site */}
        <div className="login-top-bar">
          <Link to="/" className="btn-back-to-site">
            <FaArrowLeft /> <span>Back to Portfolio</span>
          </Link>
        </div>

        {/* Card Header */}
        <div className="login-card-header">
          <div className="login-shield-icon">
            <FaShieldAlt />
          </div>
          <span className="login-pre-badge">// RESTRICTED AREA</span>
          <h2 className="login-title">Admin Authentication</h2>
          <p className="login-subtitle">
            Sign in to access the production management control panel.
          </p>
        </div>

        {/* Error Alert */}
        {displayedError && (
          <div className="login-error-banner" role="alert">
            <span>{displayedError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="admin-email">Admin Email</label>
            <div className="input-with-icon">
              <FaEnvelope className="input-icon" />
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                required
                autoComplete="email"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="admin-password">Password</label>
            <div className="input-with-icon">
              <FaLock className="input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <span>Sign In to Control Center</span>
            )}
          </button>
        </form>

        <div className="login-footer">
          <span>Protected by JWT &amp; HTTP-only Session Infrastructure</span>
        </div>
      </div>
    </div>
  );
}
