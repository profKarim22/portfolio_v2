import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { usePortfolio } from "../context/PortfolioContext";
import useTheme from "../hooks/useTheme";
import ThemeToggle from "./ThemeToggle";
import "../styles/NavBar.css";

export default function NavBar() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const { isDark, toggleTheme } = useTheme();

  const { portfolioData } = usePortfolio();
  const statusConfig = portfolioData?.statusConfig;
  const currentMode = statusConfig?.modes?.[statusConfig?.mode] || statusConfig?.modes?.available;

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["contact", "terminal", "projects", "about", "home"];
      const scrollPos = window.scrollY + 140;
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && scrollPos >= el.offsetTop) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setMobileOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 68;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "API Terminal", id: "terminal" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <>
      <header className="neo-header">
        <div className="header-inner">
          {/* Original Monospace Brand Wordmark Preserved */}
          <div
            className="navbar-logo"
            onClick={() => navigate("/")}
            onDoubleClick={() => navigate("/admin")}
            title="Karim Abbas — Double-click for Admin Panel"
            role="button"
            tabIndex={0}
          >
            <span className="logo-bracket">&lt;</span>
            <span className="logo-text">Karim</span>
            <span className="logo-dot">.</span>
            <span className="logo-method">Dev</span>
            <span className="logo-bracket"> /&gt;</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`nav-link ${isActive ? "active" : ""}`}
                >
                  {item.label}
                </button>
              );
            })}

            {/* Status Pill Badge */}
            <div className="header-status-badge">
              <span className="status-ping-dot" />
              <span className="status-badge-text">
                {currentMode?.label || "Open for Roles"}
              </span>
            </div>

            {/* Shared Theme Toggle Button */}
            <ThemeToggle />
          </nav>

          {/* Mobile Right Controls */}
          <div className="mobile-header-actions">
            <ThemeToggle />

            <button
              className="mobile-menu-trigger muted-button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={18} /> : <FiMenu size={18} />}
              <span>{mobileOpen ? "Close" : "Menu"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Floating Panel & Overlay */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="mobile-panel neo-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-panel-header">
              <div className="navbar-logo">
                <span className="logo-bracket">&lt;</span>
                <span className="logo-text">Karim</span>
                <span className="logo-dot">.</span>
                <span className="logo-method">Dev</span>
                <span className="logo-bracket"> /&gt;</span>
              </div>
              <button
                className="neo-icon-button close-icon-btn"
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
              >
                <FiX size={18} />
              </button>
            </div>

            <div className="mobile-links-stack">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`mobile-nav-btn ${
                    activeSection === item.id ? "neo-button" : "muted-button"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mobile-panel-footer">
              <div className="header-status-badge">
                <span className="status-ping-dot" />
                <span className="status-badge-text">
                  {currentMode?.label || "Open for Roles"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
