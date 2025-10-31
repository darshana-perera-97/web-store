import React from 'react';
import { Navigate } from 'react-router-dom';
import AdminStores from './AdminStores';

function AdminStoresGuard() {
  let token = null;
  try { token = localStorage.getItem('auth_token'); } catch (_) {}
  if (!token) return <Navigate to="/admin/login" replace />;
  return <AdminStores />;
}

export default AdminStoresGuard;


