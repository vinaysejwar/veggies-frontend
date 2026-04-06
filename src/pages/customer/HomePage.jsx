import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, dailyRatesAPI } from '../../services/api';

const features = [
  { emoji: '🏭', title: 'Cold Storage', desc: 'State-of-the-art cold storage facility maintaining optimal temperature for banana preservation' },
  { emoji: '🌡️', title: 'Ripening Chambers', desc: 'Scientific ripening process with controlled ethylene gas chambers for perfect results' },
  { emoji: '🚚', title: 'Fast Delivery', desc: 'Same-day delivery across Indore for wholesale and retail orders' },
  { emoji: '💰', title: 'Best Prices', desc: 'Competitive wholesale & retail pricing with volume discounts and credit facility' },
];

export default function HomePage() {
  const [rates, setRates] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    dailyRatesAPI.today().then(r => setRates(r.data.rates)).catch(() => {});
    productsAPI.list().then(r => setProducts(r.data.products?.slice(0, 3) || [])).catch(() => {});
  }, []);

  const getEmoji = (cat) => {
    if (cat === 'GREEN') return '🥒';
    if (cat === 'YELLOW') return '🍌';
    return '⭐';
  };

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="container">
          <h1>
            Premium <span>Banana</span><br />Cold Store & Supply
          </h1>
          <p>
            Indore's trusted partner for banana procurement, cold storage, ripening, 
            and wholesale/retail distribution. From farm-fresh green to perfectly ripened yellow.
          </p>
          <div className="flex gap-4">
            <Link to="/order" className="btn btn-primary btn-lg">Place an Order</Link>
            <Link to="/products" className="btn btn-outline btn-lg" style={{background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)'}}>
              View Products
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Rates */}
      {rates.length > 0 && (
        <section className="section" style={{background: 'white'}}>
          <div className="container">
            <h2 className="section-title text-center">📊 Today's Banana Rates</h2>
            <p className="section-subtitle text-center">Updated daily – transparent pricing for all varieties</p>
            <div className="rates-grid">
              {rates.map((rate) => (
                <div key={rate.id} className="rate-card">
                  <div className="emoji">{getEmoji(rate.product?.category)}</div>
                  <h4>{rate.product?.name}</h4>
                  <div className="rate-price">₹{Number(rate.rate_per_kg).toFixed(0)}<span style={{fontSize: '0.9rem', fontWeight: 400, color: 'var(--gray-400)'}}>/kg</span></div>
                  <div className="rate-wholesale">Wholesale: ₹{Number(rate.wholesale_rate).toFixed(0)}/kg</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="section">
        <div className="container">
          <h2 className="section-title text-center">Why Choose VVS?</h2>
          <p className="section-subtitle text-center">End-to-end banana supply chain management</p>
          <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24}}>
            {features.map((f, i) => (
              <div key={i} className="card" style={{textAlign: 'center', padding: 32}}>
                <div style={{fontSize: '3rem', marginBottom: 16}}>{f.emoji}</div>
                <h3 style={{fontWeight: 700, marginBottom: 8}}>{f.title}</h3>
                <p style={{color: 'var(--gray-500)', fontSize: '0.9rem'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products.length > 0 && (
        <section className="section" style={{background: 'white'}}>
          <div className="container">
            <h2 className="section-title text-center">🍌 Our Banana Varieties</h2>
            <p className="section-subtitle text-center">Premium quality bananas for every need</p>
            <div className="product-grid">
              {products.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="product-card-img">{getEmoji(p.category)}</div>
                  <div className="product-card-body">
                    <h3>{p.name}</h3>
                    <p className="description">{p.description}</p>
                    <div className="price">₹{Number(p.price_per_kg).toFixed(0)} <span>/kg</span></div>
                  </div>
                  <div className="product-card-footer">
                    <span className={`badge badge-${p.category?.toLowerCase()}`}>{p.category}</span>
                    <span className="text-sm" style={{color: 'var(--gray-500)'}}>
                      Stock: {Number(p.stock?.quantity_kg || 0).toFixed(0)} kg
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign: 'center', marginTop: 32}}>
              <Link to="/products" className="btn btn-primary">View All Products →</Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section" style={{background: 'linear-gradient(135deg, var(--green-700), var(--green-900))', color: 'white', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{fontSize: '2.2rem', fontWeight: 800, marginBottom: 12}}>Ready to Order?</h2>
          <p style={{opacity: 0.8, maxWidth: 500, margin: '0 auto 32px', fontSize: '1.05rem'}}>
            Whether you need 5 kg for your family or 5 tons for your business, we've got you covered.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/order" className="btn btn-primary btn-lg">Place Order Now</Link>
            <a href="https://wa.me/919111919979" target="_blank" rel="noopener" className="btn btn-lg" style={{background: '#25D366', color: 'white'}}>
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
