const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5505;

// Root API only
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// Simple admin login validation (demo only)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body || {};

  if (username === 'a' && password === 'a') {
    return res.json({ success: true, token: 'demo-token', role: 'admin' });
  }

  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
const storesFile = path.join(dataDir, 'stores.json');
if (!fs.existsSync(dataDir)) {
  try { fs.mkdirSync(dataDir, { recursive: true }); } catch (_) {}
}
if (!fs.existsSync(storesFile)) {
  try { fs.writeFileSync(storesFile, '[]', 'utf8'); } catch (_) {}
}

// Ensure images directory exists and serve static files
const imagesDir = path.join(__dirname, 'images');
if (!fs.existsSync(imagesDir)) {
  try { fs.mkdirSync(imagesDir, { recursive: true }); } catch (_) {}
}
app.use('/images', express.static(imagesDir));

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const base = path.basename(file.originalname || 'upload', ext).replace(/[^a-z0-9_-]/gi, '_');
    const name = `${base}_${Date.now()}${ext}`;
    cb(null, name);
  }
});
const upload = multer({ storage });

// Upload single image endpoint (field name: file)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }
  // Public URL path
  const urlPath = `/images/${req.file.filename}`;
  return res.json({ success: true, path: urlPath, filename: req.file.filename });
});

// Create store (append to stores.json)
app.post('/api/admin/stores', (req, res) => {
  const {
    name,
    description,
    category,
    location,
    email,
    password,
    whatsappNumber,
    storeIcon,
    backgroundImage,
    package: pkg
  } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'name, email, password are required' });
  }

  let stores = [];
  try {
    const raw = fs.readFileSync(storesFile, 'utf8');
    stores = JSON.parse(raw || '[]');
  } catch (e) {
    stores = [];
  }

  const newStore = {
    id: Date.now().toString(),
    name,
    description: description || '',
    category: category || '',
    location: location || '',
    email,
    password,
    whatsappNumber: whatsappNumber || '',
    storeIcon: storeIcon || '',
    backgroundImage: backgroundImage || '',
    package: pkg || 'Basic',
    createdAt: new Date().toISOString()
  };

  stores.push(newStore);
  try {
    fs.writeFileSync(storesFile, JSON.stringify(stores, null, 2), 'utf8');
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to save store' });
  }

  return res.json({ success: true, store: newStore });
});

// List stores
app.get('/api/admin/stores', (req, res) => {
  try {
    const raw = fs.readFileSync(storesFile, 'utf8');
    const stores = JSON.parse(raw || '[]');
    return res.json({ success: true, stores });
  } catch (e) {
    return res.json({ success: true, stores: [] });
  }
});

// Update store
app.put('/api/admin/stores/:id', (req, res) => {
  const { id } = req.params;
  let stores = [];
  try {
    const raw = fs.readFileSync(storesFile, 'utf8');
    stores = JSON.parse(raw || '[]');
  } catch (e) {
    stores = [];
  }
  const idx = stores.findIndex((s) => String(s.id) === String(id));
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Store not found' });
  }

  const allowed = ['name','description','category','location','email','password','whatsappNumber','storeIcon','backgroundImage','package'];
  const updated = { ...stores[idx] };
  for (const key of allowed) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
      updated[key] = req.body[key];
    }
  }
  updated.updatedAt = new Date().toISOString();
  stores[idx] = updated;
  try {
    fs.writeFileSync(storesFile, JSON.stringify(stores, null, 2), 'utf8');
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to update store' });
  }
  return res.json({ success: true, store: updated });
});

// Store login (by email or id) for store users
app.post('/api/store/login', (req, res) => {
  const { identifier, password } = req.body || {};
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'identifier and password are required' });
  }
  let stores = [];
  try {
    const raw = fs.readFileSync(storesFile, 'utf8');
    stores = JSON.parse(raw || '[]');
  } catch (e) {
    stores = [];
  }
  const store = stores.find((s) => (String(s.id) === String(identifier) || String(s.email).toLowerCase() === String(identifier).toLowerCase()) && s.password === password);
  if (!store) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  return res.json({ success: true, storeId: store.id, store: { id: store.id, name: store.name, email: store.email } });
});

// Public fetch single store by id
app.get('/api/stores/:id', (req, res) => {
  const { id } = req.params;
  try {
    const raw = fs.readFileSync(storesFile, 'utf8');
    const stores = JSON.parse(raw || '[]');
    const store = stores.find((s) => String(s.id) === String(id));
    if (!store) return res.status(404).json({ success: false, message: 'Store not found' });
    return res.json({ success: true, store });
  } catch (e) {
    return res.status(500).json({ success: false, message: 'Failed to load store' });
  }
});

app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
});


