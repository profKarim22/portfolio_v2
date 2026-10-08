import React from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle } from 'react-icons/fa';

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="admin-toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`admin-toast toast-${toast.type}`}>
          {toast.type === 'success' && (
            <FaCheckCircle style={{ color: 'var(--adm-success)' }} />
          )}
          {toast.type === 'error' && (
            <FaExclamationCircle style={{ color: 'var(--adm-danger)' }} />
          )}
          {toast.type === 'info' && (
            <FaInfoCircle style={{ color: 'var(--adm-accent)' }} />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
