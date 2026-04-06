import { useState, useEffect } from 'react';
import { productsAPI, dailyRatesAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showRate, setShowRate] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'GREEN', description: '', price_per_kg: '', min_order_kg: '1', image_url: '' });
  const [rateForm, setRateForm] = useState({ product_id: '', date: new Date().toISOString().slice(0,10), rate_per_kg: '', wholesale_rate: '' });

  const load = () => { productsAPI.list(true).then(r => { setProducts(r.data.products || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await productsAPI.create({ ...form, price_per_kg: Number(form.price_per_kg), min_order_kg: Number(form.min_order_kg) });
      toast.success('Product created!'); setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleSetRate = async (e) => {
    e.preventDefault();
    try {
      await dailyRatesAPI.set({ product_id: Number(rateForm.product_id), date: rateForm.date, rate_per_kg: Number(rateForm.rate_per_kg), wholesale_rate: Number(rateForm.wholesale_rate || rateForm.rate_per_kg) });
      toast.success('Daily rate set!'); setShowRate(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const handleToggle = async (id, is_active) => {
    try { await productsAPI.update(id, { is_active: !is_active }); toast.success('Updated!'); load(); }
    catch (err) { toast.error('Failed'); }
  };

  return (
    <>
      <header className="admin-header">
        <h1>🍌 Products</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm" onClick={() => setShowRate(true)}>📊 Set Daily Rate</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Add Product</button>
        </div>
      </header>
      <div className="admin-content">
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>Add Product</h2><button className="btn btn-icon" onClick={() => setShowForm(false)}>✕</button></div>
              <form onSubmit={handleCreate}>
                <div className="modal-body flex flex-col gap-4">
                  <div className="form-group"><label className="form-label">Name *</label><input className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">Category</label><select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}><option value="GREEN">Green</option><option value="YELLOW">Yellow</option><option value="SPECIAL">Special</option></select></div>
                  <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Price per kg (₹) *</label><input className="form-input" type="number" value={form.price_per_kg} onChange={e => setForm({...form, price_per_kg: e.target.value})} required min="1" /></div>
                  <div className="form-group"><label className="form-label">Min Order (kg)</label><input className="form-input" type="number" value={form.min_order_kg} onChange={e => setForm({...form, min_order_kg: e.target.value})} min="1" /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="btn btn-primary">Create</button></div>
              </form>
            </div>
          </div>
        )}
        {showRate && (
          <div className="modal-overlay" onClick={() => setShowRate(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>Set Daily Rate</h2><button className="btn btn-icon" onClick={() => setShowRate(false)}>✕</button></div>
              <form onSubmit={handleSetRate}>
                <div className="modal-body flex flex-col gap-4">
                  <div className="form-group"><label className="form-label">Product *</label><select className="form-select" value={rateForm.product_id} onChange={e => setRateForm({...rateForm, product_id: e.target.value})} required><option value="">Select</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Date *</label><input className="form-input" type="date" value={rateForm.date} onChange={e => setRateForm({...rateForm, date: e.target.value})} required /></div>
                  <div className="form-group"><label className="form-label">Retail Rate (₹/kg) *</label><input className="form-input" type="number" value={rateForm.rate_per_kg} onChange={e => setRateForm({...rateForm, rate_per_kg: e.target.value})} required min="1" /></div>
                  <div className="form-group"><label className="form-label">Wholesale Rate (₹/kg)</label><input className="form-input" type="number" value={rateForm.wholesale_rate} onChange={e => setRateForm({...rateForm, wholesale_rate: e.target.value})} min="1" /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-outline" onClick={() => setShowRate(false)}>Cancel</button><button type="submit" className="btn btn-success">Set Rate</button></div>
              </form>
            </div>
          </div>
        )}
        {loading ? <div className="loader"><div className="spinner"></div></div> : (
          <div className="card"><div className="table-wrapper"><table className="data-table"><thead><tr><th>Name</th><th>Category</th><th>Price/kg</th><th>Min Order</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {products.map(p => (<tr key={p.id} style={{opacity: p.is_active ? 1 : 0.5}}>
              <td className="font-semibold">{p.name}</td>
              <td><span className={`badge badge-${p.category?.toLowerCase()}`}>{p.category}</span></td>
              <td className="font-semibold" style={{color:'var(--green-700)'}}>₹{Number(p.price_per_kg)}</td>
              <td>{Number(p.min_order_kg)} kg</td>
              <td>{p.stock ? `${Number(p.stock.quantity_kg).toFixed(0)} kg` : '-'}</td>
              <td><span className={`badge ${p.is_active ? 'badge-ready' : 'badge-cancelled'}`}>{p.is_active ? 'Active' : 'Inactive'}</span></td>
              <td><button className={`btn btn-sm ${p.is_active?'btn-danger':'btn-success'}`} onClick={() => handleToggle(p.id, p.is_active)}>{p.is_active ? 'Deactivate' : 'Activate'}</button></td>
            </tr>))}
          </tbody></table></div></div>
        )}
      </div>
    </>
  );
}
