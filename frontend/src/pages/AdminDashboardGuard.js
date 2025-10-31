import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';

function AdminDashboardGuard() {
  let token = null;
  try { token = localStorage.getItem('auth_token'); } catch (_) {}
  if (!token) return <Navigate to="/admin/login" replace />;
  return <AdminDashboard />;
}

export default AdminDashboardGuard;


