import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Components / Layouts
import ModernLayout from './components/ModernLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import Reminders from './pages/Reminders';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';

// Route Guard: Ensures user is logged in
const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1D] text-cyan-400 text-sm font-medium">
        Loading MediVault...
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

// Route Guard: Ensures logged-in user has 'admin' role
const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0F1D] text-cyan-400 text-sm font-medium">
        Verifying permissions...
      </div>
    );
  }

  return user && user.user?.role === 'admin' ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

// Public Route Guard: Redirects logged-in users away from Login/Register
const PublicOnlyRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  if (user) {
    return <Navigate to={user.user?.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <Outlet />;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes (No Sidebar) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* User Protected Routes with Modern Dark Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<ModernLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/reminders" element={<Reminders />} />
            </Route>
          </Route>

          {/* Admin Protected Routes with Modern Dark Layout */}
          <Route element={<AdminRoute />}>
            <Route element={<ModernLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}