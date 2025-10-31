import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import StoreAdmin from './StoreAdmin';

function StoreAdminGuard() {
  const { storeId } = useParams();
  let loggedStoreId = null;
  try {
    loggedStoreId = localStorage.getItem('store_auth_storeId');
  } catch (_) {}
  if (!loggedStoreId || String(loggedStoreId) !== String(storeId)) {
    return <Navigate to="/store/login" replace />;
  }
  return <StoreAdmin />;
}

export default StoreAdminGuard;


