import './App.css';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminLogin from './pages/AdminLogin';
import AppNavbar from './components/AppNavbar';
import StoreAdminNavbar from './components/StoreAdminNavbar';
import AdminDashboardGuard from './pages/AdminDashboardGuard';
import AdminStoresGuard from './pages/AdminStoresGuard';
import StoreLogin from './pages/StoreLogin';
import StoreAdminGuard from './pages/StoreAdminGuard';

function App() {
  const location = useLocation();
  const isAdminLogin = location.pathname.startsWith('/admin/login');
  const isStoreLogin = location.pathname.startsWith('/store/login');
  const isStoreAdmin = location.pathname.startsWith('/store/admin/');
  return (
    <div>
      {isStoreAdmin ? <StoreAdminNavbar /> : (!isAdminLogin && !isStoreLogin ? <AppNavbar /> : null)}
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboardGuard />} />
        <Route path="/admin/stores" element={<AdminStoresGuard />} />
        <Route path="/store/login" element={<StoreLogin />} />
        <Route path="/store/admin/:storeId" element={<StoreAdminGuard />} />
        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </div>
  );
}

export default App;
