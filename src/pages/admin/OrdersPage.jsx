import { useState, useEffect } from 'react';
import { ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['', 'PENDING', 'CONFIRMED', 'PROCESSING', 'DISPATCHED', 'DELIVERED', 'CANCELLED'];
const NEXT_STATUS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['DISPATCHED', 'CANCELLED'],
  DISPATCHED: ['DELIVERED'],
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const load = () => {
    setLoading(true);
    ordersAPI.list({ status: filter || undefined, order_type: typeFilter || undefined })
      .then(r => { setOrders(r.data.orders || []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filter, typeFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await ordersAPI.updateStatus(id, { status });
      toast.success(`Order updated to ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1>🛒 Orders</h1>
        <div className="flex gap-2">
          <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} style={{fontSize: '0.85rem'}}>
            <option value="">All Status</option>
            {STATUS_OPTIONS.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{fontSize: '0.85rem'}}>
            <option value="">All Types</option>
            <option value="RETAIL">Retail</option>
            <option value="WHOLESALE">Wholesale</option>
          </select>
        </div>
      </header>
      <div className="admin-content">
        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : orders.length === 0 ? (
          <div className="empty-state"><div className="emoji">📦</div><p>No orders found</p></div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td className="font-semibold text-sm">{o.order_number}</td>
                      <td>{o.customer_name}</td>
                      <td className="text-sm">{o.phone_number}</td>
                      <td><span className={`badge badge-${o.order_type?.toLowerCase()}`}>{o.order_type}</span></td>
                      <td className="text-sm">{o.items?.map(i => `${i.product?.name} (${i.quantity_kg}kg)`).join(', ')}</td>
                      <td className="font-semibold" style={{color: 'var(--green-700)'}}>₹{Number(o.total_amount).toLocaleString()}</td>
                      <td><span className={`badge badge-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                      <td className="text-sm" style={{color: 'var(--gray-400)'}}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                      <td>
                        <div className="flex gap-1">
                          {NEXT_STATUS[o.status]?.map(s => (
                            <button
                              key={s}
                              className={`btn btn-sm ${s === 'CANCELLED' ? 'btn-danger' : 'btn-primary'}`}
                              onClick={() => handleStatusUpdate(o.id, s)}
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
