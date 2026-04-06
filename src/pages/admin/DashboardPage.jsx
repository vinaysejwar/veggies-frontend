import { useState, useEffect } from 'react';
import { reportsAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  ShoppingCart, IndianRupee, Users, Package,
  Thermometer, Truck, AlertTriangle, CreditCard
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reportsAPI.dashboard().then(r => {
      setStats(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-content"><div className="loader"><div className="spinner"></div></div></div>;
  if (!stats) return <div className="admin-content"><p>Failed to load dashboard</p></div>;

  const chartData = stats.revenue_by_day
    ? Object.entries(stats.revenue_by_day).map(([date, revenue]) => ({
        date: date.slice(5), // MM-DD
        revenue: Math.round(revenue),
      }))
    : [];

  const statCards = [
    { label: "Today's Orders", value: stats.today_orders, icon: ShoppingCart, color: 'banana' },
    { label: "Today's Revenue", value: `₹${Number(stats.today_revenue || 0).toLocaleString()}`, icon: IndianRupee, color: 'green' },
    { label: 'Pending Orders', value: stats.pending_orders, icon: Package, color: 'orange' },
    { label: 'Active Customers', value: stats.total_customers, icon: Users, color: 'blue' },
    { label: 'Active Batches', value: stats.active_batches, icon: Thermometer, color: 'purple' },
    { label: 'Ready Batches', value: stats.ready_batches, icon: Thermometer, color: 'green' },
    { label: 'Pending Deliveries', value: stats.pending_deliveries, icon: Truck, color: 'orange' },
    { label: 'Outstanding Credit', value: `₹${Number(stats.outstanding_credit || 0).toLocaleString()}`, icon: CreditCard, color: 'red' },
  ];

  return (
    <>
      <header className="admin-header">
        <h1>📊 Dashboard</h1>
        <span className="text-sm" style={{color: 'var(--gray-400)'}}>
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </header>
      <div className="admin-content">
        {/* Stat Cards Grid */}
        <div className="grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16, marginBottom: 32}}>
          {statCards.map((s, i) => (
            <div key={i} className="stat-card">
              <div className={`stat-icon ${s.color}`}>
                <s.icon size={24} />
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid" style={{gridTemplateColumns: '2fr 1fr', gap: 24}}>
          {/* Revenue Chart */}
          <div className="card">
            <div className="card-header">
              <h3 style={{fontWeight: 700}}>📈 Revenue (Last 7 Days)</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{fontSize: 12}} stroke="#94a3b8" />
                  <YAxis tick={{fontSize: 12}} stroke="#94a3b8" />
                  <Tooltip
                    formatter={(val) => [`₹${val.toLocaleString()}`, 'Revenue']}
                    contentStyle={{borderRadius: 12, border: '1px solid #e2e8f0'}}
                  />
                  <Bar dataKey="revenue" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="card">
            <div className="card-header">
              <h3 style={{fontWeight: 700}}>⚠️ Alerts</h3>
            </div>
            <div className="card-body">
              {stats.low_stock_products?.length > 0 ? (
                <div>
                  <h4 className="text-sm font-semibold" style={{color: 'var(--red-500)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6}}>
                    <AlertTriangle size={16} /> Low Stock Products
                  </h4>
                  {stats.low_stock_products.map((s) => (
                    <div key={s.id} className="flex justify-between items-center" style={{padding: '8px 0', borderBottom: '1px solid var(--gray-100)'}}>
                      <span className="text-sm font-medium">{s.product?.name}</span>
                      <span className="badge badge-cancelled">{Number(s.quantity_kg).toFixed(0)} kg</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state" style={{padding: 24}}>
                  <div className="emoji" style={{fontSize: '2rem'}}>✅</div>
                  <p className="text-sm">All stock levels normal</p>
                </div>
              )}

              {/* Order Status Distribution */}
              {stats.orders_by_status?.length > 0 && (
                <div style={{marginTop: 24}}>
                  <h4 className="text-sm font-semibold" style={{marginBottom: 12}}>Order Status</h4>
                  {stats.orders_by_status.map((s) => (
                    <div key={s.status} className="flex justify-between items-center" style={{padding: '6px 0'}}>
                      <span className={`badge badge-${s.status.toLowerCase()}`}>{s.status}</span>
                      <span className="font-semibold">{s._count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card" style={{marginTop: 24}}>
          <div className="card-header">
            <h3 style={{fontWeight: 700}}>🕐 Recent Orders</h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_orders?.map((o) => (
                  <tr key={o.id}>
                    <td className="font-semibold">{o.order_number}</td>
                    <td>{o.customer_name}</td>
                    <td className="text-sm">{o.items?.map(i => i.product?.name).join(', ') || '-'}</td>
                    <td className="font-semibold" style={{color: 'var(--green-700)'}}>₹{Number(o.total_amount).toLocaleString()}</td>
                    <td><span className={`badge badge-${o.status?.toLowerCase()}`}>{o.status}</span></td>
                    <td className="text-sm" style={{color: 'var(--gray-400)'}}>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
