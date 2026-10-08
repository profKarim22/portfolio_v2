import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes, FaPlus, FaTrash, FaCheck, FaSpinner } from 'react-icons/fa';
import { useProjectForm } from '../../hooks/useProjectForm';

export default function ProjectForm({ initialData, onSubmit, isLoading }) {
  const navigate = useNavigate();

  const {
    form,
    techInput,
    setTechInput,
    error,
    updateField,
    addMetric,
    updateMetric,
    removeMetric,
    addHighlight,
    updateHighlight,
    removeHighlight,
    handleAddTech,
    removeTech,
    handleSubmit,
  } = useProjectForm(initialData, onSubmit);
  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {error && (
        <div className="login-error-banner" role="alert">
          {error}
        </div>
      )}

      {/* Section 1: Core Information */}
      <div className="admin-form-section">
        <div className="form-section-header">
          <h3>Core Identity & Presentation</h3>
          <p>Title, classification domain, and presentation labels</p>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label>Project Title *</label>
            <input
              type="text"
              className="form-input"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. Distributed Task Queue & Worker System"
              required
            />
          </div>

          <div className="form-group">
            <label>Custom Slug (Optional)</label>
            <input
              type="text"
              className="form-input"
              value={form.id}
              onChange={(e) => updateField('id', e.target.value)}
              placeholder="e.g. distributed-task-queue"
            />
          </div>

          <div className="form-group">
            <label>Domain Area</label>
            <input
              type="text"
              className="form-input"
              value={form.domain}
              onChange={(e) => updateField('domain', e.target.value)}
              placeholder="e.g. Distributed Systems & Microservices"
            />
          </div>

          <div className="form-group">
            <label>Badge Label</label>
            <input
              type="text"
              className="form-input"
              value={form.badge}
              onChange={(e) => updateField('badge', e.target.value)}
              placeholder="e.g. Production Architecture"
            />
          </div>

          <div className="form-group">
            <label>Domain Accent Color</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <input
                type="color"
                value={form.domainColor}
                onChange={(e) => updateField('domainColor', e.target.value)}
                style={{
                  width: '36px',
                  height: '36px',
                  border: 'none',
                  borderRadius: 'var(--adm-radius-sm)',
                  cursor: 'pointer',
                  background: 'transparent',
                }}
              />
              <input
                type="text"
                className="form-input"
                value={form.domainColor}
                onChange={(e) => updateField('domainColor', e.target.value)}
                placeholder="#38bdf8"
                style={{ flex: 1, fontFamily: 'var(--adm-font-mono)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ justifyContent: 'center' }}>
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                cursor: 'pointer',
                marginTop: '1rem',
                color: 'var(--adm-text-primary)',
              }}
            >
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--adm-accent)' }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Feature on Public Homepage</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Project Description *</label>
          <textarea
            className="form-textarea"
            rows="4"
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Comprehensive description of the architectural design, features, and engineering accomplishments..."
            required
          />
        </div>
      </div>

      {/* Section 2: External Links */}
      <div className="admin-form-section">
        <div className="form-section-header">
          <h3>External Links & Repositories</h3>
          <p>Repository and live deployment addresses for public viewers</p>
        </div>

        <div className="form-grid-2">
          <div className="form-group">
            <label>GitHub Repository URL</label>
            <input
              type="url"
              className="form-input"
              value={form.github}
              onChange={(e) => updateField('github', e.target.value)}
              placeholder="https://github.com/..."
            />
          </div>

          <div className="form-group">
            <label>Live Demo URL</label>
            <input
              type="url"
              className="form-input"
              value={form.liveDemo}
              onChange={(e) => updateField('liveDemo', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Section 3: Performance Metrics */}
      <div className="admin-form-section">
        <div className="form-section-header">
          <h3>Key Quantitative Metrics</h3>
          <p>Engineering throughput, latency, or scale indicators</p>
        </div>

        <div className="form-metrics-container">
          {form.metrics.map((metric, idx) => (
            <div key={idx} className="metric-row-item">
              <input
                type="text"
                className="form-input metric-label-input"
                value={metric.label}
                onChange={(e) => updateMetric(idx, 'label', e.target.value)}
                placeholder="Metric Label (e.g. Throughput)"
              />
              <input
                type="text"
                className="form-input metric-value-input"
                style={{ fontFamily: 'var(--adm-font-mono)' }}
                value={metric.value}
                onChange={(e) => updateMetric(idx, 'value', e.target.value)}
                placeholder="Value (e.g. 5,000 Req/s)"
              />
              <button
                type="button"
                onClick={() => removeMetric(idx)}
                className="btn-table-action delete btn-metric-delete"
                title="Remove metric"
                aria-label="Remove metric"
                disabled={form.metrics.length <= 1}
                style={{ opacity: form.metrics.length <= 1 ? 0.3 : 1 }}
              >
                <FaTrash />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addMetric}
            className="btn-secondary-action btn-add-field"
          >
            <FaPlus /> <span>Add Metric Field</span>
          </button>
        </div>
      </div>

      {/* Section 4: Highlights & Tech Stack */}
      <div className="admin-form-section">
        <div className="form-section-header">
          <h3>Technical Architecture & Highlights</h3>
          <p>Key architectural decisions, bullet highlights, and technology tags</p>
        </div>

        <div className="form-group">
          <label>Highlights List</label>
          <div className="form-highlights-container">
            {form.highlights.map((highlight, idx) => (
              <div key={idx} className="highlight-row-item">
                <input
                  type="text"
                  className="form-input highlight-input"
                  value={highlight}
                  onChange={(e) => updateHighlight(idx, e.target.value)}
                  placeholder="e.g. Real-time digital canvas rendering at locked 60 FPS"
                />
                <button
                  type="button"
                  onClick={() => removeHighlight(idx)}
                  className="btn-table-action delete btn-highlight-delete"
                  title="Remove highlight"
                  aria-label="Remove highlight"
                  disabled={form.highlights.length <= 1}
                  style={{ opacity: form.highlights.length <= 1 ? 0.3 : 1 }}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addHighlight}
              className="btn-secondary-action btn-add-field"
            >
              <FaPlus /> <span>Add Highlight</span>
            </button>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: '0.75rem' }}>
          <label>Technologies Used</label>
          <div className="tech-input-group">
            <input
              type="text"
              className="form-input tech-text-input"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Type technology (e.g. TypeScript) and press Add"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTech(e);
                }
              }}
            />
            <button type="button" onClick={handleAddTech} className="btn-secondary-action btn-add-tag">
              <FaPlus /> <span>Add Tag</span>
            </button>
          </div>

          <div className="tech-tags-list">
            {form.tech.map((tag) => (
              <span key={tag} className="tech-tag-badge">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTech(tag)}
                  className="btn-remove-tag"
                  aria-label={`Remove ${tag}`}
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="form-actions-bar">
        <button
          type="button"
          onClick={() => navigate('/admin/projects')}
          className="btn-secondary-action"
          disabled={isLoading}
        >
          <FaTimes /> <span>Cancel</span>
        </button>

        <button
          type="submit"
          className="btn-primary-action"
          disabled={isLoading}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {isLoading ? <FaSpinner className="spin-icon" /> : <FaSave />}
          <span>{isLoading ? 'Persisting to Database...' : 'Save Project Document'}</span>
        </button>
      </div>
    </form>
  );
}
