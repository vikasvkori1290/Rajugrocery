import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AdminAuthProvider, AdminAuthContext } from './context/AdminAuthContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Activities from './pages/Activities';
import Requests from './pages/Requests';
import Login from './pages/Login';
import './App.css';

// Route protection wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AdminAuthContext);
  
  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Admin Console...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Sidebar Layout Wrapper
const AdminLayout = () => {
  const { logout } = useContext(AdminAuthContext);
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div>
          <div className="sidebar-brand-section">
            <div className="brand-icon-box">R</div>
            <span className="brand-logo-text">RajAdmin</span>
          </div>

          <nav className="sidebar-menu">
            <Link to="/" className={`menu-item ${isActive('/') ? 'active' : ''}`}>
              <span>📊</span> Dashboard
            </Link>
            <Link to="/products" className={`menu-item ${isActive('/products') ? 'active' : ''}`}>
              <span>📦</span> Products
            </Link>
            <Link to="/orders" className={`menu-item ${isActive('/orders') ? 'active' : ''}`}>
              <span>📋</span> Orders
            </Link>
            <Link to="/activities" className={`menu-item ${isActive('/activities') ? 'active' : ''}`}>
              <span>🔄</span> Activities
            </Link>
            <Link to="/requests" className={`menu-item ${isActive('/requests') ? 'active' : ''}`}>
              <span>✔</span> Requests <span className="menu-badge">New</span>
            </Link>
          </nav>
        </div>

        <div>
          <button onClick={logout} className="menu-item logout-btn">
            <span>🚪</span> Logout
          </button>
          <p className="sidebar-footer-text">&copy; 2026 Raj Groceries</p>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="admin-main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <Routes>
          {/* Public login route */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected admin layout and pages */}
          <Route path="/*" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
