import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AppNavbar() {
  const navigate = useNavigate();

  function handleLogout() {
    try { localStorage.removeItem('auth_token'); } catch (_) {}
    navigate('/admin/login');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ position: 'sticky', top: 0, zIndex: 1000, backgroundColor: '#4b006e' }}>
      <div className="container">
        <Link className="navbar-brand" to="/admin/dashboard" style={{ fontWeight: 600 }}>Web Store Admin</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar" aria-controls="mainNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/stores">Stores</Link>
            </li>
          </ul>
          <div className="d-flex">
            <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AppNavbar;


