import React, { useState, useEffect } from 'react';
import {
  FaTerminal,
  FaSave,
  FaCheck,
  FaExclamationTriangle,
  FaCopy,
  FaUndo,
  FaCode,
  FaSpinner,
} from 'react-icons/fa';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/admin/AdminLayout';
import * as api from '../../services/api';

export default function AdminApiConsole() {
  const { portfolioData, updateApiEndpoint, refreshData } = usePortfolio();
  const { showToast } = useToast();

  const ENDPOINT_KEYS = ['profile', 'projects', 'skills', 'status'];
  const [activeKey, setActiveKey] = useState('profile');
  const [jsonText, setJsonText] = useState('');
  const [initialJsonText, setInitialJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Load endpoint data
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setJsonError('');

    const loadData = async () => {
      try {
        const res = await api.getApiEndpoint(activeKey);
        const data = res?.data !== undefined ? res.data : res;
        if (isMounted) {
          const formatted = JSON.stringify(data, null, 2);
          setJsonText(formatted);
          setInitialJsonText(formatted);
        }
      } catch {
        // Fallback to local context
        const local = portfolioData?.apiEndpoints?.[activeKey] || {};
        if (isMounted) {
          const formatted = JSON.stringify(local, null, 2);
          setJsonText(formatted);
          setInitialJsonText(formatted);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [activeKey, portfolioData?.apiEndpoints]);

  const handleJsonChange = (e) => {
    const val = e.target.value;
    setJsonText(val);
    try {
      JSON.parse(val);
      setJsonError('');
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setJsonText(JSON.stringify(parsed, null, 2));
      setJsonError('');
      showToast('Payload formatted with 2-space indentation.');
    } catch (err) {
      setJsonError('Cannot format invalid JSON: ' + err.message);
    }
  };

  const handleReset = () => {
    setJsonText(initialJsonText);
    setJsonError('');
    showToast('Reset to original payload.', 'info');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonText);
    setIsCopied(true);
    showToast('JSON copied to clipboard.');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSave = async () => {
    try {
      const parsed = JSON.parse(jsonText);
      setIsSaving(true);
      await updateApiEndpoint(activeKey, parsed);
      await refreshData();
      setInitialJsonText(jsonText);
      showToast(`API endpoint /api/v1/${activeKey} updated successfully.`);
    } catch (err) {
      setJsonError('Invalid JSON: ' + err.message);
      showToast('Cannot save invalid JSON.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header">
        <div>
          <h2 className="admin-heading">API Console Management</h2>
          <p className="admin-subheading">
            Developer tool to inspect, test, and persist structured JSON payloads served by public REST endpoints.
          </p>
        </div>
      </div>

      <div className="admin-card no-padding">
        {/* Endpoint Selector Tabs */}
        <div className="api-console-tabs-bar">
          {ENDPOINT_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveKey(key)}
              className={`api-console-tab-btn ${activeKey === key ? 'active' : ''}`}
            >
              <span className="method-tag">GET</span>
              <span>/api/v1/{key}</span>
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className="api-console-toolbar">
          <div className="api-toolbar-status">
            {jsonError ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--adm-danger)', fontSize: '0.75rem', fontFamily: 'var(--adm-font-mono)' }}>
                <FaExclamationTriangle />
                <span>Syntax Error: {jsonError}</span>
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--adm-success)', fontSize: '0.75rem', fontFamily: 'var(--adm-font-mono)' }}>
                <FaCheck />
                <span>Valid JSON Contract</span>
              </span>
            )}
          </div>

          <div className="api-toolbar-actions">
            <button
              type="button"
              onClick={handleFormat}
              className="btn-secondary-action"
              title="Format JSON"
              disabled={isLoading || Boolean(jsonError)}
            >
              <FaCode /> <span>Beautify</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="btn-secondary-action"
              title="Copy to clipboard"
              disabled={isLoading}
            >
              <FaCopy /> <span>{isCopied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="btn-secondary-action"
              title="Discard changes"
              disabled={isLoading || jsonText === initialJsonText}
            >
              <FaUndo /> <span>Reset</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="btn-primary-action"
              disabled={isSaving || Boolean(jsonError) || isLoading}
            >
              {isSaving ? <FaSpinner className="spin-icon" /> : <FaSave />}
              <span>{isSaving ? 'Persisting...' : 'Save Endpoint'}</span>
            </button>
          </div>
        </div>

        {/* Editor Area */}
        <div className="api-editor-wrapper" style={{ position: 'relative' }}>
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(7, 9, 14, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--adm-accent)' }}>
                <FaSpinner className="spin-icon" /> <span>Fetching endpoint payload...</span>
              </span>
            </div>
          )}

          <textarea
            value={jsonText}
            onChange={handleJsonChange}
            className="json-editor-textarea"
            spellCheck="false"
            autoCapitalize="off"
            autoComplete="off"
            aria-label="JSON Payload Editor"
          />
        </div>
      </div>
    </div>
  );
}
