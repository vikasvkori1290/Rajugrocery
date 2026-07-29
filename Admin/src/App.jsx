import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <AdminAuthProvider>
      <Router>
        <div className="app admin-portal">
          <header className="navbar">
            <div className="logo">
              <Link to="/">Raju Groceries Admin</Link>
            </div>
            <nav className="nav-links">
              <Link to="/">Dashboard</Link>
              <Link to="/products">Products</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/login">Login</Link>
            </nav>
          </header>

          <main className="content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </main>

          <footer className="footer">
            <p>&copy; {new Date().getFullYear()} Raju Groceries Admin Portal. All rights reserved.</p>
          </footer>
        </div>
      </Router>
    </AdminAuthProvider>
  );
}

export default App;
