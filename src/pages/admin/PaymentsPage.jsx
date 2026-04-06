import { useState, useEffect } from 'react';
import { paymentsAPI, customersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function PaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({ order_id: '', customer_id: '', amount: '', method: 'CASH', reference_no: '', notes: '' });
  const [methodFilter, setMethodFilter] = useState('');

  const load = () => {
    paymentsAPI.list({ method: methodFilter || undefined }).then(r => { setPayments(r.data.payments || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [methodFilter]);
  useEffect(() => { customersAPI.list().then(r => setCustomers(r.data.customers || [])).catch(() => {}); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await paymentsAPI.create({
        ...form,
        amount: Number(form.amount),
        order_id: form.order_id ? Number(form.order_id) : undefined,
        customer_id: form.customer_id ? Number(form.customer_id) : undefined,
      });
      toast.success('Payment recorded!');
      setShowForm(false);
      setForm({ order_id: '', customer_id: '', amount: '', method: 'CASH', reference_no: '', notes: '' });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record payment');
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1>💰 Payments</h1>
        <div className="flex gap-2">
          <select className="form-select" value={methodFilter} onChange={e => setMethodFilter(e.target.value)} style={{fontSize: '0.85rem'}}>
            <option value="">All Methods</option>
            <option value="CASH">Cash</option>
            <option value="UPI">UPI</option>
            <option value="CREDIT">Credit</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Record Payment</button>
        </div>
      </header>
      <div className="admin-content">
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Record Payment</h2>
                <button className="btn btn-icon" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body flex flex-col gap-4">
                  <div className="form-group">
                    <label className="form-label">Customer</label>
                    <select className="form-select" value={form.customer_id} onChange={e => setForm({...form, customer_id: e.target.value})}>
                      <option value="">Select customer (optional)</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name} ({c.customer_type})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Order ID (optional)</label>
                    <input className="form-input" type="number" placeholder="Order ID" value={form.order_id} onChange={e => setForm({...form, order_id: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Amount (₹) *</label>
                    <input className="form-input" type="number" placeholder="Amount" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required min="1" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Payment Method</label>
                    <select className="form-select" value={form.method} onChange={e => setForm({...form, method: e.target.value})}>
                      <option value="CASH">Cash</option>
                      <option value="UPI">UPI</option>
                      <option value="CREDIT">Credit</option>
                      <option value="BANK_TRANSFER">Bank Transfer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Reference No</label>
                    <input className="form-input" placeholder="UPI Ref / Txn ID" value={form.reference_no} onChange={e => setForm({...form, reference_no: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Notes</label>
                    <textarea className="form-input" rows={2} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Record Payment</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : payments.length === 0 ? (
          <div className="empty-state"><div className="emoji">💰</div><p>No payments recorded</p></div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Order</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Reference</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td className="font-semibold">#{p.id}</td>
                      <td>{p.customer?.name || '-'}</td>
                      <td className="text-sm">{p.order?.order_number || '-'}</td>
                      <td className="font-semibold" style={{color: 'var(--green-700)'}}>₹{Number(p.amount).toLocaleString()}</td>
                      <td><span className="badge badge-confirmed">{p.method}</span></td>
                      <td><span className={`badge badge-${p.status?.toLowerCase()}`}>{p.status}</span></td>
                      <td className="text-sm">{p.reference_no || '-'}</td>
                      <td className="text-sm" style={{color: 'var(--gray-400)'}}>{new Date(p.created_at).toLocaleDateString('en-IN')}</td>
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
