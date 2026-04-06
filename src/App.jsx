import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Customer pages
import CustomerLayout from './layouts/CustomerLayout';
import HomePage from './pages/customer/HomePage';
import ProductsPage from './pages/customer/ProductsPage';
import OrderPage from './pages/customer/OrderPage';
import ContactPage from './pages/customer/ContactPage';

// Admin pages
import LoginPage from './pages/admin/LoginPage';
import AdminLayout from './layouts/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminStockPage from './pages/admin/StockPage';
import AdminRipeningPage from './pages/admin/RipeningPage';
import AdminCustomersPage from './pages/admin/CustomersPage';
import AdminPaymentsPage from './pages/admin/PaymentsPage';
import AdminDeliveryPage from './pages/admin/DeliveryPage';
import AdminProductsPage from './pages/admin/ProductsPage';

import './App.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: '12px',
              padding: '14px 20px',
              fontSize: '0.9rem',
              fontWeight: 500,
            },
          }}
        />
        <Routes>
          {/* Customer-facing website */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="stock" element={<AdminStockPage />} />
            <Route path="ripening" element={<AdminRipeningPage />} />
            <Route path="customers" element={<AdminCustomersPage />} />
            <Route path="payments" element={<AdminPaymentsPage />} />
            <Route path="delivery" element={<AdminDeliveryPage />} />
            <Route path="products" element={<AdminProductsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
