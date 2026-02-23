import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services/productService';
import ProductCard from '../components/shop/ProductCard';
import { CATEGORIES } from '../utils/helpers';
import { Icon } from '../components/common/Icons';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';

  useEffect(() => {
    setLoading(true);
    const params = { available: true };
    if (activeCategory !== 'all') params.category = activeCategory;
    productService.getAll(params)
      .then(res => setProducts(res.data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-4" style={{ minHeight: '80vh' }}>
      <div className="container">
        <div className="section-header mb-4">
          <h2>Our Collection</h2>
          <p>Fresh blooms, plants, and more — for every occasion</p>
          <div className="section-divider"></div>
        </div>

        {/* Search */}
        <div className="row justify-content-center mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text" style={{ background: 'var(--white)', border: '1.5px solid var(--champagne)', borderRight: 'none', borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)', paddingLeft: '0.9rem' }}>
                <Icon.Search size={16} color="var(--petal)" />
              </span>
              <input
                className="form-control"
                style={{ borderLeft: 'none' }}
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="category-tabs">
          <button className={`category-tab ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setSearchParams({})}>
            All
          </button>
          {CATEGORIES.filter(c => c.value !== 'bouquet-wrappers').map(cat => (
            <button key={cat.value} className={`category-tab ${activeCategory === cat.value ? 'active' : ''}`}
              onClick={() => setSearchParams({ category: cat.value })}>
              {cat.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="petal-loader"></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-5" style={{ color: 'var(--text-light)' }}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" style={{ opacity: 0.3 }}>
              <circle cx="26" cy="26" r="18" stroke="#d4637a" strokeWidth="3" fill="none" />
              <line x1="39" y1="39" x2="54" y2="54" stroke="#d4637a" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <p className="mt-2">No products found</p>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map(product => (
              <div key={product._id} className="col-6 col-md-4 col-lg-3">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}