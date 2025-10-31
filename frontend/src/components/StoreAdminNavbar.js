import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

function StoreAdminNavbar() {
    const navigate = useNavigate();
    const { storeId } = useParams();

    function handleLogout() {
        try { localStorage.removeItem('store_auth_storeId'); } catch (_) { }
        navigate('/store/login');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#4b006e', position: 'sticky', top: 0, zIndex: 1000 }}>
            <div className="container">
                <Link className="navbar-brand" to={`/store/admin/${storeId}`} style={{ fontWeight: 600 }}>Store Admin</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#storeAdminNavbar" aria-controls="storeAdminNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="storeAdminNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            {/* <Link className="nav-link" to={`/store/admin/${storeId}`}>Overview</Link> */}
                        </li>
                    </ul>
                    <div className="d-flex gap-2">
                        {/* <Link className="btn btn-outline-light" to={`/store/admin/${storeId}`}>Dashboard</Link> */}
                        <button className="btn btn-light" onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default StoreAdminNavbar;


