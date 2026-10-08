import React, { useState } from "react";
import {
  FaGithub,
  FaExternalLinkAlt,
  FaFigma,
  FaStar,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { FiArrowUpRight, FiLayers } from "react-icons/fi";

/**
 * Reusable Project Card Component:
 * - Automatically provides a consistent, clean layout for existing and future projects.
 * - Controls (left/right navigation arrows, external link button) are cleanly positioned in the TOP-RIGHT corner.
 * - The center of the project image remains visually dominant and completely unobstructed.
 * - Fully responsive across desktop, tablet, and mobile.
 */
export default function ProjectCard({ project, index = 0, posterInfo }) {
  const isFeatured = project.isFeatured ?? project.featured;
  const techList = project.tech || project.techStack || [];
  const githubUrl = project.github || project.githubUrl;
  const demoUrl = project.liveDemo || project.liveUrl;
  const figmaUrl = project.figmaLink || project.figmaUrl;
  const primaryLink = demoUrl || githubUrl || figmaUrl || "#";

  // Multi-image carousel support
  const images = Array.isArray(project.images)
    ? project.images
    : project.image
      ? [project.image]
      : [];
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const hasMultipleImages = images.length > 1;

  const handlePrev = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="neo-card project-neo-card"
      key={project._id || project.id || project.title}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* 16:9 Media / Poster Area */}
      <div
        className="project-poster-area"
        style={{
          background: posterInfo?.gradient || "linear-gradient(135deg, #f3e8ff 0%, #d8b4fe 100%)",
        }}
      >
        {/* Actual Image if provided, or abstract artwork */}
        {images.length > 0 ? (
          <img
            src={images[activeImageIdx]}
            alt={project.title}
            className="project-poster-image"
            loading="lazy"
          />
        ) : (
          <div className="poster-graphic-overlay">
            <span className="poster-tech-watermark">
              {posterInfo?.symbol || "ENGINEERING"}
            </span>
            <div className="poster-abstract-grid" />
          </div>
        )}

        {/* Top-Left: Featured Badge */}
        {isFeatured && (
          <div className="project-featured-badge" aria-label="Featured Project">
            <FaStar size={10} className="featured-badge-star" />
            <span>FEATURED</span>
          </div>
        )}

        {/* TOP-RIGHT CONTROLS CLUSTER: Navigation Arrows & Action Link */}
        <div className="poster-controls-group" aria-label="Project media controls">
          {hasMultipleImages && (
            <>
              <button
                type="button"
                className="poster-ctrl-btn nav-btn"
                onClick={handlePrev}
                title="Previous image"
                aria-label="Previous image"
              >
                <FaChevronLeft size={11} />
              </button>
              <button
                type="button"
                className="poster-ctrl-btn nav-btn"
                onClick={handleNext}
                title="Next image"
                aria-label="Next image"
              >
                <FaChevronRight size={11} />
              </button>
            </>
          )}

          {/* Quick link button to open project */}
          <a
            href={primaryLink}
            target="_blank"
            rel="noopener noreferrer"
            className="poster-ctrl-btn"
            title={`Open ${project.title}`}
            aria-label={`Open ${project.title}`}
          >
            <FiArrowUpRight size={16} />
          </a>
        </div>

        {/* Bottom-Right: Duration / Category Chip */}
        <div className="poster-corner-chip">
          {posterInfo?.duration || project.domain || "Verified"}
        </div>
      </div>

      {/* Card Body */}
      <div className="project-body-content">
        {/* Card Title */}
        <div className="project-title-row">
          <span className="project-category-prefix">
            {project.domain || posterInfo?.category || "Backend"} /
          </span>
          <h3 className="project-headline">
            <strong>{posterInfo?.keyWord || project.title}</strong>
          </h3>
        </div>

        {/* 2-Line Clamped Description */}
        <p className="project-clamped-desc" title={project.description}>
          {project.description}
        </p>

        {/* Meta Row with Line Icons */}
        <div className="project-meta-row tabular-numbers">
          {project.metrics && project.metrics.length > 0 ? (
            project.metrics.slice(0, 2).map((m, i) => (
              <span key={i} className="project-meta-item">
                <FiLayers size={12} className="meta-icon" />
                <strong>{m.value}</strong> {m.label}
              </span>
            ))
          ) : (
            <span className="project-meta-item">
              <FiLayers size={12} className="meta-icon" />
              Backend Architecture
            </span>
          )}
        </div>

        {/* Highlights Checklist */}
        {project.highlights && project.highlights.length > 0 && (
          <div className="project-highlights-box">
            {project.highlights.slice(0, 2).map((h, i) => (
              <div key={i} className="project-highlight-bullet">
                <FaCheck className="highlight-check-icon" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tech Tags Matrix */}
        <div className="project-tech-chips">
          {techList.slice(0, 5).map((t, i) => (
            <span className="tech-badge-pill" key={i}>
              {t}
            </span>
          ))}
          {techList.length > 5 && (
            <span className="tech-badge-more">+{techList.length - 5}</span>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="project-actions-row">
          {githubUrl && (
            <a
              href={githubUrl}
              className="neo-button project-btn-action"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={15} />
              <span>Code</span>
            </a>
          )}

          {demoUrl && (
            <a
              href={demoUrl}
              className="muted-button project-btn-action"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaExternalLinkAlt size={13} />
              <span>Live Demo</span>
            </a>
          )}

          {figmaUrl && (
            <a
              href={figmaUrl}
              className="muted-button project-btn-action"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFigma size={14} />
              <span>Figma</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
