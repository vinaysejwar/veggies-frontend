import { useState, useEffect } from 'react';
import { stockAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function StockPage() {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [qty, setQty] = useState('');
  const [operation, setOperation] = useState('ADD');

  const load = () => {
    stockAPI.list().then(r => { setStock(r.data.stock || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleUpdate = async (productId) => {
    try {
      await stockAPI.update(productId, { quantity_kg: Number(qty), operation });
      toast.success('Stock updated successfully');
      setEditing(null);
      setQty('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update stock');
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1>📦 Stock Management</h1>
      </header>
      <div className="admin-content">
        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : (
          <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16}}>
            {stock.map((s) => {
              const qty_kg = Number(s.quantity_kg);
              const isLow = qty_kg < 100;
              return (
                <div key={s.id} className="card" style={{border: isLow ? '2px solid var(--red-500)' : undefined}}>
                  <div className="card-body">
                    <div className="flex items-center justify-between" style={{marginBottom: 16}}>
                      <div>
                        <h3 className="font-semibold">{s.product?.name}</h3>
                        <span className={`badge badge-${s.product?.category?.toLowerCase()}`}>{s.product?.category}</span>
                      </div>
                      <span style={{fontSize: '2rem'}}>
                        {s.product?.category === 'GREEN' ? '🥒' : s.product?.category === 'YELLOW' ? '🍌' : '⭐'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between" style={{marginBottom: 12}}>
                      <div>
                        <div className="stat-value" style={{fontSize: '1.5rem', color: isLow ? 'var(--red-500)' : 'var(--green-700)'}}>
                          {qty_kg.toFixed(0)} kg
                        </div>
                        <div className="text-xs" style={{color: 'var(--gray-400)'}}>Available stock</div>
                      </div>
                      {isLow && <span className="badge badge-cancelled">Low Stock!</span>}
                    </div>
                    {editing === s.product_id ? (
                      <div className="flex flex-col gap-2" style={{marginTop: 8}}>
                        <div className="flex gap-2">
                          <select className="form-select" value={operation} onChange={e => setOperation(e.target.value)} style={{flex: 1}}>
                            <option value="ADD">Add</option>
                            <option value="DEDUCT">Deduct</option>
                            <option value="SET">Set to</option>
                          </select>
                          <input
                            className="form-input"
                            type="number"
                            placeholder="Qty (kg)"
                            value={qty}
                            onChange={e => setQty(e.target.value)}
                            style={{flex: 1}}
                            min="0"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button className="btn btn-success btn-sm" style={{flex: 1}} onClick={() => handleUpdate(s.product_id)}>Save</button>
                          <button className="btn btn-outline btn-sm" style={{flex: 1}} onClick={() => setEditing(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        className="btn btn-outline btn-sm"
                        style={{width: '100%', marginTop: 8}}
                        onClick={() => { setEditing(s.product_id); setQty(''); setOperation('ADD'); }}
                      >
                        Update Stock
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
