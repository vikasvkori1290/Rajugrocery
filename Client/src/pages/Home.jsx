import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero_bg.png';
import { products } from '../services/productsData';

const Home = () => {
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

  const trendingProducts = products.filter(p => [1, 12, 13, 14].includes(p.id));

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-wrapper">
        <div 
          className="hero-banner" 
          style={{ backgroundImage: `linear-gradient(to right, rgba(251, 251, 249, 0.9) 30%, rgba(251, 251, 249, 0.2) 80%), url(${heroBg})` }}
        >
          <span className="hero-badge">100% Organic</span>
          <h1 className="hero-title">Vibrant Freshness, Direct to Your Door.</h1>
          <p className="hero-subtitle">
            Experience the market-fresh quality of premium vegetables curated for your healthy lifestyle. No middleman, just pure nature.
          </p>
          <div className="hero-buttons">
            <button className="btn-primary">Shop Now</button>
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
            <p className="section-subtitle">What's fresh and in-demand this week</p>
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
                <span className="product-price">${product.price.toFixed(2)}</span>
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
              Join the VikaGroceries family today and get exclusive access to farm-to-table deals and seasonal recipes.
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
