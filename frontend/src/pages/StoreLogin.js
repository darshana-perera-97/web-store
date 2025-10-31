import React, { useState } from 'react';
import LoginNavbar from '../components/LoginNavbar';
import { useNavigate } from 'react-router-dom';

function StoreLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState(''); // store email or id
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5505/api/store/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Login failed');
        return;
      }
      const data = await res.json();
      if (data && data.success && data.storeId) {
        try { localStorage.setItem('store_auth_storeId', String(data.storeId)); } catch (_) {}
        navigate(`/store/admin/${data.storeId}`);
      } else {
        alert('Login failed');
      }
    } catch (_) {
      alert('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <LoginNavbar />
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <form onSubmit={handleSubmit} className="card p-4" style={{ width: 380 }}>
        <h2 className="text-center mb-3" style={{ margin: 0 }}>Store Login</h2>
        <div className="mb-3">
          <label className="form-label fw-bold">Email or Store ID</label>
          <input
            className="form-control"
            placeholder="store@example.com or 173..."
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label fw-bold">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
    </>
  );
}

export default StoreLogin;


