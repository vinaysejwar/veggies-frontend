import { useState, useEffect } from 'react';
import { productsAPI } from '../../services/api';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    productsAPI.list().then(r => {
      setProducts(r.data.products || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const getEmoji = (cat) => cat === 'GREEN' ? '🥒' : cat === 'YELLOW' ? '🍌' : '⭐';

  const filtered = filter === 'ALL' ? products : products.filter(p => p.category === filter);

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">🍌 Our Banana Products</h1>
        <p className="section-subtitle">Browse our complete range of premium banana varieties</p>

        <div className="filters-bar">
          {['ALL', 'GREEN', 'YELLOW', 'SPECIAL'].map((f) => (
            <button key={f} className={`filter-chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f === 'ALL' ? '🔄 All' : f === 'GREEN' ? '🥒 Green' : f === 'YELLOW' ? '🍌 Yellow' : '⭐ Special'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="emoji">🍌</div>
            <p>No products found in this category</p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((p) => (
              <div key={p.id} className="product-card">
                <div className="product-card-img">{getEmoji(p.category)}</div>
                <div className="product-card-body">
                  <div className="flex items-center gap-2" style={{marginBottom: 8}}>
                    <h3 style={{flex: 1}}>{p.name}</h3>
                    <span className={`badge badge-${p.category?.toLowerCase()}`}>{p.category}</span>
                  </div>
                  <p className="description">{p.description}</p>
                  <div className="flex items-center justify-between" style={{marginTop: 12}}>
                    <div className="price">₹{Number(p.price_per_kg).toFixed(0)} <span>/kg</span></div>
                    <div className="text-sm" style={{color: Number(p.stock?.quantity_kg || 0) > 0 ? 'var(--green-600)' : 'var(--red-500)'}}>
                      {Number(p.stock?.quantity_kg || 0) > 0 
                        ? `${Number(p.stock.quantity_kg).toFixed(0)} kg available` 
                        : 'Out of stock'}
                    </div>
                  </div>
                </div>
                <div className="product-card-footer">
                  <span className="text-sm" style={{color: 'var(--gray-400)'}}>Min order: {Number(p.min_order_kg)} kg</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
