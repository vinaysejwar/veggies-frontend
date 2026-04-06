import { useState, useEffect } from 'react';
import { productsAPI, ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function OrderPage() {
  const [products, setProducts] = useState([]);
  const [orderType, setOrderType] = useState('RETAIL');
  const [cart, setCart] = useState([]);
  const [form, setForm] = useState({ customer_name: '', phone_number: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    productsAPI.list().then(r => setProducts(r.data.products || [])).catch(() => {});
  }, []);

  const addToCart = (product) => {
    const existing = cart.find(c => c.product_id === product.id);
    if (existing) {
      setCart(cart.map(c => c.product_id === product.id ? { ...c, quantity_kg: c.quantity_kg + 1 } : c));
    } else {
      setCart([...cart, {
        product_id: product.id,
        product_name: product.name,
        price_per_kg: Number(product.price_per_kg),
        quantity_kg: orderType === 'WHOLESALE' ? 50 : 1,
      }]);
    }
  };

  const updateQty = (productId, qty) => {
    if (qty <= 0) {
      setCart(cart.filter(c => c.product_id !== productId));
    } else {
      setCart(cart.map(c => c.product_id === productId ? { ...c, quantity_kg: qty } : c));
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(c => c.product_id !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price_per_kg * item.quantity_kg, 0);
  const totalKg = cart.reduce((sum, item) => sum + item.quantity_kg, 0);
  let discount = 0;
  if (orderType === 'WHOLESALE') {
    if (totalKg >= 200) discount = subtotal * 0.10;
    else if (totalKg >= 50) discount = subtotal * 0.05;
  } else {
    if (totalKg >= 5) discount = subtotal * 0.05;
  }
  const total = subtotal - discount;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return toast.error('Please add items to your order');
    if (!form.customer_name || !form.phone_number) return toast.error('Please fill in your details');

    setSubmitting(true);
    try {
      const res = await ordersAPI.create({
        ...form,
        order_type: orderType,
        items: cart.map(c => ({ product_id: c.product_id, quantity_kg: c.quantity_kg })),
      });
      setOrderResult(res.data);
      setCart([]);
      setForm({ customer_name: '', phone_number: '', notes: '' });
      toast.success('Order placed successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  if (orderResult) {
    return (
      <section className="section">
        <div className="container" style={{maxWidth: 600}}>
          <div className="card" style={{textAlign: 'center', padding: 48}}>
            <div style={{fontSize: '4rem', marginBottom: 16}}>✅</div>
            <h2 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: 8}}>Order Placed!</h2>
            <p style={{color: 'var(--gray-500)', marginBottom: 24}}>
              Order <strong>{orderResult.order_number}</strong> has been received.<br/>
              We will contact you shortly on {orderResult.phone_number}.
            </p>
            <div className="card" style={{textAlign: 'left', padding: 20, background: 'var(--gray-50)'}}>
              <div className="flex justify-between" style={{marginBottom: 8}}>
                <span>Total Amount</span>
                <strong style={{fontSize: '1.2rem', color: 'var(--green-700)'}}>₹{orderResult.total_amount?.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between" style={{marginBottom: 8}}>
                <span>Type</span>
                <span className={`badge badge-${orderResult.order_type?.toLowerCase()}`}>{orderResult.order_type}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className="badge badge-pending">{orderResult.status}</span>
              </div>
            </div>
            <button className="btn btn-primary" style={{marginTop: 24}} onClick={() => setOrderResult(null)}>Place Another Order</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="section-title">🛒 Place Your Order</h1>
        <p className="section-subtitle">Select your banana type and quantity</p>

        {/* Order Type Tabs */}
        <div className="tabs">
          <button className={`tab ${orderType === 'RETAIL' ? 'active' : ''}`} onClick={() => setOrderType('RETAIL')}>
            🛍️ Retail Order
          </button>
          <button className={`tab ${orderType === 'WHOLESALE' ? 'active' : ''}`} onClick={() => setOrderType('WHOLESALE')}>
            📦 Wholesale Order
          </button>
        </div>

        <div className="grid" style={{gridTemplateColumns: '1fr 400px', gap: 32, alignItems: 'start'}}>
          {/* Product Selection */}
          <div>
            <h3 style={{fontWeight: 700, marginBottom: 16}}>Select Products</h3>
            <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16}}>
              {products.map((p) => {
                const inCart = cart.find(c => c.product_id === p.id);
                return (
                  <div key={p.id} className="card" style={{padding: 20, border: inCart ? '2px solid var(--banana-400)' : undefined}}>
                    <div className="flex items-center gap-3" style={{marginBottom: 12}}>
                      <span style={{fontSize: '2rem'}}>{p.category === 'GREEN' ? '🥒' : p.category === 'YELLOW' ? '🍌' : '⭐'}</span>
                      <div>
                        <h4 style={{fontWeight: 600, fontSize: '0.95rem'}}>{p.name}</h4>
                        <span className="text-sm" style={{color: 'var(--green-600)', fontWeight: 700}}>₹{Number(p.price_per_kg)}/kg</span>
                      </div>
                    </div>
                    {inCart ? (
                      <div className="flex items-center gap-2">
                        <button className="btn btn-outline btn-sm" onClick={() => updateQty(p.id, inCart.quantity_kg - (orderType === 'WHOLESALE' ? 10 : 1))}>−</button>
                        <input
                          type="number"
                          value={inCart.quantity_kg}
                          onChange={(e) => updateQty(p.id, Number(e.target.value))}
                          className="form-input"
                          style={{width: 80, textAlign: 'center', padding: '6px'}}
                          min="0"
                        />
                        <span className="text-sm">kg</span>
                        <button className="btn btn-outline btn-sm" onClick={() => updateQty(p.id, inCart.quantity_kg + (orderType === 'WHOLESALE' ? 10 : 1))}>+</button>
                        <button className="btn btn-sm" style={{color: 'var(--red-500)', marginLeft: 'auto'}} onClick={() => removeFromCart(p.id)}>✕</button>
                      </div>
                    ) : (
                      <button className="btn btn-primary btn-sm" style={{width: '100%'}} onClick={() => addToCart(p)}>
                        Add to Order
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary & Form */}
          <div>
            <div className="card" style={{position: 'sticky', top: 80}}>
              <div className="card-header">
                <h3 style={{fontWeight: 700}}>📋 Order Summary</h3>
                <span className={`badge badge-${orderType.toLowerCase()}`}>{orderType}</span>
              </div>
              <div className="card-body">
                {cart.length === 0 ? (
                  <p style={{color: 'var(--gray-400)', textAlign: 'center', padding: 24}}>No items added yet</p>
                ) : (
                  <>
                    {cart.map((item) => (
                      <div key={item.product_id} className="flex justify-between items-center" style={{padding: '8px 0', borderBottom: '1px solid var(--gray-100)'}}>
                        <div>
                          <div className="font-semibold text-sm">{item.product_name}</div>
                          <div className="text-xs" style={{color: 'var(--gray-400)'}}>{item.quantity_kg} kg × ₹{item.price_per_kg}</div>
                        </div>
                        <span className="font-semibold">₹{(item.quantity_kg * item.price_per_kg).toFixed(0)}</span>
                      </div>
                    ))}
                    <div style={{marginTop: 16, borderTop: '2px solid var(--gray-200)', paddingTop: 12}}>
                      <div className="flex justify-between text-sm" style={{marginBottom: 4}}>
                        <span>Subtotal ({totalKg} kg)</span><span>₹{subtotal.toFixed(0)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-sm" style={{color: 'var(--green-600)', marginBottom: 4}}>
                          <span>Discount</span><span>-₹{discount.toFixed(0)}</span>
                        </div>
                      )}
                      <div className="flex justify-between" style={{fontSize: '1.2rem', fontWeight: 800, marginTop: 8}}>
                        <span>Total</span><span style={{color: 'var(--green-700)'}}>₹{total.toFixed(0)}</span>
                      </div>
                    </div>
                  </>
                )}

                <form onSubmit={handleSubmit} style={{marginTop: 24}}>
                  <div className="form-group" style={{marginBottom: 12}}>
                    <label className="form-label">Your Name *</label>
                    <input className="form-input" placeholder="Enter your name" value={form.customer_name} onChange={e => setForm({...form, customer_name: e.target.value})} required />
                  </div>
                  <div className="form-group" style={{marginBottom: 12}}>
                    <label className="form-label">Phone Number *</label>
                    <input className="form-input" placeholder="Enter phone number" value={form.phone_number} onChange={e => setForm({...form, phone_number: e.target.value})} required />
                  </div>
                  <div className="form-group" style={{marginBottom: 16}}>
                    <label className="form-label">Notes (optional)</label>
                    <textarea className="form-input" rows={2} placeholder="Delivery instructions, etc." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                  </div>
                  <button type="submit" className="btn btn-success btn-lg" style={{width: '100%'}} disabled={submitting || cart.length === 0}>
                    {submitting ? 'Placing Order...' : `Place ${orderType} Order`}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
