import { useCart } from '../../context/CartContext';
import { formatPrice, parseDriveUrl } from '../../utils/helpers';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutModal from '../shop/CheckoutModal';
import { Icon } from './Icons';

export default function CartSidebar({ show, onClose }) {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const navigate = useNavigate();

  const handleCheckoutSuccess = (result) => {
    clearCart();
    onClose();
    navigate('/profile', { state: { newOrder: result } });
  };

  const imgFallback = (name) => `https://placehold.co/80x80/fdeef2/d4637a?text=${encodeURIComponent(name[0])}`;

  return (
    <>
      {show && <div className="offcanvas-backdrop fade show" onClick={onClose} style={{ zIndex: 1044 }}></div>}

      <div className={`offcanvas offcanvas-end cart-offcanvas ${show ? 'show' : ''}`}
        style={{ zIndex: 1045, visibility: show ? 'visible' : 'hidden', width: 'min(380px, 100vw)' }}>

        <div className="offcanvas-header">
          <div className="d-flex align-items-center gap-2">
            <Icon.BagHeart size={20} color="var(--rose)" />
            <h5 className="offcanvas-title mb-0">Your Basket</h5>
          </div>
          <button
            onClick={onClose}
            style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid var(--champagne)', background: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-mid)' }}
          >
            <Icon.X size={16} />
          </button>
        </div>

        <div className="offcanvas-body d-flex flex-column">
          {items.length === 0 ? (
            <div className="text-center py-5">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: 0.35 }}>
                <circle cx="32" cy="32" r="28" fill="#f5c6d0" />
                <path d="M20 20h24l-3 18H23L20 20z" fill="#d4637a" opacity=".5" />
                <circle cx="26" cy="44" r="3" fill="#d4637a" opacity=".5" />
                <circle cx="38" cy="44" r="3" fill="#d4637a" opacity=".5" />
              </svg>
              <p className="mt-3 mb-2" style={{ color: 'var(--text-light)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Your basket is empty</p>
              <button className="btn btn-sm btn-primary" onClick={onClose}>Browse Shop</button>
            </div>
          ) : (
            <>
              <div className="flex-grow-1 overflow-auto">
                {items.map(({ product, quantity }) => {
                  const imgSrc = parseDriveUrl(product.imageUrl) || imgFallback(product.name);
                  return (
                    <div key={product._id} className="cart-item d-flex align-items-center gap-3">
                      <img src={imgSrc} alt={product.name} onError={e => e.target.src = imgFallback(product.name)} />
                      <div className="flex-grow-1 min-w-0">
                        <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</div>
                        <div style={{ color: 'var(--rose)', fontWeight: 700, fontSize: '0.85rem' }}>{formatPrice(product.price)}</div>
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <button className="qty-btn" onClick={() => updateQty(product._id, quantity - 1)}>
                          <Icon.Minus size={12} />
                        </button>
                        <span className="qty-display">{quantity}</span>
                        <button className="qty-btn" onClick={() => updateQty(product._id, quantity + 1)}>
                          <Icon.Plus size={12} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(product._id)}
                        style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--champagne)', background: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-light)', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#f8d7da'; e.currentTarget.style.color = 'var(--rose)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'var(--text-light)'; }}
                      >
                        <Icon.X size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="mt-auto pt-3" style={{ borderTop: '1px solid var(--champagne)' }}>
                <div className="d-flex justify-content-between mb-3">
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Total</span>
                  <span style={{ color: 'var(--rose)', fontWeight: 700, fontSize: '1.2rem' }}>{formatPrice(total)}</span>
                </div>
                <button className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" onClick={() => setShowCheckout(true)}>
                  <Icon.BagCheck size={18} color="white" />
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {showCheckout && (
        <CheckoutModal
          items={items}
          total={total}
          onClose={() => setShowCheckout(false)}
          onSuccess={handleCheckoutSuccess}
        />
      )}
    </>
  );
}