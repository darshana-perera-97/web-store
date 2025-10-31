import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function LoginNavbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin/login');
  const isStore = location.pathname.startsWith('/store/login');

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#4b006e' }}>
      <div className="container">
        <span className="navbar-brand" style={{ fontWeight: 600 }}>Web Store</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#loginNavbar" aria-controls="loginNavbar" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="loginNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className={`nav-link${isAdmin ? ' active' : ''}`} to="/admin/login">Admin Login</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link${isStore ? ' active' : ''}`} to="/store/login">Store Login</Link>
            </li>
          </ul>
          <div className="d-flex">
            <a href="#" className="btn btn-primary">Get Started</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default LoginNavbar;


