import React from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import useTheme from "../hooks/useTheme";

export default function ThemeToggle({ className = "" }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`theme-toggle-btn ${className}`}
      title={isDark ? "Switch to Light Theme" : "Switch to Dark Theme"}
      aria-label="Toggle Theme"
    >
      {isDark ? <FiSun className="theme-icon" /> : <FiMoon className="theme-icon" />}
    </button>
  );
}
