import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const location = useLocation();

  if (isBootstrapping) {
    return (
      <div
        className="admin-app-container admin-bootstrapping-screen"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: 'var(--adm-bg, hsl(var(--background)))',
          padding: '24px',
        }}
      >
        <div
          className="neo-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '36px 44px',
            borderRadius: 'var(--radius-card, 10px)',
            border: '3px solid var(--outline, #000000)',
            boxShadow: '6px 6px 0 var(--shadow, #000000)',
            backgroundColor: 'var(--adm-surface, hsl(var(--panel)))',
            textAlign: 'center',
            maxWidth: '380px',
            width: '100%',
          }}
        >
          <div
            className="admin-spinner"
            style={{
              width: '44px',
              height: '44px',
              border: '3.5px solid var(--outline, #000000)',
              borderTopColor: 'hsl(var(--button, 270 85% 68%))',
              borderRadius: '50%',
              animation: 'neoSpin 0.75s linear infinite',
              marginBottom: '20px',
            }}
          />
          <div className="eyebrow-text" style={{ marginBottom: '10px' }}>
            // AUTHORIZATION CHECK
          </div>
          <h3
            style={{
              fontSize: '1.15rem',
              fontWeight: '800',
              margin: '0 0 6px 0',
              color: 'var(--adm-text-primary, hsl(var(--foreground)))',
            }}
          >
            Verifying Session
          </h3>
          <p
            style={{
              fontFamily: 'var(--font-brand, "Fira Code", monospace)',
              fontSize: '0.78rem',
              color: 'var(--adm-text-secondary, hsl(var(--soft-text)))',
              margin: 0,
            }}
          >
            Restoring encrypted token state...
          </p>
          <style>{`
            @keyframes neoSpin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? children : <Outlet />;
}
