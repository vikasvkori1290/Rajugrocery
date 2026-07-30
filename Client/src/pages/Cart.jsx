import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { products } from '../services/productsData';

const Cart = () => {
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount
  } = useContext(CartContext);

  // States
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);

  // Apply promo code (FRESH20 gives 20% discount on subtotal)
  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'FRESH20') {
      const discountVal = cartSubtotal * 0.20;
      setPromoDiscount(discountVal);
      setAppliedPromo('FRESH20');
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setPromoDiscount(0);
      setAppliedPromo('');
    }
  };

  // Recalculate summary details
  const deliveryFee = cartSubtotal > 20 || cartSubtotal === 0 ? 0 : 2.50;
  const serviceFee = cartSubtotal > 0 ? 1.50 : 0;
  const taxRate = 0.08; // 8% tax
  const estimatedTax = cartSubtotal * taxRate;
  const finalDiscount = appliedPromo === 'FRESH20' ? cartSubtotal * 0.20 : 0;
  const total = Math.max(0, cartSubtotal + deliveryFee + serviceFee + estimatedTax - finalDiscount);

  // Recommended items for "Wait! Don't forget..."
  // Filter for IDs: 4 (Kale), 3 (Blueberries), 10 (Bananas), 8 (Broccoli)
  const recommendations = products.filter(p => [4, 3, 10, 8].includes(p.id));

  return (
    <div className="cart-page-layout">
      {/* Header Info */}
      <div className="cart-header-section">
        <h1 className="cart-main-title">Your Shopping Basket</h1>
        <p className="cart-main-subtitle">Review your selection of fresh, digital market finds.</p>
        
        {/* Mobile Page Title Indicator */}
        <h2 className="mobile-cart-title">My Cart ({cartCount} Items)</h2>
        <p className="mobile-cart-subtitle">Review your selections for digital freshness.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart-container">
          <p className="empty-cart-text">Your basket is empty.</p>
          <Link to="/shop" className="btn-primary empty-cart-btn">Shop Fresh Groceries</Link>
        </div>
      ) : (
        <div className="cart-grid-container">
          {/* Left panel: items list */}
          <div className="cart-items-list">
            {cartItems.map((item) => {
              // Retrieve correct image from static productsData file
              const originalProduct = products.find(p => p.id === item.id);
              const displayImage = originalProduct ? originalProduct.image : item.image;

              return (
                <div key={`${item.id}-${item.selectedWeight}`} className="cart-item-card">
                  <div className="cart-item-image-wrapper">
                    <img src={displayImage} alt={item.name} className="cart-item-img" />
                  </div>
                  
                  <div className="cart-item-details">
                    <div className="cart-item-header">
                      {item.badge && (
                        <span className={`cart-item-badge ${item.badgeClass || 'organic'}`}>
                          {item.badge.toUpperCase()}
                        </span>
                      )}
                      <h3 className="cart-item-title">{item.name}</h3>
                      <p className="cart-item-desc">
                        {item.selectedWeight} &bull; {item.description || 'Fresh pick'}
                      </p>
                    </div>

                    <div className="cart-item-actions-row">
                      {/* Quantity selector */}
                      <div className="cart-item-qty-selector">
                        <button 
                          className="cart-qty-btn" 
                          onClick={() => updateQuantity(item.id, item.qty - 1, item.selectedWeight)}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="cart-qty-val">{item.qty}</span>
                        <button 
                          className="cart-qty-btn" 
                          onClick={() => updateQuantity(item.id, item.qty + 1, item.selectedWeight)}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button 
                        className="cart-remove-btn" 
                        onClick={() => removeFromCart(item.id, item.selectedWeight)}
                        aria-label="Remove item"
                      >
                        <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  <div className="cart-item-price-block">
                    <span className="cart-item-price-val">₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right panel: order summary card */}
          <div className="cart-summary-sidebar">
            <div className="cart-summary-card">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span className="summary-label">Subtotal ({cartCount} items)</span>
                <span className="summary-value">₹{cartSubtotal.toFixed(2)}</span>
              </div>
              
              {finalDiscount > 0 && (
                <div className="summary-row promo-discount-row">
                   <span className="summary-label">Promo Discount (20%)</span>
                  <span className="summary-value">-₹{finalDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="summary-row">
                <span className="summary-label">Delivery Fee</span>
                <span className="summary-value">
                  {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Service Fee</span>
                <span className="summary-value">₹{serviceFee.toFixed(2)}</span>
              </div>

              <div className="summary-row">
                <span className="summary-label">Estimated Tax</span>
                <span className="summary-value">₹{estimatedTax.toFixed(2)}</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total-row">
                <span className="total-label">Total</span>
                <span className="total-value">₹{total.toFixed(2)}</span>
              </div>

              <Link to="/checkout" className="summary-checkout-btn">
                <span>Proceed to Checkout</span>
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>

              <div className="summary-delivery-time">
                <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="3" width="15" height="13"></rect>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                  <circle cx="5.5" cy="18.5" r="2.5"></circle>
                  <circle cx="18.5" cy="18.5" r="2.5"></circle>
                </svg>
                <span>Estimated delivery: Today, 4:00 PM - 6:00 PM</span>
              </div>

              {/* Promo code field */}
              <div className="summary-promo-container">
                <label className="promo-label">PROMO CODE</label>
                <div className="promo-input-row">
                  <input 
                    type="text" 
                    placeholder="Enter code (e.g. FRESH20)" 
                    className="promo-input" 
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                  />
                  <button className="promo-apply-btn" onClick={handleApplyPromo}>Apply</button>
                </div>
                {promoError && <p className="promo-error-text">{promoError}</p>}
                {appliedPromo && <p className="promo-success-text">Code "{appliedPromo}" Applied!</p>}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Recommended items section */}
      <section className="cart-recommendations-section">
        <div className="recommendations-header-row">
          <h2 className="recommendations-section-title">Wait! Don't forget...</h2>
          <Link to="/shop" className="recommendations-view-all">
            View all recommendations &gt;
          </Link>
        </div>
        
        <div className="recommendations-grid">
          {recommendations.map((p) => (
            <div key={p.id} className="recommendation-card">
              <div className="rec-image-container">
                <img src={p.image} alt={p.name} className="rec-img" />
                <button 
                  className="rec-add-btn" 
                  onClick={() => addToCart(p, 1, p.weightOptions?.[0] || 'Each')}
                  aria-label={`Add ${p.name} to cart`}
                >
                  +
                </button>
              </div>
              <span className="rec-price">₹{p.price.toFixed(2)}</span>
              <h4 className="rec-name">{p.name}</h4>
              <button 
                className="mobile-rec-add-btn"
                onClick={() => addToCart(p, 1, p.weightOptions?.[0] || 'Each')}
              >
                Add
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Proceed to Checkout Button overlay spacer */}
      {cartItems.length > 0 && (
        <>
          <div className="mobile-checkout-spacer"></div>
          <div className="mobile-checkout-button-container">
            <Link to="/checkout" className="mobile-bottom-checkout-btn" style={{ display: 'block', textDecoration: 'none' }}>
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}

    </div>
  );
};

export default Cart;
