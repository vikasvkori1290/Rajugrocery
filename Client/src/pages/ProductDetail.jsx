import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  const [selectedWeight, setSelectedWeight] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);
  
  // Accordion state
  const [descOpen, setDescOpen] = useState(true);
  const [nutritionOpen, setNutritionOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          const normalized = {
            ...data,
            id: data._id,
            image: data.images?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500',
            thumbnails: data.images && data.images.length > 0 ? data.images.map(img => img.url) : [data.images?.[0]?.url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500'],
            weightOptions: ['1 kg', '2 kg', '5 kg'],
            badge: data.stock < 10 ? 'Low Stock' : '',
            originalPrice: data.price * 1.2
          };
          setProduct(normalized);
          setActiveImage(normalized.image);
          setSelectedWeight(normalized.weightOptions[0]);
        } else {
          throw new Error('Not found');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch product details', err);
        setProduct(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedWeight(product.weightOptions?.[0] || 'Each');
      setQuantity(1);
    }
  }, [product]);

  const handleQtyChange = (type) => {
    if (type === 'dec' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'inc') {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToBasket = () => {
    addToCart(product, quantity, selectedWeight);
  };

  if (loading || !product) {
    return <div style={{ padding: '80px', textAlign: 'center', fontSize: '18px', fontWeight: 600 }}>Loading product details...</div>;
  }

  // Get similar products (exclude current)
  const similarProducts = [];

  return (
    <div className="product-detail-page">
      {/* Desktop Breadcrumbs */}
      <div className="detail-breadcrumbs">
        <Link to="/shop">Shop</Link>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-category">{product.category}</span>
        <span className="breadcrumb-separator">&gt;</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      {/* Main Detail Container */}
      <div className="detail-main-container">
        
        {/* Left Side: Images */}
        <div className="detail-left-gallery">
          <div className="detail-main-image-card">
            {product.badge && (
              <span className={`detail-product-tag ${product.badgeClass}`}>
                {product.badge.toUpperCase()}
              </span>
            )}
            <img 
              src={activeImage} 
              alt={product.name} 
              className="detail-main-img" 
            />
            {/* Zoom icon bottom right */}
            <button className="detail-zoom-btn" aria-label="Zoom image">
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </button>

            {/* Mobile Header Overlay Buttons */}
            <div className="mobile-header-overlays">
              <button className="mobile-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <div className="mobile-right-actions">
                <button className="mobile-action-btn" aria-label="Share">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                  </svg>
                </button>
                <button 
                  className={`mobile-action-btn ${isWishlist ? 'active' : ''}`} 
                  onClick={() => setIsWishlist(!isWishlist)}
                  aria-label="Add to wishlist"
                >
                  <svg stroke="currentColor" fill={isWishlist ? 'currentColor' : 'none'} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Thumbnails */}
          <div className="detail-thumbnails-row">
            {product.thumbnails && product.thumbnails.map((thumb, idx) => (
              <button 
                key={idx}
                className={`detail-thumb-btn ${activeImage === thumb ? 'active' : ''}`}
                onClick={() => setActiveImage(thumb)}
              >
                <img src={thumb} alt={`${product.name} view ${idx + 1}`} className="detail-thumb-img" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Info Panel */}
        <div className="detail-right-info">
          
          {/* Wishlist Button (Desktop) */}
          <div className="detail-header-row">
            <span className="detail-subtitle-text">
              {product.variety} &bull; {product.source} &bull; {product.freshness}
            </span>
            <button 
              className={`detail-wishlist-btn ${isWishlist ? 'active' : ''}`}
              onClick={() => setIsWishlist(!isWishlist)}
              aria-label="Add to wishlist"
            >
              <svg stroke="currentColor" fill={isWishlist ? 'currentColor' : 'none'} strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.4em" width="1.4em" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </button>
          </div>

          <h1 className="detail-title">{product.name}</h1>

          {/* Pricing */}
          <div className="detail-price-row">
            <span className="detail-price-amount">₹{product.price.toFixed(2)}</span>
            {product.unit && <span className="detail-price-unit">{product.unit.replace('$', '₹')}</span>}
          </div>

          {/* Weight Options */}
          <div className="detail-weight-section">
            <h3 className="detail-section-label">SELECT WEIGHT</h3>
            <div className="detail-weight-options">
              {product.weightOptions.map((option, idx) => (
                <button
                  key={idx}
                  className={`detail-weight-btn ${selectedWeight === option ? 'active' : ''}`}
                  onClick={() => setSelectedWeight(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="detail-cart-section">
            <div className="detail-qty-selector">
              <button 
                className="qty-btn" 
                onClick={() => handleQtyChange('dec')}
                aria-label="Decrease quantity"
              >
                &mdash;
              </button>
              <span className="qty-value">{quantity}</span>
              <button 
                className="qty-btn" 
                onClick={() => handleQtyChange('inc')}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button className="detail-add-btn" onClick={handleAddToBasket}>
              <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Add to Basket</span>
            </button>
          </div>

          {/* Guarantees Block */}
          <div className="detail-guarantees-card">
            <div className="guarantee-row">
              <div className="guarantee-icon-container">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div className="guarantee-text-container">
                <h4 className="guarantee-title">Freshness Guarantee</h4>
                <p className="guarantee-desc">Picked at peak ripeness or your money back.</p>
              </div>
            </div>
            <div className="guarantee-row">
              <div className="guarantee-icon-container">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
              </div>
              <div className="guarantee-text-container">
                <h4 className="guarantee-title">Express Delivery</h4>
                <p className="guarantee-desc">Arrives within 2 hours of ordering.</p>
              </div>
            </div>
          </div>

          {/* Accordion List */}
          <div className="detail-accordions">
            {/* Description Accordion */}
            <div className="accordion-item">
              <button 
                className="accordion-header"
                onClick={() => setDescOpen(!descOpen)}
              >
                <span>Product Description</span>
                <span className={`accordion-caret ${descOpen ? 'open' : ''}`}>
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>
              {descOpen && (
                <div className="accordion-content">
                  <p className="accordion-desc-p">{product.details}</p>
                  <ul className="accordion-bullets">
                    {product.bullets && product.bullets.map((bullet, idx) => (
                      <li key={idx}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Nutritional Facts Accordion */}
            <div className="accordion-item">
              <button 
                className="accordion-header"
                onClick={() => setNutritionOpen(!nutritionOpen)}
              >
                <span>Nutritional Facts</span>
                <span className={`accordion-caret ${nutritionOpen ? 'open' : ''}`}>
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </span>
              </button>
              {nutritionOpen && (
                <div className="accordion-content">
                  <p className="nutrition-serving">Serving size: {product.nutrition.serving}</p>
                  <div className="nutrition-grid">
                    <div className="nutrition-card">
                      <span className="nutrition-val">{product.nutrition.kcal}</span>
                      <span className="nutrition-label">kcal</span>
                    </div>
                    <div className="nutrition-card">
                      <span className="nutrition-val">{product.nutrition.carbs}</span>
                      <span className="nutrition-label">Carbs</span>
                    </div>
                    <div className="nutrition-card">
                      <span className="nutrition-val">{product.nutrition.fiber}</span>
                      <span className="nutrition-label">Fiber</span>
                    </div>
                    <div className="nutrition-card">
                      <span className="nutrition-val">{product.nutrition.protein}</span>
                      <span className="nutrition-label">Protein</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Complete Your Selection (Desktop Related Products) */}
      <section className="detail-related-section">
        <h2 className="related-section-title">Complete Your Selection</h2>
        <div className="related-products-grid">
          {similarProducts.map((p) => (
            <Link to={`/product/${p.id}`} key={p.id} className="product-card">
              {p.badge && (
                <span className={`product-tag ${p.badgeClass}`}>{p.badge}</span>
              )}
              <div className="product-image-container">
                <img src={p.image} alt={p.name} className="product-img" />
              </div>
              <span className="product-category">{p.category}</span>
              <h3 className="product-name" style={{ fontSize: '14px', minHeight: '38px' }}>{p.name}</h3>
              <p className="product-desc" style={{ fontSize: '11px', minHeight: '20px' }}>{p.description}</p>
              <div className="product-footer">
                <span className="product-price">₹{p.price.toFixed(2)}</span>
                <button className="add-to-cart-btn" aria-label={`Add ${p.name} to cart`}>+</button>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mobile Sticky Bottom Selector & Button */}
      <div className="mobile-sticky-bottom-bar">
        <div className="mobile-qty-block">
          <button className="mobile-qty-btn" onClick={() => handleQtyChange('dec')}>-</button>
          <span className="mobile-qty-val">{quantity}</span>
          <button className="mobile-qty-btn" onClick={() => handleQtyChange('inc')}>+</button>
        </div>
        <button className="mobile-add-to-cart-btn" onClick={handleAddToBasket}>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          <span>Add to Cart</span>
        </button>
      </div>

    </div>
  );
};

export default ProductDetail;
