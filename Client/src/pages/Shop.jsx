import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../services/productsData';
import { CartContext } from '../context/CartContext';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('Fruits & Veg');
  const [organicOnly, setOrganicOnly] = useState(true);
  const [localFarm, setLocalFarm] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [sortBy, setSortBy] = useState('Most Popular');

  const { cartItems, addToCart, clearCart, cartSubtotal, cartCount } = useContext(CartContext);

  const categories = [
    {
      name: 'Fruits & Veg',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2a15 15 0 0 0-15 15a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1A15 15 0 0 0 12 2zm0 0v16"></path>
          <path d="M12 6a6 6 0 0 0-6 6"></path>
        </svg>
      )
    },
    {
      name: 'Dairy & Eggs',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"></path>
        </svg>
      )
    },
    {
      name: 'Bakery',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 11V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5"></path>
          <path d="M3 18a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4H3v4z"></path>
        </svg>
      )
    },
    {
      name: 'Meat & Seafood',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 12s3-7 10-7s10 7 10 7s-3 7-10 7s-10-7-10-7z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
      )
    },
    {
      name: 'Pantry',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
        </svg>
      )
    },
    {
      name: 'Frozen',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <line x1="12" y1="2" x2="12" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          <line x1="4.93" y1="19.07" x2="19.07" y2="4.93"></line>
        </svg>
      )
    }
  ];



  // Filtering products
  const filteredProducts = products.filter(p => {
    if (p.category !== selectedCategory) return false;
    if (organicOnly && !p.organic) return false;
    if (onSale && !p.onSale) return false;
    return true;
  });

  // Basket helpers mapped to CartContext
  const addToBasket = (product) => {
    addToCart(product, 1, product.weightOptions?.[0] || 'Each');
  };

  const basketSubtotal = cartSubtotal;
  const basketTotalQty = cartCount;
  const basket = cartItems;
  const clearBasket = clearCart;

  return (
    <div className="shop-layout-wrapper">
      {/* Breadcrumbs */}
      <div className="shop-breadcrumbs">
        <Link to="/">Shop</Link> &nbsp;/&nbsp; <span style={{ fontWeight: 600, color: 'var(--color-neutral)' }}>Fresh Produce</span>
      </div>

      {/* Header Row */}
      <div className="shop-header-row">
        <div className="shop-title-section">
          <h1 className="shop-main-title">Fresh Produce</h1>
          <p className="shop-main-subtitle">Hand-picked freshness from local farms directly to your door.</p>
        </div>

        <div className="shop-sort-container">
          <span>Sort by:</span>
          <select 
            className="shop-sort-select" 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Most Popular">Most Popular</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Body Grid */}
      <div className="shop-body-layout">
        {/* Sidebar */}
        <aside className="shop-sidebar">
          <div>
            <h3 className="sidebar-title">Categories</h3>
            <div className="sidebar-category-list">
              {categories.map((cat, idx) => (
                <button 
                  key={idx}
                  className={`sidebar-category-btn ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.name)}
                >
                  <span className="sidebar-category-icon">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="sidebar-section-title">Price Range</h4>
            <div className="filter-group">
              <label className="filter-checkbox-label">
                <input type="checkbox" className="filter-checkbox" />
                <span>Under $10</span>
              </label>
              <label className="filter-checkbox-label">
                <input type="checkbox" className="filter-checkbox" />
                <span>$10 - $25</span>
              </label>
              <label className="filter-checkbox-label">
                <input type="checkbox" className="filter-checkbox" />
                <span>$25+</span>
              </label>
            </div>
          </div>

          <div>
            <h4 className="sidebar-section-title">Attributes</h4>
            <div className="filter-group">
              <label className="filter-checkbox-label">
                <input 
                  type="checkbox" 
                  className="filter-checkbox" 
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                />
                <span>Organic Only</span>
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="checkbox" 
                  className="filter-checkbox"
                  checked={localFarm}
                  onChange={(e) => setLocalFarm(e.target.checked)}
                />
                <span>Local Farm</span>
              </label>
              <label className="filter-checkbox-label">
                <input 
                  type="checkbox" 
                  className="filter-checkbox"
                  checked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                />
                <span>On Sale</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Listing Grid */}
        <div className="shop-feed-container">
          <div className="product-grid-5cols">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                {product.badge && (
                  <span className={`product-tag ${product.badgeClass}`}>{product.badge}</span>
                )}
                <Link to={`/product/${product.id}`} className="product-image-container" style={{ display: 'block' }}>
                  <img src={product.image} alt={product.name} className="product-img" />
                </Link>
                <span className="product-category">{product.category}</span>
                <Link to={`/product/${product.id}`}>
                  <h3 className="product-name" style={{ fontSize: '14px', minHeight: '38px', cursor: 'pointer' }}>
                    {product.name}
                  </h3>
                </Link>
                <p className="product-desc" style={{ fontSize: '11px', minHeight: '20px', marginBottom: '8px' }}>
                  {product.description}
                </p>
                <div className="product-footer">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <span className="product-price" style={{ fontSize: '16px' }}>
                      ${product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span style={{ textDecoration: 'line-through', fontSize: '11px', color: 'var(--color-neutral-light)' }}>
                        ${product.oldPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button 
                    className="add-to-cart-btn" 
                    onClick={() => addToBasket(product)}
                    aria-label={`Add ${product.name} to cart`}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          <span className="showing-indicator">
            Showing {filteredProducts.length} of {products.length} fresh products
          </span>

          <button className="load-more-btn">Load More Items</button>
        </div>
      </div>

      {/* Floating Sticky Bottom Basket Bar */}
      {basketTotalQty > 0 && (
        <div className="basket-floating-bar">
          <div className="basket-left">
            <div className="basket-thumbnails">
              {basket.slice(0, 2).map((item, idx) => {
                const originalProduct = products.find(p => p.id === item.id);
                const displayImage = originalProduct ? originalProduct.image : item.image;
                return (
                  <div key={idx} className="basket-thumb">
                    <img src={displayImage} alt={item.name} className="basket-thumb-img" />
                  </div>
                );
              })}
              {basket.length > 2 && (
                <div className="basket-thumb-more">
                  +{basket.length - 2}
                </div>
              )}
            </div>
            <div className="basket-summary-info">
              <p className="basket-count-text">{basketTotalQty} Items</p>
              <p className="basket-subtotal-text">
                Subtotal: <span className="basket-subtotal-value">${basketSubtotal.toFixed(2)}</span>
              </p>
            </div>
          </div>

          <div className="basket-right">
            <span className="basket-clear-link" onClick={clearBasket}>Clear All</span>
            <Link to="/cart" className="basket-view-btn">
              <span>View Basket</span>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
