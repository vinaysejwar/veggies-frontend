import { useState, useEffect } from 'react';
import { ripeningAPI, productsAPI } from '../../services/api';
import toast from 'react-hot-toast';

const NEXT_STATUS = {
  RAW: ['RIPENING', 'WASTED'],
  RIPENING: ['READY', 'WASTED'],
  READY: ['SOLD', 'WASTED'],
};

const STATUS_COLORS = { RAW: '#94a3b8', RIPENING: '#8b5cf6', READY: '#22c55e', SOLD: '#f59e0b', WASTED: '#ef4444' };
const STATUS_EMOJI = { RAW: '🟢', RIPENING: '🟡', READY: '🍌', SOLD: '✅', WASTED: '❌' };

export default function RipeningPage() {
  const [batches, setBatches] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ product_id: '', quantity_kg: '', chamber_number: '', expected_ready: '', notes: '' });

  const load = () => {
    ripeningAPI.list(filter || undefined).then(r => { setBatches(r.data.batches || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter]);
  useEffect(() => { productsAPI.list().then(r => setProducts(r.data.products || [])).catch(() => {}); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await ripeningAPI.create({ ...form, product_id: Number(form.product_id), quantity_kg: Number(form.quantity_kg) });
      toast.success('Batch created!');
      setShowForm(false);
      setForm({ product_id: '', quantity_kg: '', chamber_number: '', expected_ready: '', notes: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create batch');
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await ripeningAPI.updateStatus(id, { status });
      toast.success(`Batch moved to ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1>🌡️ Ripening Batches</h1>
        <div className="flex gap-2">
          <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} style={{fontSize: '0.85rem'}}>
            <option value="">All Status</option>
            <option value="RAW">Raw</option>
            <option value="RIPENING">Ripening</option>
            <option value="READY">Ready</option>
            <option value="SOLD">Sold</option>
            <option value="WASTED">Wasted</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ New Batch</button>
        </div>
      </header>
      <div className="admin-content">
        {/* Create Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Create Ripening Batch</h2>
                <button className="btn btn-icon" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body flex flex-col gap-4">
                  <div className="form-group">
                    <label className="form-label">Product</label>
                    <select className="form-select" value={form.product_id} onChange={e => setForm({...form, product_id: e.target.value})} required>
                      <option value="">Select product</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Quantity (kg)</label>
                    <input className="form-input" type="number" placeholder="e.g. 200" value={form.quantity_kg} onChange={e => setForm({...form, quantity_kg: e.target.value})} required min="1" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Chamber Number</label>
                    <input className="form-input" placeholder="e.g. C1" value={form.chamber_number} onChange={e => setForm({...form, chamber_number: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Expected Ready Date</label>
                    <input className="form-input" type="date" value={form.expected_ready} onChange={e => setForm({...form, expected_ready: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-input" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Create Batch</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Status Pipeline */}
        <div className="flex gap-4" style={{marginBottom: 24, overflowX: 'auto', padding: '4px 0'}}>
          {['RAW', 'RIPENING', 'READY', 'SOLD'].map(status => {
            const count = batches.filter(b => b.status === status).length;
            return (
              <div key={status} className="card" style={{minWidth: 150, textAlign: 'center', padding: 16, flex: 1, borderTop: `3px solid ${STATUS_COLORS[status]}`}}>
                <div style={{fontSize: '1.5rem'}}>{STATUS_EMOJI[status]}</div>
                <div className="font-bold text-xl">{count}</div>
                <div className="text-sm" style={{color: 'var(--gray-500)'}}>{status}</div>
              </div>
            );
          })}
        </div>

        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : batches.length === 0 ? (
          <div className="empty-state"><div className="emoji">🌡️</div><p>No ripening batches found</p></div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Batch Code</th>
                    <th>Product</th>
                    <th>Qty (kg)</th>
                    <th>Chamber</th>
                    <th>Status</th>
                    <th>Start Date</th>
                    <th>Expected Ready</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {batches.map(b => (
                    <tr key={b.id}>
                      <td className="font-semibold text-sm">{b.batch_code}</td>
                      <td>{b.product?.name}</td>
                      <td className="font-semibold">{Number(b.quantity_kg).toFixed(0)}</td>
                      <td>{b.chamber_number || '-'}</td>
                      <td><span className={`badge badge-${b.status.toLowerCase()}`}>{STATUS_EMOJI[b.status]} {b.status}</span></td>
                      <td className="text-sm">{new Date(b.start_date).toLocaleDateString('en-IN')}</td>
                      <td className="text-sm">{b.expected_ready ? new Date(b.expected_ready).toLocaleDateString('en-IN') : '-'}</td>
                      <td className="text-sm" style={{maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis'}}>{b.notes || '-'}</td>
                      <td>
                        <div className="flex gap-1">
                          {NEXT_STATUS[b.status]?.map(s => (
                            <button
                              key={s}
                              className={`btn btn-sm ${s === 'WASTED' ? 'btn-danger' : 'btn-primary'}`}
                              onClick={() => handleStatus(b.id, s)}
                              style={{fontSize: '0.75rem', padding: '4px 8px'}}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
