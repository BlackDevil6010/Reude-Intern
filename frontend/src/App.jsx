import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { db } from './db';
import Layout from './layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Interns from './pages/Interns';
import AIAssistant from './pages/AIAssistant';
import SettingsPage from './pages/Settings';

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
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="interns" element={<Interns />} />
        <Route path="assistant" element={<AIAssistant />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
