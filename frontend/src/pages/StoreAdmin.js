import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

function StoreAdmin() {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Basic');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [iconFile, setIconFile] = useState(null);
  const [bgFile, setBgFile] = useState(null);
  const [savingImages, setSavingImages] = useState(false);
  const iconInputRef = useRef(null);
  const bgInputRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5505/api/stores/${storeId}`);
        const data = await res.json().catch(() => ({}));
        if (isMounted) {
          if (data && data.success && data.store) setStore(data.store);
          else setStore(null);
        }
      } catch (_) {
        if (isMounted) setStore(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [storeId]);

  if (loading) return <div className="container py-4">Loading...</div>;
  if (!store) return <div className="container py-4">Store not found</div>;

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center mb-3">
        {store.storeIcon && (
          <img src={store.storeIcon.startsWith('/') ? `http://localhost:5505${store.storeIcon}` : store.storeIcon} alt="icon" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, marginRight: 12 }} />
        )}
        <div>
          <h1 className="h4 m-0">{store.name}</h1>
          <div className="text-muted" style={{ fontSize: 13 }}>{store.category || '—'} • {store.location || '—'}</div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="row g-3 mb-3">
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted" style={{ fontSize: 12 }}>Package</div>
              <div className="fw-bold" style={{ fontSize: 18 }}>{store.package || '—'}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted" style={{ fontSize: 12 }}>No of Items</div>
              <div className="fw-bold" style={{ fontSize: 18 }}>{0}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted" style={{ fontSize: 12 }}>No of Orders</div>
              <div className="fw-bold" style={{ fontSize: 18 }}>{0}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card h-100">
            <div className="card-body">
              <div className="text-muted" style={{ fontSize: 12 }}>Total Income</div>
              <div className="fw-bold" style={{ fontSize: 18 }}>Rs 0.00</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {['Basic', 'Images', 'Orders', 'Items'].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              type="button"
              className={`nav-link${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab content */}
      {activeTab === 'Basic' ? (
        <div className="card mb-3">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-striped align-middle">
                <tbody>
                  <tr>
                    <th className="fw-bold text-muted" style={{ width: 200 }}>Store ID</th>
                    <td>
                      <span className="me-2">{store.id}</span>
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-bold text-muted">Name</th>
                    <td>{store.name}</td>
                  </tr>
                  <tr>
                    <th className="fw-bold text-muted">Email</th>
                    <td>{store.email || '—'}</td>
                  </tr>
                  <tr>
                    <th className="fw-bold text-muted">WhatsApp</th>
                    <td>{store.whatsappNumber || '—'}</td>
                  </tr>
                  <tr>
                    <th className="fw-bold text-muted">Category</th>
                    <td>
                      {store.category ? (
                        <span className="badge rounded-pill text-bg-light border" style={{ borderColor: '#e0e0e0' }}>{store.category}</span>
                      ) : '—'}
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-bold text-muted">Location</th>
                    <td>{store.location || '—'}</td>
                  </tr>
                  <tr>
                    <th className="fw-bold text-muted">Package</th>
                    <td>
                      {store.package ? (
                        <span className="badge" style={{ backgroundColor: '#4b006e' }}>{store.package}</span>
                      ) : '—'}
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-bold text-muted">Description</th>
                    <td className="text-muted" style={{ whiteSpace: 'pre-wrap' }}>{store.description || '—'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : activeTab === 'Images' ? (
        <div className="card mb-3">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="mb-2">Store Icon</div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  {store.storeIcon ? (
                    <img
                      src={store.storeIcon.startsWith('/') ? `http://localhost:5505${store.storeIcon}` : store.storeIcon}
                      alt="icon"
                      style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 10, cursor: 'pointer' }}
                      onClick={() => setPreviewImageUrl(store.storeIcon.startsWith('/') ? `http://localhost:5505${store.storeIcon}` : store.storeIcon)}
                    />
                  ) : (
                    <div className="bg-light" style={{ width: 96, height: 96, borderRadius: 10 }}></div>
                  )}
                </div>
                <input
                  ref={iconInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setIconFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                />
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => iconInputRef.current && iconInputRef.current.click()}
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-2">Background Image</div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  {store.backgroundImage ? (
                    <img
                      src={store.backgroundImage.startsWith('/') ? `http://localhost:5505${store.backgroundImage}` : store.backgroundImage}
                      alt="background"
                      style={{ width: 240, height: 120, objectFit: 'cover', borderRadius: 10, cursor: 'pointer' }}
                      onClick={() => setPreviewImageUrl(store.backgroundImage.startsWith('/') ? `http://localhost:5505${store.backgroundImage}` : store.backgroundImage)}
                    />
                  ) : (
                    <div className="bg-light" style={{ width: 240, height: 120, borderRadius: 10 }}></div>
                  )}
                </div>
                <input
                  ref={bgInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => setBgFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                />
                <div className="mt-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => bgInputRef.current && bgInputRef.current.click()}
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-3 d-flex gap-2">
              <button
                className="btn btn-primary"
                disabled={savingImages || (!iconFile && !bgFile)}
                onClick={async () => {
                  setSavingImages(true);
                  try {
                    const payload = {};
                    async function uploadFile(file) {
                      const fd = new FormData();
                      fd.append('file', file);
                      const resp = await fetch('http://localhost:5505/api/upload', { method: 'POST', body: fd });
                      if (!resp.ok) throw new Error('Upload failed');
                      const data = await resp.json();
                      if (!data?.success || !data?.path) throw new Error('Upload failed');
                      return data.path;
                    }
                    if (iconFile) {
                      payload.storeIcon = await uploadFile(iconFile);
                    }
                    if (bgFile) {
                      payload.backgroundImage = await uploadFile(bgFile);
                    }
                    if (Object.keys(payload).length > 0) {
                      const res = await fetch(`http://localhost:5505/api/admin/stores/${store.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                      });
                      if (!res.ok) {
                        const err = await res.json().catch(() => ({}));
                        alert(err.message || 'Failed to update images');
                      } else {
                        const data = await res.json();
                        if (data && data.success && data.store) {
                          setStore(data.store);
                          setIconFile(null);
                          setBgFile(null);
                          alert('Images updated');
                        }
                      }
                    }
                  } catch (_) {
                    alert('Network error');
                  } finally {
                    setSavingImages(false);
                  }
                }}
              >
                {savingImages ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card mb-3">
          <div className="card-body">
            <div className="text-muted">{activeTab} content will appear here.</div>
          </div>
        </div>
      )}

      {/* Image preview modal */}
      {previewImageUrl && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.8)' }} onClick={() => setPreviewImageUrl('')}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content" style={{ background: 'transparent', border: 'none' }}>
              <button type="button" className="btn-close ms-auto me-1 mt-1" onClick={() => setPreviewImageUrl('')} style={{ filter: 'invert(1)' }}></button>
              <img src={previewImageUrl} alt="preview" style={{ maxWidth: '90vw', maxHeight: '80vh', objectFit: 'contain', borderRadius: 8 }} />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default StoreAdmin;


