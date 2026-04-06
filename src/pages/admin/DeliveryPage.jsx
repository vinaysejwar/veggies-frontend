import { useState, useEffect } from 'react';
import { deliveryAPI, ordersAPI } from '../../services/api';
import toast from 'react-hot-toast';

const NEXT = { SCHEDULED: ['IN_TRANSIT', 'FAILED'], IN_TRANSIT: ['DELIVERED', 'FAILED'], FAILED: ['SCHEDULED'] };

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ order_id: '', driver_name: '', driver_phone: '', vehicle_number: '', delivery_address: '', scheduled_date: '' });

  const load = () => { deliveryAPI.list(filter || undefined).then(r => { setDeliveries(r.data.deliveries || []); setLoading(false); }).catch(() => setLoading(false)); };
  useEffect(() => { load(); }, [filter]);
  useEffect(() => { ordersAPI.list({ status: 'CONFIRMED' }).then(r => setOrders(r.data.orders || [])).catch(() => {}); }, []);

  const handleCreate = async (e) => { e.preventDefault(); try { await deliveryAPI.create({ ...form, order_id: Number(form.order_id) }); toast.success('Delivery scheduled!'); setShowForm(false); load(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };
  const handleStatus = async (id, status) => { try { await deliveryAPI.updateStatus(id, { status }); toast.success(`Updated to ${status}`); load(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } };

  return (
    <>
      <header className="admin-header">
        <h1>🚚 Delivery</h1>
        <div className="flex gap-2">
          <select className="form-select" value={filter} onChange={e => setFilter(e.target.value)} style={{fontSize:'0.85rem'}}>
            <option value="">All</option><option value="SCHEDULED">Scheduled</option><option value="IN_TRANSIT">In Transit</option><option value="DELIVERED">Delivered</option><option value="FAILED">Failed</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Schedule</button>
        </div>
      </header>
      <div className="admin-content">
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h2>Schedule Delivery</h2><button className="btn btn-icon" onClick={() => setShowForm(false)}>✕</button></div>
              <form onSubmit={handleCreate}>
                <div className="modal-body flex flex-col gap-4">
                  <div className="form-group"><label className="form-label">Order *</label><select className="form-select" value={form.order_id} onChange={e => setForm({...form, order_id: e.target.value})} required><option value="">Select</option>{orders.map(o => <option key={o.id} value={o.id}>{o.order_number} – {o.customer_name}</option>)}</select></div>
                  <div className="form-group"><label className="form-label">Driver</label><input className="form-input" value={form.driver_name} onChange={e => setForm({...form, driver_name: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Driver Phone</label><input className="form-input" value={form.driver_phone} onChange={e => setForm({...form, driver_phone: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Vehicle</label><input className="form-input" placeholder="MP09AB1234" value={form.vehicle_number} onChange={e => setForm({...form, vehicle_number: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Address</label><input className="form-input" value={form.delivery_address} onChange={e => setForm({...form, delivery_address: e.target.value})} /></div>
                  <div className="form-group"><label className="form-label">Date</label><input className="form-input" type="date" value={form.scheduled_date} onChange={e => setForm({...form, scheduled_date: e.target.value})} /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button><button type="submit" className="btn btn-primary">Schedule</button></div>
              </form>
            </div>
          </div>
        )}
        {loading ? <div className="loader"><div className="spinner"></div></div> : deliveries.length === 0 ? <div className="empty-state"><div className="emoji">🚚</div><p>No deliveries</p></div> : (
          <div className="card"><div className="table-wrapper"><table className="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Driver</th><th>Vehicle</th><th>Status</th><th>Actions</th></tr></thead><tbody>
            {deliveries.map(d => (<tr key={d.id}><td className="font-semibold text-sm">{d.order?.order_number}</td><td>{d.order?.customer_name}</td><td className="text-sm">{d.driver_name || '-'}</td><td className="text-sm">{d.vehicle_number || '-'}</td><td><span className={`badge badge-${d.status?.toLowerCase().replace('_','-')}`}>{d.status}</span></td><td><div className="flex gap-1">{NEXT[d.status]?.map(s => <button key={s} className={`btn btn-sm ${s==='FAILED'?'btn-danger':'btn-success'}`} onClick={() => handleStatus(d.id, s)} style={{fontSize:'0.75rem',padding:'4px 8px'}}>{s.replace('_',' ')}</button>)}</div></td></tr>))}
          </tbody></table></div></div>
        )}
      </div>
    </>
  );
}
