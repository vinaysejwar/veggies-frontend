import { useState, useEffect } from 'react';
import { customersAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', customer_type: 'RETAIL', credit_limit: 0 });
  const [typeFilter, setTypeFilter] = useState('');

  const load = () => {
    customersAPI.list(typeFilter || undefined).then(r => { setCustomers(r.data.customers || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [typeFilter]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await customersAPI.create({ ...form, credit_limit: Number(form.credit_limit) });
      toast.success('Customer created!');
      setShowForm(false);
      setForm({ name: '', phone: '', email: '', address: '', customer_type: 'RETAIL', credit_limit: 0 });
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create customer');
    }
  };

  return (
    <>
      <header className="admin-header">
        <h1>👥 Customers</h1>
        <div className="flex gap-2">
          <select className="form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} style={{fontSize: '0.85rem'}}>
            <option value="">All Types</option>
            <option value="RETAIL">Retail</option>
            <option value="WHOLESALE">Wholesale</option>
            <option value="MALL">Mall</option>
          </select>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>+ Add Customer</button>
        </div>
      </header>
      <div className="admin-content">
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Add Customer</h2>
                <button className="btn btn-icon" onClick={() => setShowForm(false)}>✕</button>
              </div>
              <form onSubmit={handleCreate}>
                <div className="modal-body flex flex-col gap-4">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input className="form-input" placeholder="Customer name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input className="form-input" placeholder="Phone number" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Address</label>
                    <input className="form-input" placeholder="Address" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-select" value={form.customer_type} onChange={e => setForm({...form, customer_type: e.target.value})}>
                      <option value="RETAIL">Retail</option>
                      <option value="WHOLESALE">Wholesale</option>
                      <option value="MALL">Mall</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Credit Limit (₹)</label>
                    <input className="form-input" type="number" placeholder="0 for no credit" value={form.credit_limit} onChange={e => setForm({...form, credit_limit: e.target.value})} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Customer</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="loader"><div className="spinner"></div></div>
        ) : customers.length === 0 ? (
          <div className="empty-state"><div className="emoji">👥</div><p>No customers found</p></div>
        ) : (
          <div className="card">
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Type</th>
                    <th>Address</th>
                    <th>Credit Limit</th>
                    <th>Credit Balance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td className="font-semibold">{c.name}</td>
                      <td className="text-sm">{c.phone}</td>
                      <td><span className={`badge badge-${c.customer_type?.toLowerCase()}`}>{c.customer_type}</span></td>
                      <td className="text-sm" style={{maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis'}}>{c.address || '-'}</td>
                      <td className="font-semibold">₹{Number(c.credit_limit).toLocaleString()}</td>
                      <td className="font-semibold" style={{color: Number(c.credit_balance) > 0 ? 'var(--red-500)' : 'var(--green-600)'}}>
                        ₹{Number(c.credit_balance).toLocaleString()}
                      </td>
                      <td><span className={`badge ${c.is_active ? 'badge-ready' : 'badge-cancelled'}`}>{c.is_active ? 'Active' : 'Inactive'}</span></td>
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
