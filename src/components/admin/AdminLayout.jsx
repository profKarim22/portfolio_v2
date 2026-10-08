import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import {
  FaTachometerAlt,
  FaFolder,
  FaToggleOn,
  FaTerminal,
  FaUserShield,
  FaCog,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import Toast from "./Toast";
import ErrorBoundary from "../ErrorBoundary";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../context/AuthContext";
import * as api from "../../services/api";
import "../../styles/admin/index.css";

// ── Toast Context ──
const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(null);
  const [latencyMs, setLatencyMs] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Toast Dispatcher
  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  // Check Backend Health
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      try {
        const start = performance.now();
        await api.getHealth();
        if (isMounted) {
          setBackendHealthy(true);
          setLatencyMs(Math.round(performance.now() - start));
        }
      } catch {
        if (isMounted) {
          setBackendHealthy(false);
          setLatencyMs(null);
        }
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // Escape key closes mobile drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // Auto-close drawer if resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    showToast("Signed out successfully.", "info");
    navigate("/admin/login");
  };

  const navGroups = [
    {
      group: "Overview",
      items: [
        {
          to: "/admin/dashboard",
          icon: FaTachometerAlt,
          label: "Dashboard",
          exact: true,
        },
      ],
    },
    {
      group: "Content",
      items: [
        { to: "/admin/projects", icon: FaFolder, label: "Projects" },
        { to: "/admin/status", icon: FaToggleOn, label: "Portfolio Status" },
        { to: "/admin/api-console", icon: FaTerminal, label: "API Console" },
      ],
    },
    {
      group: "Account",
      items: [
        { to: "/admin/profile", icon: FaUserShield, label: "Admin Profile" },
        { to: "/admin/settings", icon: FaCog, label: "Settings & Security" },
      ],
    },
  ];

  // Derive active breadcrumb
  const currentPath = location.pathname
    .replace("/admin/", "")
    .replace("/admin", "DASHBOARD");
  const breadcrumbLabel = currentPath.split("/")[0].toUpperCase();

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="admin-app-container">
        {/* Mobile Backdrop */}
        {isSidebarOpen && (
          <div
            className="admin-sidebar-backdrop"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar / Mobile Navigation Drawer */}
        <aside
          id="admin-navigation-drawer"
          className={`admin-sidebar ${isCollapsed ? "collapsed" : ""} ${isSidebarOpen ? "open" : ""}`}
          role="navigation"
          aria-label="Admin Navigation"
        >
          <div className="admin-sidebar-header">
            {/* Desktop Brand / Collapsed Logo */}
            <Link
              to="/admin/dashboard"
              className="admin-logo-link"
              title="Control Center"
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="admin-logo-mark">K</div>
              <div className="admin-logo-text">
                <span className="admin-logo-title">Control Center</span>
                <span className="admin-logo-env">REST API // SEC</span>
              </div>
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              className="admin-sidebar-toggle-btn"
              onClick={() => setIsCollapsed(!isCollapsed)}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
            </button>

            {/* Mobile Drawer Close Button */}
            <button
              className="admin-drawer-close-btn"
              onClick={() => setIsSidebarOpen(false)}
              title="Close navigation drawer"
              aria-label="Close navigation drawer"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="admin-sidebar-nav">
            {navGroups.map((group) => (
              <div key={group.group} className="sidebar-nav-group">
                <div className="sidebar-group-title">{group.group}</div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      className={({ isActive }) =>
                        `admin-nav-item ${isActive ? "active" : ""}`
                      }
                      end={item.exact}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <Icon className="admin-nav-icon" />
                      <span className="admin-nav-label">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </nav>

          <div className="admin-sidebar-footer">
            <div
              className="admin-user-pill"
              title={user?.email || "Administrator"}
            >
              <div className="user-avatar">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="user-details">
                <span className="user-email">
                  {user?.email || "Administrator"}
                </span>
                <span className="user-role">
                  {user?.role?.toUpperCase() || "ADMIN"}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="admin-logout-btn"
              title="Sign out"
              aria-label="Sign out"
            >
              <FaSignOutAlt />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Arena */}
        <div
          className={`admin-main-wrapper ${isCollapsed ? "sidebar-collapsed" : ""}`}
        >
          {/* Top Navigation Bar */}
          <header className="admin-topbar">
            <div className="topbar-left">
              <button
                className="admin-hamburger"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Toggle Navigation"
                aria-expanded={isSidebarOpen}
                aria-controls="admin-navigation-drawer"
              >
                <FaBars />
              </button>

              <div className="topbar-breadcrumb">
                <span className="breadcrumb-root">WORKSPACE</span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-root">ADMIN</span>
                <span className="breadcrumb-sep">/</span>
                <span className="breadcrumb-current">{breadcrumbLabel}</span>
              </div>
            </div>

            <div className="topbar-right">
              {/* Backend Status Indicator */}
              <div
                className={`backend-status-badge ${
                  backendHealthy === true
                    ? "online"
                    : backendHealthy === false
                      ? "offline"
                      : "checking"
                }`}
                title={
                  backendHealthy === true
                    ? "Production API Connected & Operational"
                    : backendHealthy === false
                      ? "Production API Offline / Network Unreachable"
                      : "Pinging Backend API..."
                }
              >
                <span className="status-indicator-dot" />
                <span>
                  {backendHealthy === true
                    ? "API Live"
                    : backendHealthy === false
                      ? "API Offline"
                      : "Connecting"}
                </span>
              </div>

              {/* Theme Switcher */}
              <ThemeToggle />

              {/* Public Site Link */}
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="btn-view-public"
                title="Open Public Portfolio"
              >
                <span>Live Site</span>
                <FaExternalLinkAlt className="ext-icon" />
              </a>
            </div>
          </header>

          {/* Page Content */}
          <main className="admin-page-content">
            <ErrorBoundary>
              <Outlet context={{ backendHealthy, latencyMs }} />
            </ErrorBoundary>
          </main>
        </div>

        {/* Toast Notification Container */}
        <Toast toasts={toasts} />
      </div>
    </ToastContext.Provider>
  );
}
