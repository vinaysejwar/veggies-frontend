import { Outlet, NavLink } from 'react-router-dom';

export default function CustomerLayout() {
  return (
    <>
      <nav className="navbar">
        <div className="container">
          <NavLink to="/" className="nav-brand">
            <span className="emoji">🍌</span>
            VVS Banana Supply
          </NavLink>
          <ul className="nav-links">
            <li><NavLink to="/" className={({isActive}) => isActive ? 'active' : ''} end>Home</NavLink></li>
            <li><NavLink to="/products" className={({isActive}) => isActive ? 'active' : ''}>Products</NavLink></li>
            <li><NavLink to="/order" className={({isActive}) => isActive ? 'active' : ''}>Order</NavLink></li>
            <li><NavLink to="/contact" className={({isActive}) => isActive ? 'active' : ''}>Contact</NavLink></li>
            <li><NavLink to="/admin/login" className="btn btn-primary btn-sm">Admin Login</NavLink></li>
          </ul>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
      {/* WhatsApp Float Button */}
      <a
        href="https://wa.me/919111919979?text=Hi%20VVS%20Banana%20Store%2C%20I%20want%20to%20place%20an%20order"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Chat on WhatsApp"
      >
        💬
      </a>
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <h3>🍌 VVS Banana Cold Store & Supply</h3>
              <p>Premium banana procurement, cold storage, ripening and wholesale/retail supply. Serving Indore's banana needs with quality and trust since years.</p>
            </div>
            <div>
              <h3>Quick Links</h3>
              <ul style={{listStyle: 'none'}}>
                <li><NavLink to="/products">Our Products</NavLink></li>
                <li><NavLink to="/order">Place Order</NavLink></li>
                <li><NavLink to="/contact">Contact Us</NavLink></li>
              </ul>
            </div>
            <div>
              <h3>Contact Info</h3>
              <p>📍 Indore, Madhya Pradesh<br/>📞 +91 9111919979<br/>📧 vvsbananasupply@gmail.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            © {new Date().getFullYear()} VVS Banana Cold Store & Supply. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
