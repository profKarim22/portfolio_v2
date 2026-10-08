import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // ── Session Bootstrap (runs on startup to verify existing session/token) ──
  const checkSession = useCallback(async () => {
    setIsBootstrapping(true);
    setAuthError(null);
    try {
      // Only query /auth/me if there is a token or credentials present
      const token = api.getAuthToken();
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setIsBootstrapping(false);
        return false;
      }

      const res = await api.getMe();
      const userData = res?.data?.user || res?.data || res?.user || res;
      if (userData && (userData.email || userData.id || userData._id)) {
        setUser({
          id: userData.id || userData._id,
          email: userData.email,
          role: userData.role || 'admin',
        });
        setIsAuthenticated(true);
        return true;
      } else {
        throw new Error('Invalid user payload');
      }
    } catch (err) {
      // Token expired or invalid
      api.clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    checkSession();

    // Listen to automatic 401 session expiration from API service
    const handleAuthExpired = () => {
      setUser(null);
      setIsAuthenticated(false);
      setAuthError('Your session has expired. Please log in again.');
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [checkSession]);

  // ── Login Flow ──
  const login = async (email, password) => {
    setIsLoading(true);
    setAuthError(null);
    try {
      const res = await api.loginAdmin(email, password);
      // Retrieve authoritative user details
      const meRes = await api.getMe().catch(() => null);
      const userData = meRes?.data?.user || meRes?.data || res?.data?.user || { email, role: 'admin' };

      setUser({
        id: userData.id || userData._id,
        email: userData.email || email,
        role: userData.role || 'admin',
      });
      setIsAuthenticated(true);
      return res;
    } catch (err) {
      const message = err.message || 'Authentication failed. Please check your credentials.';
      setAuthError(message);
      setIsAuthenticated(false);
      setUser(null);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // ── Logout Flow ──
  const logout = async () => {
    setIsLoading(true);
    try {
      await api.logoutAdmin();
    } catch (err) {
      console.warn('Logout warning:', err.message);
    } finally {
      api.clearAuthToken();
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      setIsLoading(false);
    }
  };

  // ── Password Change ──
  const changePassword = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      const result = await api.changePassword(currentPassword, newPassword);
      return result;
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isBootstrapping,
        isLoading,
        authError,
        setAuthError,
        login,
        logout,
        checkSession,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
