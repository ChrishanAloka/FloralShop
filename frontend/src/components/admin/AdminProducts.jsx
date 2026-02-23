import { useEffect, useState } from 'react';
import { productService } from '../../services/productService';
import { useConfig } from '../../context/ConfigContext';
import { CATEGORIES } from '../../utils/helpers';
import { Icon } from '../common/Icons';
import { ImageUploader } from '../common/ImageUploader';

const empty = {
  name: '', description: '', category: 'fresh-flowers',
  price: '', quantity: '', imageUrl: '', driveFileId: '',
  imageAlt: '', isAvailable: true, isFeatured: false, tags: '',
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const { formatPrice, currencySymbol } = useConfig();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [filterCat, setFilterCat] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchProducts(); }, [filterCat]);

  const fetchProducts = () => {
    setLoading(true);
    productService.getAll(filterCat ? { category: filterCat } : {})
      .then(r => setProducts(r.data)).finally(() => setLoading(false));
  };

  const openAdd = () => { setEditProduct(null); setForm(empty); setShowForm(true); };

  const openEdit = (p) => {
    setEditProduct(p._id);
    setForm({ ...empty, ...p, tags: p.tags?.join(', ') || '', driveFileId: p.driveFileId || '' });
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const data = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    try {
      if (editProduct) await productService.update(editProduct, data);
      else await productService.create(data);
      setShowForm(false);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    await productService.delete(id);
    setDeleteConfirm(null);
    fetchProducts();
  };

  return (
    <div>
      {/* Header row */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon.Flower size={22} color="var(--rose)" />
          Products
        </h4>
        <div className="d-flex gap-2 flex-wrap">
          <select className="form-select form-select-sm" style={{ width: 'auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <button className="btn btn-sm btn-primary d-flex align-items-center gap-1" onClick={openAdd}>
            <Icon.Plus size={15} color="white" /> Add Product
          </button>
        </div>
      </div>

      {/* Product grid */}
      {loading ? <div className="petal-loader" /> : (
        <div className="row g-3">
          {products.map(p => (
            <div key={p._id} className="col-12 col-md-6">
              <div className="bloom-card p-3 d-flex gap-3 align-items-center">
                {/* Thumbnail */}
                <img
                  src={p.imageUrl || `https://placehold.co/80x80/fdeef2/d4637a?text=${encodeURIComponent(p.name[0])}`}
                  alt={p.name}
                  style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 10, flexShrink: 0, border: '1.5px solid var(--champagne)' }}
                  onError={e => e.target.src = `https://placehold.co/80x80/fdeef2/d4637a?text=${encodeURIComponent(p.name[0])}`}
                />
                <div className="flex-grow-1 min-w-0">
                  <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>{p.category.replace(/-/g, ' ')}</div>
                  <div className="d-flex flex-wrap gap-2 mt-1 align-items-center">
                    <span style={{ fontSize: '0.82rem', color: 'var(--rose)', fontWeight: 700 }}>{formatPrice(p.price)}</span>
                    <span style={{ fontSize: '0.74rem', color: 'var(--text-mid)' }}>Qty: {p.quantity}</span>
                    {p.imageUrl && (
                      <span style={{ fontSize: '0.68rem', background: '#e8f0fe', color: '#1a73e8', padding: '1px 6px', borderRadius: 8, display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
                        <Icon.Google size={9} /> Drive
                      </span>
                    )}
                    {!p.isAvailable && <span style={{ fontSize: '0.68rem', background: '#f8d7da', color: '#721c24', padding: '1px 6px', borderRadius: 8 }}>Hidden</span>}
                    {p.isFeatured && <span style={{ fontSize: '0.68rem', background: 'var(--champagne)', color: 'var(--gold)', padding: '1px 6px', borderRadius: 8 }}>★ Featured</span>}
                  </div>
                </div>
                <div className="d-flex gap-1 flex-shrink-0">
                  <button className="btn btn-sm btn-outline-primary d-flex align-items-center" style={{ padding: '0.28rem 0.55rem', borderRadius: 8 }} onClick={() => openEdit(p)}>
                    <Icon.Pencil size={14} />
                  </button>
                  <button className="btn btn-sm d-flex align-items-center" style={{ padding: '0.28rem 0.55rem', borderRadius: 8, border: '1.5px solid #f8d7da', color: '#dc3545' }} onClick={() => setDeleteConfirm(p._id)}>
                    <Icon.Trash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Form Modal ────────────────────────────────────────── */}
      {showForm && (
        <div className="modal show d-block" style={{ background: 'rgba(30,18,28,0.45)', backdropFilter: 'blur(4px)', zIndex: 1500 }}>
          <div className="modal-dialog modal-dialog-scrollable modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 16 }}>
              {/* Modal header */}
              <div className="modal-header" style={{ background: 'var(--blush-light)', border: 'none', borderRadius: '16px 16px 0 0', padding: '1rem 1.4rem' }}>
                <div className="d-flex align-items-center gap-2">
                  <Icon.Flower size={20} color="var(--rose)" />
                  <h5 className="modal-title mb-0" style={{ fontFamily: 'var(--font-display)' }}>
                    {editProduct ? 'Edit Product' : 'Add New Product'}
                  </h5>
                </div>
                <button onClick={() => setShowForm(false)} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--champagne)', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <Icon.X size={14} color="var(--text-mid)" />
                </button>
              </div>

              {/* Modal body */}
              <div className="modal-body p-4">
                <form onSubmit={handleSave}>
                  <div className="row g-3">

                    {/* ── Image uploader (Drive) ── */}
                    <div className="col-12">
                      <ImageUploader
                        label="Product Image → saved to Google Drive"
                        value={form.imageUrl}
                        fileId={form.driveFileId}
                        onChange={({ imageUrl, fileId }) =>
                          setForm(f => ({ ...f, imageUrl: imageUrl || '', driveFileId: fileId || '' }))
                        }
                      />
                    </div>

                    {/* ── Name ── */}
                    <div className="col-12">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Product Name *</label>
                      <input className="form-control" required value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>

                    {/* ── Category / Price / Qty ── */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Category *</label>
                      <select className="form-select" value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}>
                        {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Price ({currencySymbol}) *</label>
                      <input className="form-control" type="number" step="0.01" min="0" required
                        value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Quantity *</label>
                      <input className="form-control" type="number" min="0" required
                        value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                    </div>

                    {/* ── Description ── */}
                    <div className="col-12">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Description</label>
                      <textarea className="form-control" rows={2} value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })} />
                    </div>

                    {/* ── Tags ── */}
                    <div className="col-12">
                      <label className="form-label fw-semibold" style={{ fontSize: '0.85rem' }}>Tags</label>
                      <input className="form-control" placeholder="wedding, romantic, spring"
                        value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
                    </div>

                    {/* ── Toggles ── */}
                    <div className="col-12 d-flex gap-4">
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="chkAvail"
                          checked={form.isAvailable} onChange={e => setForm({ ...form, isAvailable: e.target.checked })} />
                        <label className="form-check-label" htmlFor="chkAvail" style={{ fontSize: '0.85rem' }}>Available in shop</label>
                      </div>
                      <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="chkFeat"
                          checked={form.isFeatured} onChange={e => setForm({ ...form, isFeatured: e.target.checked })} />
                        <label className="form-check-label" htmlFor="chkFeat" style={{ fontSize: '0.85rem' }}>★ Featured on home page</label>
                      </div>
                    </div>
                  </div>

                  {/* Save button */}
                  <button
                    className="btn btn-primary w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
                    type="submit" disabled={saving}
                  >
                    {saving ? (
                      <><Spin size={16} color="white" />Saving…</>
                    ) : (
                      <><Icon.Check size={16} color="white" />{editProduct ? 'Save Changes' : 'Add Product'}</>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteConfirm && (
        <div className="modal show d-block" style={{ background: 'rgba(30,18,28,0.45)', zIndex: 1600 }}>
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 360 }}>
            <div className="modal-content border-0" style={{ borderRadius: 16 }}>
              <div className="modal-body p-4 text-center">
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#fff5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                  <Icon.Trash size={24} color="#dc3545" />
                </div>
                <h5 style={{ fontFamily: 'var(--font-display)' }}>Delete this product?</h5>
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>This cannot be undone. The Drive image will remain in your folder.</p>
                <div className="d-flex gap-2 justify-content-center">
                  <button className="btn btn-outline-primary btn-sm" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                  <button className="btn btn-danger btn-sm d-flex align-items-center gap-1" onClick={() => handleDelete(deleteConfirm)}>
                    <Icon.Trash size={14} color="white" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Inline spinner for the save button
function Spin({ size = 18, color = 'var(--rose)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 12a9 9 0 1 1-6.219-8.56">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.85s" repeatCount="indefinite" />
      </path>
    </svg>
  );
}