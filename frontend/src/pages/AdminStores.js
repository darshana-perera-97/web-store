import React, { useEffect, useState } from 'react';

function AdminStores() {
  const [show, setShow] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    email: '',
    password: '',
    whatsappNumber: '',
    storeIcon: '',
    backgroundImage: '',
    package: 'Basic'
  });
  const [submitting, setSubmitting] = useState(false);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewStore, setViewStore] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editIconFile, setEditIconFile] = useState(null);
  const [editBgFile, setEditBgFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  function resolveImageUrl(u) {
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    if (u.startsWith('/')) return `http://localhost:5505${u}`;
    return u;
  }

  async function loadStores() {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5505/api/admin/stores');
      const data = await res.json().catch(() => ({}));
      if (data && data.success && Array.isArray(data.stores)) {
        setStores(data.stores);
      } else {
        setStores([]);
      }
    } catch (_) {
      setStores([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStores();
  }, []);
  const [storeIconFile, setStoreIconFile] = useState(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState(null);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function updateEditField(key, value) {
    setEditForm((prev) => ({ ...prev, [key]: value }));
  }

  function generatePassword() {
    const length = 12;
    const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lower = 'abcdefghijkmnopqrstuvwxyz';
    const digits = '23456789';
    const symbols = '!@#$%^&*';
    const all = upper + lower + digits + symbols;
    function pick(str) { return str[Math.floor(Math.random() * str.length)]; }
    let pwd = pick(upper) + pick(lower) + pick(digits) + pick(symbols);
    for (let i = pwd.length; i < length; i++) pwd += pick(all);
    return pwd.split('').sort(() => Math.random() - 0.5).join('');
  }

  function handleRegenerate() {
    updateField('password', generatePassword());
  }

  async function handleCopyPassword() {
    try {
      if (!form.password) return;
      await navigator.clipboard.writeText(form.password);
      alert('Password copied');
    } catch (_) {
      alert('Copy failed');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      // Upload images if provided
      const payload = { ...form };
      async function uploadFile(file) {
        const fd = new FormData();
        fd.append('file', file);
        const resp = await fetch('http://localhost:5505/api/upload', {
          method: 'POST',
          body: fd
        });
        if (!resp.ok) throw new Error('Upload failed');
        const data = await resp.json();
        if (!data?.success || !data?.path) throw new Error('Upload failed');
        return data.path;
      }

      if (storeIconFile) {
        payload.storeIcon = await uploadFile(storeIconFile);
      }
      if (backgroundImageFile) {
        payload.backgroundImage = await uploadFile(backgroundImageFile);
      }

      const res = await fetch('http://localhost:5505/api/admin/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Failed to save');
      } else {
        setShow(false);
        setForm({
          name: '', description: '', category: '', location: '', email: '', password: '',
          whatsappNumber: '', storeIcon: '', backgroundImage: '', package: 'Basic'
        });
        setStoreIconFile(null);
        setBackgroundImageFile(null);
        await loadStores();
        alert('Store saved');
      }
    } catch (_) {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">Stores</h1>
        <button className="btn btn-primary" onClick={() => setShow(true)}>Add Store</button>
      </div>
      {loading ? (
        <div className="text-muted">Loading...</div>
      ) : stores.length === 0 ? (
        <div className="card">
          <div className="card-body">
            <p className="m-0 text-muted">No stores yet.</p>
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {stores.map((s) => (
            <div className="col-sm-6 col-md-4 col-lg-3" key={s.id}>
              <div className="card h-100">
                {s.backgroundImage ? (
                  <img src={resolveImageUrl(s.backgroundImage)} className="card-img-top" alt={s.name} style={{ objectFit: 'cover', height: 120 }} />
                ) : (
                  <div className="bg-light" style={{ height: 120 }}></div>
                )}
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-center mb-2">
                    {s.storeIcon ? (
                      <img src={resolveImageUrl(s.storeIcon)} alt="icon" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: 4, marginRight: 8 }} />
                    ) : (
                      <div style={{ width: 32, height: 32, background: '#f0f0f0', borderRadius: 4, marginRight: 8 }}></div>
                    )}
                    <h5 className="card-title mb-0" style={{ fontSize: 16 }}>{s.name}</h5>
                  </div>
                  <p className="card-text text-muted" style={{ fontSize: 13 }}>
                    {(s.category || '—')} • {(s.location || '—')}
                  </p>
                  <p className="card-text" style={{ fontSize: 13, flexGrow: 1 }}>{s.description || ''}</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-secondary" onClick={() => { setViewStore(s); setEditMode(false); setEditForm(s); }}>View</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {show && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add Store</h5>
                <button type="button" className="btn-close" onClick={() => setShow(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Store name</label>
                      <input className="form-control" value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Store Category</label>
                      <select className="form-select" value={form.category} onChange={(e) => updateField('category', e.target.value)}>
                        <option value="">Select category</option>
                        <option>handcrafts</option>
                        <option>Cakes</option>
                        <option>Clothes</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-bold">Description</label>
                      <textarea className="form-control" rows="2" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Location</label>
                      <select className="form-select" value={form.location} onChange={(e) => updateField('location', e.target.value)}>
                        <option value="">Select district</option>
                        <option>Ampara</option>
                        <option>Anuradhapura</option>
                        <option>Badulla</option>
                        <option>Batticaloa</option>
                        <option>Colombo</option>
                        <option>Galle</option>
                        <option>Gampaha</option>
                        <option>Hambantota</option>
                        <option>Jaffna</option>
                        <option>Kalutara</option>
                        <option>Kandy</option>
                        <option>Kegalle</option>
                        <option>Kilinochchi</option>
                        <option>Kurunegala</option>
                        <option>Mannar</option>
                        <option>Matale</option>
                        <option>Matara</option>
                        <option>Monaragala</option>
                        <option>Mullaitivu</option>
                        <option>Nuwara Eliya</option>
                        <option>Polonnaruwa</option>
                        <option>Puttalam</option>
                        <option>Ratnapura</option>
                        <option>Trincomalee</option>
                        <option>Vavuniya</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">WhatsApp number</label>
                      <input
                        type="tel"
                        className="form-control"
                        placeholder="7XXXXXXXX"
                        value={form.whatsappNumber}
                        onChange={(e) => updateField('whatsappNumber', e.target.value)}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Email</label>
                      <input type="email" className="form-control" value={form.email} onChange={(e) => updateField('email', e.target.value)} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Password</label>
                      <div className="input-group">
                        <input type="password" className="form-control" value={form.password} onChange={(e) => updateField('password', e.target.value)} required />
                        <button type="button" className="btn btn-outline-secondary" title="Copy" onClick={handleCopyPassword}>📋</button>
                        <button type="button" className="btn btn-dark" title="Regenerate" onClick={handleRegenerate}>↻</button>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Store Icon</label>
                      <input type="file" accept="image/*" className="form-control" onChange={(e) => setStoreIconFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                      {form.storeIcon && <small className="text-muted">Current: {form.storeIcon}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Background Image</label>
                      <input type="file" accept="image/*" className="form-control" onChange={(e) => setBackgroundImageFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                      {form.backgroundImage && <small className="text-muted">Current: {form.backgroundImage}</small>}
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-bold">Package</label>
                      <select className="form-select" value={form.package} onChange={(e) => updateField('package', e.target.value)}>
                        <option>Basic</option>
                        <option>Starter</option>
                        <option>Pro</option>
                        <option>Enterprise</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShow(false)}>Cancel</button>
                  <button type="submit" className="btn btn-dark" disabled={submitting}>{submitting ? 'Saving...' : 'Save'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Modal */}
      {viewStore && editForm && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editMode ? 'Edit Store' : 'Store Details'}</h5>
                <button type="button" className="btn-close" onClick={() => { setViewStore(null); setEditMode(false); setEditForm(null); }}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12 d-flex align-items-center gap-3">
                    {viewStore.storeIcon && (
                      <img src={resolveImageUrl(viewStore.storeIcon)} alt="icon" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                    )}
                    <div className="flex-grow-1">
                      {editMode ? (
                        <input className="form-control" value={editForm.name || ''} onChange={(e) => updateEditField('name', e.target.value)} />
                      ) : (
                        <h5 className="m-0">{viewStore.name}</h5>
                      )}
                      <div className="text-muted" style={{ fontSize: 13 }}>
                        {(viewStore.category || '—')} • {(viewStore.location || '—')}
                      </div>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-bold">Description</label>
                    {editMode ? (
                      <textarea className="form-control" rows="2" value={editForm.description || ''} onChange={(e) => updateEditField('description', e.target.value)} />
                    ) : (
                      <div className="text-muted">{viewStore.description || ''}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Email</label>
                    {editMode ? (
                      <input type="email" className="form-control" value={editForm.email || ''} onChange={(e) => updateEditField('email', e.target.value)} />
                    ) : (
                      <div className="text-muted">{viewStore.email}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">WhatsApp</label>
                    {editMode ? (
                      <input className="form-control" value={editForm.whatsappNumber || ''} onChange={(e) => updateEditField('whatsappNumber', e.target.value)} />
                    ) : (
                      <div className="text-muted">{viewStore.whatsappNumber || ''}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Password</label>
                    <div className="text-muted">{viewStore.password || ''}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Category</label>
                    <div className="text-muted">{viewStore.category || ''}</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Location</label>
                    <div className="text-muted">{viewStore.location || ''}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-bold">Package</label>
                    {editMode ? (
                      <select className="form-select" value={editForm.package || 'Basic'} onChange={(e) => updateEditField('package', e.target.value)}>
                        <option>Basic</option>
                        <option>Starter</option>
                        <option>Pro</option>
                        <option>Enterprise</option>
                      </select>
                    ) : (
                      <div className="text-muted">{viewStore.package || ''}</div>
                    )}
                  </div>

                  {/* Icon and Background image editing */}
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Store Icon</label>
                    <div className="d-flex align-items-center gap-2">
                      {viewStore.storeIcon && (
                        <img src={resolveImageUrl(viewStore.storeIcon)} alt="icon" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6, cursor: !editMode ? 'pointer' : 'default' }} onClick={() => { if (!editMode) setPreviewImageUrl(resolveImageUrl(viewStore.storeIcon)); }} />
                      )}
                      {editMode && (
                        <input type="file" accept="image/*" className="form-control" onChange={(e) => setEditIconFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-bold">Background Image</label>
                    <div className="d-flex align-items-center gap-2">
                      {viewStore.backgroundImage && (
                        <img src={resolveImageUrl(viewStore.backgroundImage)} alt="bg" style={{ width: 80, height: 40, objectFit: 'cover', borderRadius: 6, cursor: !editMode ? 'pointer' : 'default' }} onClick={() => { if (!editMode) setPreviewImageUrl(resolveImageUrl(viewStore.backgroundImage)); }} />
                      )}
                      {editMode && (
                        <input type="file" accept="image/*" className="form-control" onChange={(e) => setEditBgFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)} />
                      )}
                    </div>
                  </div>

                </div>
              </div>
              <div className="modal-footer">
                {!editMode && <button type="button" className="btn btn-dark" onClick={() => setEditMode(true)}>Edit</button>}
                {editMode && <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditMode(false); setEditForm(viewStore); }}>Cancel</button>}
                {editMode && <button type="button" className="btn btn-dark" onClick={async () => {
                  try {
                    const payload = {
                      name: editForm.name,
                      description: editForm.description,
                      email: editForm.email,
                      whatsappNumber: editForm.whatsappNumber,
                      package: editForm.package,
                    };
                    // upload files if changed
                    async function uploadFile(file) {
                      const fd = new FormData();
                      fd.append('file', file);
                      const resp = await fetch('http://localhost:5505/api/upload', { method: 'POST', body: fd });
                      if (!resp.ok) throw new Error('Upload failed');
                      const data = await resp.json();
                      if (!data?.success || !data?.path) throw new Error('Upload failed');
                      return data.path;
                    }
                    if (editIconFile) {
                      payload.storeIcon = await uploadFile(editIconFile);
                    }
                    if (editBgFile) {
                      payload.backgroundImage = await uploadFile(editBgFile);
                    }
                    const res = await fetch(`http://localhost:5505/api/admin/stores/${viewStore.id}`, {
                      method: 'PUT',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(payload)
                    });
                    if (!res.ok) {
                      const err = await res.json().catch(() => ({}));
                      alert(err.message || 'Failed to update');
                    } else {
                      const data = await res.json();
                      if (data && data.success && data.store) {
                        setViewStore(data.store);
                        setEditForm(data.store);
                        setEditIconFile(null);
                        setEditBgFile(null);
                        setEditMode(false);
                        await loadStores();
                        alert('Updated');
                      }
                    }
                  } catch (_) {
                    alert('Network error');
                  }
                }}>Save</button>}
                <button type="button" className="btn btn-outline-secondary" disabled={editMode} onClick={() => { if (editMode) return; setViewStore(null); setEditMode(false); setEditForm(null); }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
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

export default AdminStores;


