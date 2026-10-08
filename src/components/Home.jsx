import React, { useState } from "react";
import Badge3D from "./Badge3D";
import { FaTerminal, FaCopy, FaCheck } from "react-icons/fa";
import { FiArrowUpRight, FiCode, FiDatabase, FiShield } from "react-icons/fi";
import { usePortfolio } from "../context/PortfolioContext";
import highlightJSON from "../utils/highlightJSON";
import "../styles/Home.css";

export default function Home() {
  const [copied, setCopied] = useState(false);
  const [activeSegment, setActiveSegment] = useState("overview");
  const { portfolioData } = usePortfolio();

  const data = portfolioData?.profile || {};

  const profileConsole = {
    engineer: "Karim Abbas",
    standing: "Senior CS Student (HICIS 6th of Oct)",
    focus: "Backend Engineering & API Architecture",
    stack: ["Node.js", "Express.js", "MySQL", "MongoDB", "TypeScript", "Redis"],
    location: "6th of October City, Giza, Egypt",
    status: "Available for Backend Roles & Internships",
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(JSON.stringify(profileConsole, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="hero-section" id="home">
      <div className="container hero-container">
        {/* Left Column: Bio, Content & Terminal */}
        <div className="hero-content-col">
          {/* Pill-Style Segmented Nav sitting above H1 per spec */}
          <div className="segmented-nav hero-nav-pills" role="tablist">
            <button
              onClick={() => setActiveSegment("overview")}
              className={`segmented-nav-btn ${activeSegment === "overview" ? "active" : ""}`}
            >
              <span className="pill-dot">●</span> // OVERVIEW
            </button>
            <button
              onClick={() => setActiveSegment("backend")}
              className={`segmented-nav-btn ${activeSegment === "backend" ? "active" : ""}`}
            >
              BACKEND ARCHITECTURE
            </button>
            <button
              onClick={() => setActiveSegment("education")}
              className={`segmented-nav-btn ${activeSegment === "education" ? "active" : ""}`}
            >
              HICIS 2026
            </button>
          </div>

          {/* Heading Group */}
          <div className="hero-heading-group">
            <h1 className="hero-name">
              Karim <span className="text-purple-accent">Abbas</span>
            </h1>
            <p className="hero-role-eyebrow">
              Backend Developer &amp; Computer Science Senior
            </p>
          </div>

          {/* Lead Paragraph */}
          <p className="lead-p hero-lead">
            Senior Computer Science student at the{" "}
            <strong>Higher Institute of CS &amp; IS, 6th of October City</strong>.
            I focus on architecting resilient server-side services, RESTful API
            contracts, and database-driven solutions with Node.js, Express, MySQL,
            MongoDB, and TypeScript.
          </p>

          {/* Highlights in Tactile Neo-Panels */}
          <div className="hero-highlights-grid">
            <div className="highlight-neo-card neo-panel">
              <div className="highlight-icon-box">
                <FiCode />
              </div>
              <div className="highlight-text-wrap">
                <span className="highlight-tag">EXECUTION</span>
                <strong className="highlight-title">Node.js &amp; Express APIs</strong>
              </div>
            </div>

            <div className="highlight-neo-card neo-panel">
              <div className="highlight-icon-box">
                <FiDatabase />
              </div>
              <div className="highlight-text-wrap">
                <span className="highlight-tag">STORAGE</span>
                <strong className="highlight-title">MySQL &amp; MongoDB</strong>
              </div>
            </div>

            <div className="highlight-neo-card neo-panel">
              <div className="highlight-icon-box">
                <FiShield />
              </div>
              <div className="highlight-text-wrap">
                <span className="highlight-tag">DEFENSE</span>
                <strong className="highlight-title">JWT Auth &amp; Rate Limits</strong>
              </div>
            </div>
          </div>

          {/* Terminal Console */}
          <div className="neo-terminal-panel neo-panel">
            <div className="terminal-topbar">
              <div className="terminal-dots-row">
                <span className="term-dot dot-red" />
                <span className="term-dot dot-yellow" />
                <span className="term-dot dot-green" />
              </div>
              <div className="terminal-title-text">
                <FaTerminal className="term-icon" /> karim@dev ~ %
              </div>
              <button
                onClick={handleCopyProfile}
                className={`terminal-copy-neo-btn ${copied ? "copied" : ""}`}
                title="Copy Profile JSON"
                type="button"
              >
                {copied ? <FaCheck /> : <FaCopy />}
                <span>{copied ? "Copied" : "JSON"}</span>
              </button>
            </div>
            <div className="terminal-code-body">
              <div className="curl-command-line">
                <span className="term-prompt">$</span> curl -s https://karim.dev/api/v1/profile
              </div>
              <pre
                className="terminal-json-output tabular-numbers"
                dangerouslySetInnerHTML={{
                  __html: highlightJSON(profileConsole),
                }}
              />
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="hero-actions-row">
            <a href="#projects" className="neo-button">
              <span>Explore Projects</span>
              <FiArrowUpRight size={18} />
            </a>
            <a href="#terminal" className="muted-button">
              <span>Live API Console</span>
            </a>
            <a href="#contact" className="neo-button-muted">
              <span>Connect</span>
            </a>
          </div>
        </div>

        {/* Right Column: 3D ID Badge Arena */}
        <div className="hero-badge-col">
          {/* Intentional physical mount seamlessly anchoring the wire to the navbar */}
          <div className="lanyard-navbar-mount" aria-hidden="true">
            <div className="mount-bracket">
              <span className="bracket-bolt left" />
              <div className="mount-slot" />
              <span className="bracket-bolt right" />
            </div>
          </div>

          <div className="badge-frame-wrapper">
            <div className="badge-canvas-box">
              <Badge3D />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
