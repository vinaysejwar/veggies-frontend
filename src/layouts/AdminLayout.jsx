import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import {
  LayoutDashboard, ShoppingCart, Package, Thermometer,
  Users, CreditCard, Truck, BarChart3, LogOut, Banana
} from 'lucide-react';

const sidebarLinks = [
  { section: 'Overview', items: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  ]},
  { section: 'Operations', items: [
    { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
    { to: '/admin/stock', icon: Package, label: 'Stock' },
    { to: '/admin/ripening', icon: Thermometer, label: 'Ripening' },
    { to: '/admin/delivery', icon: Truck, label: 'Delivery' },
  ]},
  { section: 'Management', items: [
    { to: '/admin/products', icon: Banana, label: 'Products' },
    { to: '/admin/customers', icon: Users, label: 'Customers' },
    { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
  ]},
];

export default function AdminLayout() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="emoji">🍌</span>
          <div>
            <h2>VVS Admin</h2>
            <span>Banana Cold Store</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          {sidebarLinks.map((section) => (
            <div key={section.section} className="sidebar-section">
              <div className="sidebar-section-title">{section.section}</div>
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={20} />
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div style={{padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)'}}>
          <button onClick={() => { logout(); navigate('/admin/login'); }} className="sidebar-link" style={{width: '100%', border: 'none', background: 'none', cursor: 'pointer'}}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>
      <div className="admin-main">
        <Outlet />
      </div>
    </div>
  );
}
