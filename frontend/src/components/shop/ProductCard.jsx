import { parseDriveUrl, CATEGORY_LABELS } from '../../utils/helpers';
import { useCart } from '../../context/CartContext';
import { useConfig } from '../../context/ConfigContext';
import { Icon } from '../common/Icons';

export default function ProductCard({ product, onPreview }) {
  const { addItem, items } = useCart();
  const { formatPrice } = useConfig();
  const cartItem = items.find(i => i.product._id === product._id);
  const outOfStock = product.quantity === 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!outOfStock) addItem(product);
  };

  const imgFallback = `https://placehold.co/400x300/fdeef2/d4637a?text=${encodeURIComponent(product.name)}`;
  const imgSrc = parseDriveUrl(product.imageUrl) || imgFallback;

  return (
    <div className="bloom-card product-card h-100">
      <div className="card-img-wrapper" onClick={() => onPreview && onPreview(imgSrc)}>
        <img
          src={imgSrc}
          alt={product.imageAlt || product.name}
          className="zoom-trigger"
          onError={e => e.target.src = imgFallback}
        />
        <div className="image-hover-overlay">
          <i className="bi bi-zoom-in" style={{ fontSize: '1.5rem', color: 'white' }}></i>
        </div>
        <span className="qty-badge">{product.quantity} left</span>
        {outOfStock && (
          <div className="out-of-stock-overlay">
            <span className="badge" style={{ background: 'var(--rose)', fontSize: '0.8rem' }}>Out of Stock</span>
          </div>
        )}
      </div>
      <div className="card-body">
        <div className="product-category mb-1">{CATEGORY_LABELS[product.category] || product.category}</div>
        <div className="product-name mb-1">{product.name}</div>
        {product.description && (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginBottom: '0.6rem', lineHeight: 1.5 }}>
            {product.description.length > 70 ? product.description.slice(0, 70) + '…' : product.description}
          </p>
        )}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="product-price">{formatPrice(product.price)}</div>
          <button
            className="btn btn-sm btn-primary d-flex align-items-center gap-1"
            onClick={handleAdd}
            disabled={outOfStock}
            style={{ padding: '0.35rem 0.85rem' }}
          >
            {cartItem
              ? <><Icon.BagCheck size={14} color="white" /><span>{cartItem.quantity}</span></>
              : <><Icon.BagPlus size={14} color="white" /><span>Add</span></>
            }
          </button>
        </div>
      </div>
    </div>
  );
}