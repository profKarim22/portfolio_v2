import React, { useState, useEffect } from "react";
import { FaCopy, FaCheck } from "react-icons/fa";
import { FiTerminal } from "react-icons/fi";
import { usePortfolio } from "../context/PortfolioContext";
import * as api from "../services/api";
import highlightJSON from "../utils/highlightJSON";
import {
  getProfileData,
  getProjectsData,
  getSkillsData,
  getStatusData,
} from "../utils/dataProjections";
import "../styles/ApiTerminal.css";

export default function ApiTerminal() {
  const { portfolioData } = usePortfolio();
  const [activeRoute, setActiveRoute] = useState("profile");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ROUTES = ["profile", "projects", "skills", "status"];

  const [endpointDataMap, setEndpointDataMap] = useState({
    profile: getProfileData(portfolioData?.profile),
    projects: getProjectsData(portfolioData?.projects),
    skills: getSkillsData(portfolioData?.skills),
    status: getStatusData(portfolioData?.statusConfig),
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, projectsRes, skillsRes, statusRes] = await Promise.all([
          api.getProfile().catch(() => null),
          api.getProjects().catch(() => null),
          api.getSkills().catch(() => null),
          api.getStatus().catch(() => null),
        ]);

        if (isMounted) {
          const rawProfile =
            profileRes?.data !== undefined ? profileRes.data : profileRes || portfolioData?.profile;
          const rawProjects =
            projectsRes?.data !== undefined ? projectsRes.data : projectsRes || portfolioData?.projects;
          const rawSkills =
            skillsRes?.data !== undefined ? skillsRes.data : skillsRes || portfolioData?.skills;
          const rawStatus =
            statusRes?.data !== undefined ? statusRes.data : statusRes || portfolioData?.statusConfig;

          setEndpointDataMap({
            profile: getProfileData(rawProfile),
            projects: getProjectsData(rawProjects),
            skills: getSkillsData(rawSkills),
            status: getStatusData(rawStatus),
          });
        }
      } catch (err) {
        console.warn("API Console fetch notice:", err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchAllData();

    return () => {
      isMounted = false;
    };
  }, [portfolioData]);

  const activeData = endpointDataMap[activeRoute];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(activeData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="section terminal-section" id="terminal">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="eyebrow-text">// INTERACTIVE REST API SHOWCASE</div>
          <h2 className="section-title">Live API Console</h2>
          <p className="lead-p section-subtitle">
            Inspect real-time structured JSON backend responses with live endpoint switching,
            syntax highlighting, and one-click clipboard copying.
          </p>
        </div>

        {/* Main Neo-Brutalist Terminal Box */}
        <div className="neo-panel api-terminal-box">
          {/* Left Sidebar: Route Switchers */}
          <aside className="api-sidebar">
            <div className="sidebar-header-label">ENDPOINTS</div>
            <div className="sidebar-routes">
              {ROUTES.map((route) => {
                const isActive = activeRoute === route;
                return (
                  <button
                    key={route}
                    onClick={() => setActiveRoute(route)}
                    className={`api-route-btn ${isActive ? "active" : ""}`}
                  >
                    <span className="route-name">GET /{route}</span>
                    <span className="route-status-chip">200</span>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Right Console Area */}
          <main className="api-console">
            {/* Terminal Window Header */}
            <div className="console-header">
              <div className="header-left">
                <div className="window-dots">
                  <span className="dot dot-red" />
                  <span className="dot dot-yellow" />
                  <span className="dot dot-green" />
                </div>
                <span className="host-label">
                  <FiTerminal size={14} /> karim.dev // api-worker
                </span>
              </div>

              <div className="header-right">
                <span className="status-pill">
                  <span className="status-dot-green" />
                  200 OK
                </span>
                <button
                  onClick={handleCopy}
                  className={`neo-button btn-copy-json ${copied ? "copied" : ""}`}
                  title="Copy formatted JSON to clipboard"
                  type="button"
                >
                  {copied ? (
                    <>
                      <FaCheck /> Copied!
                    </>
                  ) : (
                    <>
                      <FaCopy /> Copy JSON
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* cURL Command Prompt Bar */}
            <div className="curl-bar">
              <span className="curl-dollar">$</span>
              <span className="curl-command">
                curl -s https://karim.dev/api/v1/{activeRoute}
              </span>
            </div>

            {/* Response Body */}
            <div className="console-body">
              <pre
                className="json-pre tabular-numbers"
                dangerouslySetInnerHTML={{
                  __html: highlightJSON(activeData),
                }}
              />
            </div>
          </main>
        </div>
      </div>
    </section>
  );
}

export { ApiTerminal as ApiExplorer };
