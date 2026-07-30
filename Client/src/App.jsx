import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider, CartContext } from './context/CartContext';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import './App.css';

// Subcomponent to allow accessing location for active states
const MainLayout = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useContext(CartContext);

  const isActive = (path) => location.pathname === path;

  return (
    <div className="app-container">
      {/* Desktop Header */}
      <header className="desktop-header">
        <div className="logo-container">
          <Link to="/" className="logo-container">
            <div className="logo-icon">R</div>
            <span className="logo-text">Raj Groceries</span>
          </Link>
        </div>
        
        <nav className="desktop-nav">
          <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>Home</Link>
          <Link to="/shop" className={`nav-item ${isActive('/shop') ? 'active' : ''}`}>Shop</Link>
        </nav>

        <div className="header-actions">
          <div className="search-bar-container">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
            </svg>
            <input 
              type="text" 
              placeholder="Search household products..." 
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Link to="/cart" className="action-btn action-cart-btn" aria-label="Cart">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span className="action-cart-label">Cart ({cartCount})</span>
          </Link>

          <Link to="/profile" className="action-btn" aria-label="Profile">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>
        </div>
      </header>

      {/* Mobile Header & Address Bar */}
      <div className="mobile-header-wrapper">
        <div className="mobile-header-top">
          <div className="mobile-logo">
            <div className="mobile-logo-icon">R</div>
            <span className="mobile-logo-text">Raj Groceries</span>
          </div>
          <button className="mobile-header-search-icon" aria-label="Search">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
            </svg>
          </button>
        </div>

        <div className="mobile-address-bar">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span>123 Fresh Lane</span>
        </div>

        <div className="mobile-search-box">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"></path>
          </svg>
          <input type="text" placeholder="Search for fresh groceries..." style={{ background: 'transparent', width: '100%' }} />
        </div>
      </div>

      {/* Main Pages Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      {/* Desktop Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <div className="footer-logo-row">
              <div className="footer-logo-box">R</div>
              <span className="footer-logo-text">Raj Groceries</span>
            </div>
            <p className="footer-tagline">
              &copy; {new Date().getFullYear()} Raj Groceries. Your Household Essentials Partner.
            </p>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-heading">Shop</h4>
            <div className="footer-links">
              <Link to="/deals" className="footer-link">Weekly Deals</Link>
              <Link to="/organic" className="footer-link">Organic Farm</Link>
              <Link to="/shop" className="footer-link">New Arrivals</Link>
            </div>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-heading">Support</h4>
            <div className="footer-links">
              <a href="#help" className="footer-link">Help Center</a>
              <a href="#delivery" className="footer-link">Delivery Areas</a>
              <a href="#terms" className="footer-link">Terms of Service</a>
            </div>
          </div>

          <div className="footer-column">
            <h4 className="footer-heading">Follow Our Harvest</h4>
            <div className="footer-social-icons">
              <a href="#share" className="footer-social-btn" aria-label="Share">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                </svg>
              </a>
              <a href="#web" className="footer-social-btn" aria-label="Website">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5V1.077zM4.09 4a9.267 9.267 0 0 1 .64-1.539 6.7 6.7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4H4.09zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7.048 7.048 0 0 0-.056 2.5h1.89zm.116 2.5h-1.89a7.048 7.048 0 0 0 .056 2.5h2.146c-.174-.782-.282-1.623-.312-2.5zm2.127 3.5H4.09a7.03 7.03 0 0 0 3.068 2.392 6.702 6.702 0 0 1-.597-.933A9.268 9.268 0 0 1 4.673 13.5zm1.18 0c.552 1.035 1.218 1.65 1.887 1.855V13.5H5.853zm2.647 0h1.66c-.552 1.035-1.218 1.65-1.887 1.855V13.5zm2.647 0c-.073.4-.202.733-.365 1.028a6.7 6.7 0 0 1-.597.933 7.03 7.03 0 0 0 3.068-2.392h-2.106zm1.272-3.5c-.03.877-.138 1.718-.312 2.5h2.146a7.048 7.048 0 0 0 .056-2.5h-1.89zm-.116-2.5h1.89a7.048 7.048 0 0 0-.056-2.5h-2.146c.174.782.282 1.623.312 2.5zm-2.127-3.5h2.106a7.03 7.03 0 0 0-3.068-2.392c.23.273.43.59.597.933.19.387.315.897.365 1.028zm-1.18 0V1.077c.67.204 1.335.82 1.887 1.855.195.367.368.784.512 1.068H8.5zm0 8.5v-3h3.5v3H8.5zm0-4.5v-3h3.5v3H8.5zm-4.5 4.5v-3H7.5v3H4zm0-4.5v-3H7.5v3H4z"/>
                </svg>
              </a>
              <a href="#mail" className="footer-social-btn" aria-label="Mail">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.758 2.855L15 11.114v-5.73zm-.034 6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1 11.114l4.758-2.876L1 5.383v5.73z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Nav Bar */}
      <nav className="mobile-bottom-nav">
        <Link to="/" className={`bottom-nav-item ${isActive('/') ? 'active' : ''}`}>
          <span className="bottom-nav-icon">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M2 13.5V7h1v6.5a.5.5 0 0 0 .5.5h9a.5.5 0 0 0 .5-.5V7h1v6.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5zm11-11V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"></path>
              <path fillRule="evenodd" d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"></path>
            </svg>
          </span>
          <span>Home</span>
        </Link>
        
        <Link to="/shop" className={`bottom-nav-item ${isActive('/shop') ? 'active' : ''}`}>
          <span className="bottom-nav-icon">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.6 7H2.5A1.5 1.5 0 0 1 1 5.6v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.6v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.6 15H2.5A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"></path>
            </svg>
          </span>
          <span>Categories</span>
        </Link>

        <Link to="/cart" className={`bottom-nav-item ${isActive('/cart') ? 'active' : ''}`}>
          <span className="bottom-nav-icon" style={{ position: 'relative' }}>
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-count" style={{ top: '-6px', right: '-10px' }}>{cartCount}</span>}
          </span>
          <span>Cart</span>
        </Link>

        <Link to="/profile" className={`bottom-nav-item ${isActive('/profile') ? 'active' : ''}`}>
          <span className="bottom-nav-icon">
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </span>
          <span>Profile</span>
        </Link>
      </nav>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainLayout />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
