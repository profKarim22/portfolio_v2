import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './components/Home';
import About from './components/About';
import Projects from './components/Projects';
import ApiTerminal from './components/ApiTerminal';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Admin Architecture
import ProtectedRoute from './components/admin/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminOverview from './pages/admin/AdminOverview';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectCreate from './pages/admin/AdminProjectCreate';
import AdminProjectEdit from './pages/admin/AdminProjectEdit';
import AdminStatus from './pages/admin/AdminStatus';
import AdminApiConsole from './pages/admin/AdminApiConsole';
import AdminProfile from './pages/admin/AdminProfile';
import AdminSettings from './pages/admin/AdminSettings';

// Public Portfolio View
function PublicPortfolio() {
  return (
    <div className="app-layout app">
      <NavBar />
      <main className="main-content">
        <Home />
        <About />
        <Projects />
        <ApiTerminal />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* ── Public Portfolio ── */}
      <Route path="/" element={<PublicPortfolio />} />

      {/* ── Admin Login ── */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ── Protected Admin Control Panel ── */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminOverview />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="projects/new" element={<AdminProjectCreate />} />
        <Route path="projects/:id/edit" element={<AdminProjectEdit />} />
        <Route path="status" element={<AdminStatus />} />
        <Route path="api-console" element={<AdminApiConsole />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
