import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { db } from './db';
import Layout from './layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Interns from './pages/Interns';
import Tasks from './pages/Tasks';
import Announcements from './pages/Announcements';
import AIAssistant from './pages/AIAssistant';
import SettingsPage from './pages/Settings';
import Management from './pages/Management';
import RolesPermissions from './pages/RolesPermissions';
import UserManagement from './pages/UserManagement';
import AuditLogs from './pages/AuditLogs';
import Approvals from './pages/Approvals';
import Reports from './pages/Reports';
import DataControls from './pages/DataControls';
import EmployeePortal from './pages/EmployeePortal';
import { RequirePermission } from './hooks/usePermission';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const item = localStorage.getItem('reude_user');
      return item && item !== 'undefined' ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  });
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    db.init(); // Ensure db is seeded if empty
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const logout = () => {
    localStorage.removeItem('reude_user');
    setUser(null);
  };

  const handleLogin = (token, u) => {
    localStorage.setItem('reude_user', JSON.stringify(u));
    setUser(u);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Routes>
      <Route path="/" element={<Layout user={user} logout={logout} isDark={isDark} toggleDark={() => setIsDark(!isDark)} />}>
        {/* Common & Role Routes */}
        <Route index element={user.role === 'Employee' ? <EmployeePortal /> : <Dashboard />} />
        
        {/* Employee Self-Service */}
        <Route path="portal" element={<EmployeePortal />} />
        
        {/* Management Desk */}
        <Route path="management" element={<Management />} />
        
        {/* Workforce */}
        <Route path="employees" element={<Employees />} />
        <Route path="interns" element={<Interns />} />
        <Route path="tasks" element={<Tasks />} />
        <Route path="announcements" element={<Announcements />} />
        
        {/* Admin & Management Features */}
        <Route path="roles" element={
          <RequirePermission permission="roles.manage" fallback={<Navigate to="/" replace />}>
            <RolesPermissions />
          </RequirePermission>
        } />
        <Route path="users" element={
          <RequirePermission permission="users.manage" fallback={<Navigate to="/" replace />}>
            <UserManagement />
          </RequirePermission>
        } />
        <Route path="audit-logs" element={
          <RequirePermission permission="audit.view" fallback={<Navigate to="/" replace />}>
            <AuditLogs />
          </RequirePermission>
        } />
        <Route path="approvals" element={
          <RequirePermission permission="approvals.act" fallback={<Navigate to="/" replace />}>
            <Approvals />
          </RequirePermission>
        } />
        <Route path="reports" element={
          <RequirePermission permission="reports.export" fallback={<Navigate to="/" replace />}>
            <Reports />
          </RequirePermission>
        } />
        <Route path="data-controls" element={
          <RequirePermission permission="data.import" fallback={<Navigate to="/" replace />}>
            <DataControls />
          </RequirePermission>
        } />

        {/* AI & Settings */}
        <Route path="assistant" element={<AIAssistant />} />
        <Route path="settings" element={<SettingsPage />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
