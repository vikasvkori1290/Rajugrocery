import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('Atta & Flours');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [localFarm, setLocalFarm] = useState(false);
  const [onSale, setOnSale] = useState(false);
  const [sortBy, setSortBy] = useState('Most Popular');
  const [productsList, setProductsList] = useState([]);

  const { cartItems, addToCart, clearCart, cartSubtotal, cartCount } = useContext(CartContext);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    fetch(`${apiUrl}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          // Normalize API data to match keys expected by client UI
          const normalized = data.map(item => ({
            ...item,
            id: item._id,
            image: item.images?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
            weightOptions: ['1 kg', '2 kg', '5 kg'],
            badge: item.stock < 10 ? 'Low Stock' : '',
            originalPrice: item.price * 1.2
          }));
          setProductsList(normalized);
        }
      })
      .catch((err) => {
        console.warn('API error fetching product catalog.', err);
      });
  }, []);

  const categories = [  
    {
      name: 'Atta & Flours',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      name: 'Cooking Oils',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z"></path>
        </svg>
      )
    },
    {
      name: 'Biscuits & Snacks',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 11V6a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5"></path>
          <path d="M3 18a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-4H3v4z"></path>
        </svg>
      )
    },
    {
      name: 'Dals & Pulses',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
        </svg>
      )
    },
    {
      name: 'Household Essentials',
      icon: (
        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="3" y1="15" x2="21" y2="15"></line>
        </svg>
      )
    }
  ];



  // Filtering products
  const filteredProducts = productsList.filter(p => {
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
        <Link to="/">Shop</Link> &nbsp;/&nbsp; <span style={{ fontWeight: 600, color: 'var(--color-neutral)' }}>{selectedCategory}</span>
      </div>

      {/* Header Row */}
      <div className="shop-header-row">
        <div className="shop-title-section">
          <h1 className="shop-main-title">{selectedCategory}</h1>
          <p className="shop-main-subtitle">Premium quality household essentials and groceries at best values.</p>
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
                <span>Under ₹100</span>
              </label>
              <label className="filter-checkbox-label">
                <input type="checkbox" className="filter-checkbox" />
                <span>₹100 - ₹250</span>
              </label>
              <label className="filter-checkbox-label">
                <input type="checkbox" className="filter-checkbox" />
                <span>₹250+</span>
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
                      ₹{product.price.toFixed(2)}
                    </span>
                    {product.oldPrice && (
                      <span style={{ textDecoration: 'line-through', fontSize: '11px', color: 'var(--color-neutral-light)' }}>
                        ₹{product.oldPrice.toFixed(2)}
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
            Showing {filteredProducts.length} of {productsList.length} products
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
                const originalProduct = productsList.find(p => p.id === item.id);
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
                Subtotal: <span className="basket-subtotal-value">₹{basketSubtotal.toFixed(2)}</span>
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
