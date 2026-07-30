import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero_bg.png';

const Home = () => {
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

  const [productsList, setProductsList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
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

  const trendingProducts = productsList.slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div 
          className="hero-banner" 
          style={{ backgroundImage: `linear-gradient(to right, rgba(251, 251, 249, 0.9) 30%, rgba(251, 251, 249, 0.2) 80%), url(${heroBg})` }}
        >
          <span className="hero-badge">100% Quality Assured</span>
          <h1 className="hero-title">Daily Essentials & Household Needs, Delivered.</h1>
          <p className="hero-subtitle">
            Get premium wheat flour, cooking oils, snacks, and home cleaning products at the best prices. Directly to your doorstep.
          </p>
          <div className="hero-buttons">
            <Link to="/shop" className="btn-primary" style={{ textDecoration: 'none' }}>Shop Now</Link>
            <button className="btn-outline">Learn More</button>
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Carefully selected departments for your weekly shop</p>
          </div>
          <a href="/shop" className="view-all-link">
            View All Categories
          </a>
        </div>
        <div className="categories-grid">
          {categories.map((category, idx) => (
            <div key={idx} className="category-card">
              <div className="category-icon-wrapper">
                {category.icon}
              </div>
              <span className="category-name">{category.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="section-container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Trending Products</h2>
            <p className="section-subtitle">What's in-demand this week</p>
          </div>
          <div className="carousel-controls">
            <button className="carousel-btn">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"></path>
              </svg>
            </button>
            <button className="carousel-btn">
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"></path>
              </svg>
            </button>
          </div>
        </div>
        <div className="products-grid">
          {trendingProducts.map((product) => (
            <div key={product.id} className="product-card">
              {product.badge && (
                <span className={`product-tag ${product.badgeClass}`}>{product.badge}</span>
              )}
              <Link to={`/product/${product.id}`} className="product-image-container" style={{ display: 'block' }}>
                <img src={product.image} alt={product.name} className="product-img" />
              </Link>
              <span className="product-category">{product.category}</span>
              <Link to={`/product/${product.id}`}>
                <h3 className="product-name" style={{ cursor: 'pointer' }}>{product.name}</h3>
              </Link>
              <p className="product-desc">{product.description}</p>
              <div className="product-footer">
                <span className="product-price">₹{product.price.toFixed(2)}</span>
                <button className="add-to-cart-btn" aria-label={`Add ${product.name} to cart`}>+</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter / Coupon Banner */}
      <section className="newsletter-wrapper">
        <div className="newsletter-banner">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Get $10 Off Your First Order</h2>
            <p className="newsletter-text">
              Join the Raj Groceries family today and get exclusive access to daily deals and member discounts.
            </p>
          </div>
          <div className="newsletter-graphic">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z"></path>
            </svg>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
