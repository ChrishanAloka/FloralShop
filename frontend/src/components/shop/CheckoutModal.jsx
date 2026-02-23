import { useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../context/AuthContext';
import WhatsAppModal from '../common/WhatsAppModal';
import { Icon } from '../common/Icons';

export default function CheckoutModal({ items, total, onClose, onSuccess, customBouquet = null }) {
  const { user, loginWithToken } = useAuth();
  const { formatPrice } = useConfig();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [waResult, setWaResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) { setError('Name and phone are required'); return; }
    setLoading(true); setError('');
    try {
      const orderData = customBouquet
        ? { customerName: form.name, customerPhone: form.phone, orderType: 'custom-bouquet', customBouquet, deliveryNote: form.note }
        : {
          customerName: form.name, customerPhone: form.phone, orderType: 'standard',
          deliveryNote: form.note,
          items: items.map(({ product, quantity }) => ({ product: product._id, name: product.name, price: product.price, quantity, imageUrl: product.imageUrl })),
        };

      const res = await orderService.create(orderData);
      const { token, customerId, whatsappUrl, webWhatsappUrl } = res.data;
      if (token) {
        if (!user) {
          loginWithToken(token, { id: customerId, name: form.name, phone: form.phone, role: 'customer' });
        } else if (!user.phone) {
          // Update local user state if phone was just added
          loginWithToken(token, { ...user, phone: form.phone });
        }
      }
      setWaResult({ whatsappUrl, webWhatsappUrl, customerId, token });
      onSuccess && onSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  if (waResult) return <WhatsAppModal show onClose={onClose} {...waResult} />;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: 'rgba(58,37,53,0.4)', backdropFilter: 'blur(4px)', zIndex: 1100 }}>
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: 'var(--radius)' }}>
          <div className="modal-header" style={{ background: 'var(--blush-light)', border: 'none', borderRadius: 'var(--radius) var(--radius) 0 0', padding: '1.2rem 1.5rem' }}>
            <div className="d-flex align-items-center gap-2">
              <Icon.BagCheck size={22} color="var(--rose)" />
              <h5 className="modal-title mb-0" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>Complete Your Order</h5>
            </div>
            <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: '50%', border: '1.5px solid var(--champagne)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-mid)' }}>
              <Icon.X size={14} />
            </button>
          </div>

          <div className="modal-body p-4">
            {/* Order summary */}
            <div className="checkout-summary mb-3">
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
                Order Summary
              </div>
              {customBouquet ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-mid)' }}>
                  <div>Custom Bouquet — {customBouquet.flowers?.reduce((s, f) => s + f.quantity, 0)} flowers</div>
                  {customBouquet.wrapper?.name && <div>Wrapper: {customBouquet.wrapper.name}</div>}
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div key={product._id} className="d-flex justify-content-between" style={{ fontSize: '0.84rem', color: 'var(--text-mid)' }}>
                    <span>{product.name} × {quantity}</span>
                    <span>{formatPrice(product.price * quantity)}</span>
                  </div>
                ))
              )}
              <div className="d-flex justify-content-between mt-2 pt-2" style={{ borderTop: '1px solid rgba(212,99,122,0.15)' }}>
                <strong style={{ fontFamily: 'var(--font-display)' }}>Total</strong>
                <strong style={{ color: 'var(--rose)' }}>{formatPrice(total)}</strong>
              </div>
            </div>

            {error && (
              <div className="d-flex align-items-center gap-2 mb-3 p-2" style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#991b1b', fontSize: '0.84rem' }}>
                <Icon.Warning size={16} color="#991b1b" style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Google user banner */}
            {user?.avatar && (
              <div className="d-flex align-items-center gap-2 mb-3 p-2" style={{ background: 'var(--blush-light)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
                <img src={user.avatar} alt="" style={{ width: 24, height: 24, borderRadius: '50%' }} />
                <span style={{ color: 'var(--text-mid)' }}>Ordering as <strong>{user.name}</strong></span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Your Name *</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Enter your full name" />
              </div>
              <div className="mb-3">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                  Phone Number *
                </label>
                <div className="input-group">
                  <span className="input-group-text" style={{ background: 'var(--blush-light)', border: '1.5px solid var(--champagne)', borderRight: 'none' }}>
                    <Icon.Phone size={15} color="var(--petal)" />
                  </span>
                  <input className="form-control" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+1 234 567 8900" style={{ borderLeft: 'none' }} />
                </div>
                {user?.avatar && !user.phone && (
                  <div className="form-text d-flex align-items-center gap-1" style={{ color: 'var(--rose)', fontSize: '0.75rem' }}>
                    <Icon.Info size={12} color="var(--rose)" /> We need your number to send the order via WhatsApp
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="form-label" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Special Note (optional)</label>
                <textarea className="form-control" rows={2} value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} placeholder="Any special requests..."></textarea>
              </div>
              <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" type="submit" disabled={loading}>
                {loading ? (
                  <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite" /></path></svg>Placing Order...</>
                ) : (
                  <><Icon.Check size={17} color="white" />Place Order</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}