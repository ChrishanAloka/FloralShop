import { useEffect, useState } from 'react';
import { productService } from '../services/productService';
import { useConfig } from '../context/ConfigContext';
import { parseDriveUrl } from '../utils/helpers';
import CheckoutModal from '../components/shop/CheckoutModal';
import Icon2 from '../assets/icon.png';

export default function CustomBouquetPage() {
  const [flowers, setFlowers] = useState([]);
  const { formatPrice } = useConfig();
  const [wrappers, setWrappers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFlowers, setSelectedFlowers] = useState(() => {
    const saved = localStorage.getItem('custom_bouquet_flowers');
    return saved ? JSON.parse(saved) : {};
  });
  const [selectedWrapper, setSelectedWrapper] = useState(() => {
    return localStorage.getItem('custom_bouquet_wrapper') || null;
  });
  const [note, setNote] = useState(() => {
    return localStorage.getItem('custom_bouquet_note') || '';
  });
  const [showCheckout, setShowCheckout] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    Promise.all([productService.getFreshFlowers(), productService.getWrappers()])
      .then(([fRes, wRes]) => { setFlowers(fRes.data); setWrappers(wRes.data); })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem('custom_bouquet_flowers', JSON.stringify(selectedFlowers));
  }, [selectedFlowers]);

  useEffect(() => {
    if (selectedWrapper) localStorage.setItem('custom_bouquet_wrapper', selectedWrapper);
    else localStorage.removeItem('custom_bouquet_wrapper');
  }, [selectedWrapper]);

  useEffect(() => {
    localStorage.setItem('custom_bouquet_note', note);
  }, [note]);

  const setFlowerQty = (productId, qty) => {
    setSelectedFlowers(prev => {
      if (qty <= 0) { const n = { ...prev }; delete n[productId]; return n; }
      return { ...prev, [productId]: qty };
    });
  };

  const totalFlowers = Object.values(selectedFlowers).reduce((a, b) => a + b, 0);

  const flowerCost = flowers.reduce((sum, f) => {
    const qty = selectedFlowers[f._id] || 0;
    return sum + f.price * qty;
  }, 0);

  const wrapperProduct = wrappers.find(w => w._id === selectedWrapper);
  const wrapperCost = wrapperProduct?.price || 0;
  const total = flowerCost + wrapperCost;

  const canCheckout = totalFlowers > 0 && selectedWrapper;

  const getCustomBouquetPayload = () => ({
    flowers: Object.entries(selectedFlowers).map(([productId, quantity]) => {
      const f = flowers.find(fl => fl._id === productId);
      return { product: productId, name: f?.name, quantity, pricePerStem: f?.price };
    }),
    wrapper: { product: selectedWrapper, name: wrapperProduct?.name, price: wrapperCost, imageUrl: wrapperProduct?.imageUrl },
    note,
  });

  if (loading) return <div className="petal-loader" style={{ minHeight: '60vh' }}></div>;

  return (
    <div className="py-4" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="section-header mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h2><img src={Icon2} alt="Build Your Dream Bouquet Logo" style={{ height: '60px', width: 'auto', marginBottom: '0.8rem' }} /> Build Your Bouquet</h2>
            {(totalFlowers > 0 || selectedWrapper || note) && (
              <button
                className="btn btn-outline-danger btn-sm rounded-pill px-3"
                onClick={() => {
                  if (window.confirm('Clear your current custom bouquet design?')) {
                    setSelectedFlowers({});
                    setSelectedWrapper(null);
                    setNote('');
                  }
                }}
              >
                Clear Design
              </button>
            )}
          </div>
          <p>Choose your flowers and wrapper to create a personalised arrangement</p>
          <div className="section-divider"></div>
        </div>

        <div className="row g-4">
          {/* Left: Builder */}
          <div className="col-lg-8">
            {/* Step 1: Flowers */}
            <div className="bloom-card p-4 mb-4">
              <h5 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '1.2rem' }}>
                Step 1 — Choose Your Flowers
                <span style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontFamily: 'var(--font-body)', marginLeft: '0.8rem' }}>
                  {totalFlowers} stem{totalFlowers !== 1 ? 's' : ''} selected
                </span>
              </h5>
              {flowers.length === 0 ? (
                <p style={{ color: 'var(--text-light)' }}>No flowers available at the moment.</p>
              ) : flowers.map(flower => {
                const qty = selectedFlowers[flower._id] || 0;
                const outOfStock = flower.quantity === 0;
                const imgSrc = parseDriveUrl(flower.imageUrl) || `https://placehold.co/80x80/fdeef2/d4637a?text=${encodeURIComponent(flower.name[0])}`;
                return (
                  <div key={flower._id} className={`flower-selector-item ${qty > 0 ? 'selected' : ''} ${outOfStock ? 'opacity-50' : ''}`}>
                    <img
                      src={imgSrc}
                      alt={flower.name}
                      className="zoom-trigger"
                      onClick={() => setPreviewImage(imgSrc)}
                      onError={e => e.target.src = `https://placehold.co/80x80/fdeef2/d4637a?text=${encodeURIComponent(flower.name[0])}`}
                    />
                    <div className="flex-grow-1">
                      <div style={{ fontWeight: 600, color: 'var(--text-dark)', fontSize: '0.92rem' }}>{flower.name}</div>
                      <div style={{ color: 'var(--rose)', fontSize: '0.82rem', fontWeight: 600 }}>{formatPrice(flower.price)}/stem</div>
                      {outOfStock && <span style={{ fontSize: '0.7rem', color: '#dc3545' }}>Out of stock</span>}
                    </div>
                    <div className="qty-control">
                      <button className="qty-btn" disabled={outOfStock || qty === 0} onClick={() => setFlowerQty(flower._id, qty - 1)}>−</button>
                      <span className="qty-display">{qty}</span>
                      <button className="qty-btn" disabled={outOfStock || qty >= flower.quantity} onClick={() => setFlowerQty(flower._id, qty + 1)}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Step 2: Wrapper */}
            <div className="bloom-card p-4 mb-4">
              <h5 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '1.2rem' }}>
                Step 2 — Choose a Wrapper
              </h5>
              {wrappers.length === 0 ? (
                <p style={{ color: 'var(--text-light)' }}>No wrappers available at the moment.</p>
              ) : (
                <div className="wrapper-grid">
                  {wrappers.map(wrapper => {
                    const imgSrc = parseDriveUrl(wrapper.imageUrl) || `https://placehold.co/120x120/fdeef2/d4637a?text=${encodeURIComponent(wrapper.name[0])}`;
                    return (
                      <div key={wrapper._id} className={`wrapper-option ${selectedWrapper === wrapper._id ? 'selected' : ''}`}>
                        <img
                          src={imgSrc}
                          alt={wrapper.name}
                          className="zoom-trigger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(imgSrc);
                          }}
                          onError={e => e.target.src = `https://placehold.co/120x120/fdeef2/d4637a?text=${encodeURIComponent(wrapper.name[0])}`}
                        />
                        <div className="p-2 text-center" style={{ cursor: 'pointer' }} onClick={() => setSelectedWrapper(wrapper._id)}>
                          <p className="mb-0">{wrapper.name}</p>
                          <span style={{ color: 'var(--rose)', fontWeight: 600, fontSize: '0.8rem' }}>{formatPrice(wrapper.price)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Note */}
            <div className="bloom-card p-4">
              <h5 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)', marginBottom: '1rem' }}>Step 3 — Any Special Requests?</h5>
              <textarea className="form-control" rows={3} placeholder="E.g. 'Please add extra greenery' or 'Make it pink-dominant'..." value={note} onChange={e => setNote(e.target.value)} />
            </div>
          </div>

          {/* Right: Preview */}
          <div className="col-lg-4">
            <div className="bouquet-preview">
              {/* <div className="preview-emoji">💐</div> */}
              <img src={Icon2} alt="Build Your Dream Bouquet Logo" style={{ height: '100px', width: 'auto' }} />
              <h5 style={{ fontFamily: 'var(--font-display)', margin: '0.8rem 0 0.3rem', color: 'var(--text-dark)' }}>Your Bouquet</h5>

              {totalFlowers === 0 ? (
                <p style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>Select flowers to get started</p>
              ) : (
                <div style={{ textAlign: 'left', marginTop: '1rem' }}>
                  {Object.entries(selectedFlowers).map(([id, qty]) => {
                    const f = flowers.find(fl => fl._id === id);
                    if (!f) return null;
                    return (
                      <div key={id} className="d-flex justify-content-between" style={{ fontSize: '0.82rem', padding: '0.25rem 0', borderBottom: '1px solid var(--champagne)' }}>
                        <span style={{ color: 'var(--text-mid)' }}>🌸 {f.name} ×{qty}</span>
                        <span style={{ color: 'var(--rose)', fontWeight: 600 }}>{formatPrice(f.price * qty)}</span>
                      </div>
                    );
                  })}
                  {wrapperProduct && (
                    <div className="d-flex justify-content-between" style={{ fontSize: '0.82rem', padding: '0.25rem 0', borderBottom: '1px solid var(--champagne)' }}>
                      <span style={{ color: 'var(--text-mid)' }}>🎀 {wrapperProduct.name}</span>
                      <span style={{ color: 'var(--rose)', fontWeight: 600 }}>{formatPrice(wrapperCost)}</span>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mt-2 pt-1">
                    <strong style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>Total</strong>
                    <strong style={{ color: 'var(--rose)', fontSize: '1.1rem' }}>{formatPrice(total)}</strong>
                  </div>
                </div>
              )}

              {!canCheckout && (
                <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '1rem' }}>
                  {totalFlowers === 0 ? '🌸 Add some flowers' : '🎀 Choose a wrapper'} to continue
                </p>
              )}

              <button
                className="btn btn-primary w-100 mt-3"
                disabled={!canCheckout}
                onClick={() => setShowCheckout(true)}
              >
                <i className="bi bi-bag-check me-2"></i>Order My Bouquet
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          items={[]}
          total={total}
          customBouquet={getCustomBouquetPayload()}
          onClose={() => setShowCheckout(false)}
          onSuccess={() => {
            setSelectedFlowers({});
            setSelectedWrapper(null);
            setNote('');
          }}
        />
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="image-preview-overlay" onClick={() => setPreviewImage(null)}>
          <div className="image-preview-content" onClick={e => e.stopPropagation()}>
            <button className="image-preview-close" onClick={() => setPreviewImage(null)}>
              <i className="bi bi-x-lg"></i>
            </button>
            <img src={previewImage} alt="Preview" />
          </div>
        </div>
      )}
    </div>
  );
}