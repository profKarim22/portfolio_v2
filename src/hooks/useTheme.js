import { useState, useEffect, useCallback } from "react";

/**
 * Shared theme state. Dark mode is the default; light mode is only used when
 * the visitor explicitly chose it (persisted in localStorage as "light").
 * The initial class is applied by the inline script in index.html to avoid a flash.
 */
const getIsDark = () => {
  if (typeof document === "undefined") return true;
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "light") return false;
    if (saved === "dark") return true;
  } catch (_) {}
  // Default to true (Dark Mode)
  return document.documentElement.classList.contains("dark") || true;
};

export default function useTheme() {
  const [isDark, setIsDark] = useState(getIsDark);

  // Keep every consumer (NavBar, 3D card, admin) in sync with <html class="dark">
  useEffect(() => {
    const observer = new MutationObserver(() => setIsDark(getIsDark()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = useCallback(() => {
    const nextDark = !getIsDark();
    document.documentElement.classList.toggle("dark", nextDark);
    try {
      localStorage.setItem("theme", nextDark ? "dark" : "light");
    } catch (_) {
      /* storage unavailable */
    }
  }, []);

  return { isDark, toggleTheme };
}
