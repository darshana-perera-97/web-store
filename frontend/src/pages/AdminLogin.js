import React, { useState } from 'react';
import LoginNavbar from '../components/LoginNavbar';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const res = await fetch('http://localhost:5505/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Login failed');
        return;
      }

      const data = await res.json();
      if (data && data.success) {
        // optional: store token
        try { localStorage.setItem('auth_token', data.token); } catch (_) { }
        navigate('/admin/dashboard');
      } else {
        alert('Login failed');
      }
    } catch (e) {
      alert('Network error');
    }
  }

  return (
    <>
      <LoginNavbar />
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 56px)', background: '#fff' }}>
      <form onSubmit={handleSubmit} className="card p-4" style={{ width: 360 }}>
        <h2 className="text-center mb-3" style={{ margin: 0 }}>Admin Login</h2>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Admin Password"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Admin Password"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Sign in
        </button>
      </form>
    </div>
    </>
  );
}

export default AdminLogin;


