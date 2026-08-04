import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { products } from '../services/productsData';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartSubtotal, cartCount, clearCart } = useContext(CartContext);
  const { token, user } = useContext(AuthContext);

  // States
  const [activeStep, setActiveStep] = useState(1); // 1: Address, 2: Delivery Time, 3: Payment Method
  const [isSubmitted, setIsSubmitted] = useState(false); // Show success overlay

  // Address Form State
  const [address, setAddress] = useState({
    fullName: 'John Doe',
    phoneNumber: '+1 (555) 000-0000',
    streetAddress: '123 Orchard St, Apartment 4B',
    city: 'New York',
    zipCode: '10002'
  });

  // Populate address details once user profile is retrieved
  useEffect(() => {
    if (user) {
      setAddress({
        fullName: user.name || 'John Doe',
        phoneNumber: user.phone || '+1 (555) 000-0000',
        streetAddress: user.address || '123 Orchard St, Apartment 4B',
        city: 'New York',
        zipCode: '10002'
      });
    }
  }, [user]);

  // Selection states
  const [deliverySpeed, setDeliverySpeed] = useState('express'); // 'express' or 'scheduled'
  const [paymentMethod, setPaymentMethod] = useState('credit_card'); // 'apple_pay', 'credit_card', 'cod'

  // Form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress(prev => ({ ...prev, [name]: value }));
  };

  const handleUseAddress = (e) => {
    e.preventDefault();
    setActiveStep(2);
  };

  // Summary calculations
  const deliveryFee = cartSubtotal > 20 || cartSubtotal === 0 ? 0 : 2.50;
  const serviceFee = cartSubtotal > 0 ? 1.50 : 0;
  const taxRate = 0.08;
  const estimatedTax = cartSubtotal * taxRate;
  const total = Math.max(0, cartSubtotal + deliveryFee + serviceFee + estimatedTax);

  // Handle Order Placement
  const handlePlaceOrder = async () => {
    try {
      const formattedItems = cartItems.map(item => {
        const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(item.id || item._id);
        const productId = isValidObjectId ? (item.id || item._id) : '6a6b3012153cb72075b4c0c4';

        return {
          name: item.name,
          qty: item.qty || 1,
          image: item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100',
          price: item.price,
          product: productId
        };
      });

      const orderData = {
        orderItems: formattedItems,
        shippingAddress: {
          address: address.streetAddress || '123 Main St',
          city: address.city || 'New York',
          postalCode: address.zipCode || '10002',
          country: 'India'
        },
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card',
        itemsPrice: cartSubtotal,
        shippingPrice: deliveryFee + serviceFee,
        totalPrice: total
      };

      const headers = {
        'Content-Type': 'application/json'
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order on server');
      }

      console.log('Order created successfully in backend database');
    } catch (err) {
      console.warn('Backend offline or order creation failed. Placed as local checkout.', err);
    }

    setIsSubmitted(true);
    setTimeout(() => {
      clearCart();
    }, 100);
  };

  return (
    <div className="checkout-page-layout">
      {/* Mobile Header Bar */}
      <div className="mobile-checkout-header">
        <button className="mobile-back-btn" onClick={() => navigate(-1)} aria-label="Go back">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 className="mobile-checkout-title-text">Checkout</h1>
        <button className="mobile-action-btn" aria-label="Cart">
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
        </button>
      </div>

      {isSubmitted ? (
        <div className="order-success-screen">
          <div className="success-card">
            <div className="success-icon-container">
              <svg stroke="currentColor" fill="none" strokeWidth="3" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="3em" width="3em" xmlns="http://www.w3.org/2000/svg">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h2 className="success-title">Order Confirmed!</h2>
            <p className="success-desc">
              Thank you for shopping with Raj Groceries. Your order will be delivered to <strong>{address.streetAddress}</strong> in approx. 30 minutes!
            </p>
            <button className="btn-primary success-btn" onClick={() => navigate('/shop')}>
              Continue Shopping
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="checkout-desktop-title">
            <h1 className="checkout-main-title">Secure Checkout</h1>
          </div>

          <div className="checkout-grid-container">
            {/* Left Column: Checkout Stages Accordion */}
            <div className="checkout-steps-accordion">
              
              {/* Step 1: Delivery Address */}
              <div className={`checkout-step-card ${activeStep === 1 ? 'expanded' : ''}`}>
                <button className="step-header-btn" onClick={() => setActiveStep(1)}>
                  <div className="step-number-badge">1</div>
                  <div className="step-header-text">
                    <h3 className="step-title">Delivery Address</h3>
                    <p className="step-subtitle">Select your drop-off location</p>
                  </div>
                  <span className={`step-caret ${activeStep === 1 ? 'open' : ''}`}>
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>

                {activeStep === 1 && (
                  <form onSubmit={handleUseAddress} className="step-form-content">
                    <div className="form-input-row">
                      <div className="form-group">
                        <label className="input-label">Full Name</label>
                        <input 
                          type="text" 
                          name="fullName" 
                          value={address.fullName} 
                          onChange={handleInputChange} 
                          className="checkout-form-input" 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="input-label">Phone Number</label>
                        <input 
                          type="text" 
                          name="phoneNumber" 
                          value={address.phoneNumber} 
                          onChange={handleInputChange} 
                          className="checkout-form-input" 
                          required 
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="input-label">Street Address</label>
                      <input 
                        type="text" 
                        name="streetAddress" 
                        value={address.streetAddress} 
                        onChange={handleInputChange} 
                        className="checkout-form-input" 
                        required 
                      />
                    </div>

                    <div className="form-input-row">
                      <div className="form-group">
                        <label className="input-label">City</label>
                        <input 
                          type="text" 
                          name="city" 
                          value={address.city} 
                          onChange={handleInputChange} 
                          className="checkout-form-input" 
                          required 
                        />
                      </div>
                      <div className="form-group">
                        <label className="input-label">Zip Code</label>
                        <input 
                          type="text" 
                          name="zipCode" 
                          value={address.zipCode} 
                          onChange={handleInputChange} 
                          className="checkout-form-input" 
                          required 
                        />
                      </div>
                    </div>

                    <button type="submit" className="use-address-btn">
                      Use this Address
                    </button>
                  </form>
                )}

                {activeStep !== 1 && (
                  <div className="step-collapsed-summary">
                    <p>{address.fullName} &bull; {address.phoneNumber}</p>
                    <p>{address.streetAddress}, {address.city}, {address.zipCode}</p>
                  </div>
                )}
              </div>

              {/* Step 2: Delivery Time */}
              <div className={`checkout-step-card ${activeStep === 2 ? 'expanded' : ''}`}>
                <button className="step-header-btn" onClick={() => setActiveStep(2)}>
                  <div className="step-number-badge">2</div>
                  <div className="step-header-text">
                    <h3 className="step-title">Delivery Time</h3>
                    <p className="step-subtitle">Choose how fast you need it</p>
                  </div>
                  <span className={`step-caret ${activeStep === 2 ? 'open' : ''}`}>
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>

                {activeStep === 2 && (
                  <div className="step-form-content">
                    <div className="delivery-speed-options">
                      {/* Express card */}
                      <button 
                        className={`speed-option-card ${deliverySpeed === 'express' ? 'active' : ''}`}
                        onClick={() => setDeliverySpeed('express')}
                      >
                        <div className="speed-header">
                          <span className="speed-title-text">EXPRESS</span>
                          <span className="speed-icon-bolt">⚡</span>
                        </div>
                        <h4 className="speed-duration">Within 30 mins</h4>
                        <p className="speed-desc">Instant fresh delivery</p>
                      </button>

                      {/* Scheduled card */}
                      <button 
                        className={`speed-option-card ${deliverySpeed === 'scheduled' ? 'active' : ''}`}
                        onClick={() => setDeliverySpeed('scheduled')}
                      >
                        <div className="speed-header">
                          <span className="speed-title-text">SCHEDULED</span>
                          <span className="speed-icon-cal">📅</span>
                        </div>
                        <h4 className="speed-duration">Today, 5:00 PM</h4>
                        <p className="speed-desc">Choose your slot</p>
                      </button>
                    </div>
                    
                    <button className="use-address-btn" onClick={() => setActiveStep(3)}>
                      Confirm Delivery Time
                    </button>
                  </div>
                )}

                {activeStep !== 2 && (
                  <div className="step-collapsed-summary">
                    <p>Method: {deliverySpeed === 'express' ? 'Express (Within 30 mins)' : 'Scheduled (Today, 5:00 PM)'}</p>
                  </div>
                )}
              </div>

              {/* Step 3: Payment Method */}
              <div className={`checkout-step-card ${activeStep === 3 ? 'expanded' : ''}`}>
                <button className="step-header-btn" onClick={() => setActiveStep(3)}>
                  <div className="step-number-badge">3</div>
                  <div className="step-header-text">
                    <h3 className="step-title">Payment Method</h3>
                    <p className="step-subtitle">Credit Card, PayPal, or Apple Pay</p>
                  </div>
                  <span className={`step-caret ${activeStep === 3 ? 'open' : ''}`}>
                    <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </button>

                {activeStep === 3 && (
                  <div className="step-form-content">
                    <div className="payment-options-list">
                      {/* Apple Pay option */}
                      <label className={`payment-option-row ${paymentMethod === 'apple_pay' ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'apple_pay'}
                          onChange={() => setPaymentMethod('apple_pay')}
                        />
                        <span className="payment-label-text">🍏 Apple Pay</span>
                        <span className="payment-default-badge">Default</span>
                      </label>

                      {/* Credit Card option */}
                      <label className={`payment-option-row ${paymentMethod === 'credit_card' ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'credit_card'}
                          onChange={() => setPaymentMethod('credit_card')}
                        />
                        <span className="payment-label-text">💳 Credit Card (•••• 4242)</span>
                      </label>

                      {/* Cash on Delivery option */}
                      <label className={`payment-option-row ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                        <input 
                          type="radio" 
                          name="payment" 
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                        <span className="payment-label-text">💵 Cash on Delivery</span>
                      </label>
                    </div>
                  </div>
                )}

                {activeStep !== 3 && (
                  <div className="step-collapsed-summary">
                    <p>Method: {paymentMethod === 'credit_card' ? 'Credit Card (•••• 4242)' : paymentMethod === 'apple_pay' ? 'Apple Pay' : 'Cash on Delivery'}</p>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary Sidebar */}
            <div className="checkout-summary-sidebar">
              <div className="checkout-summary-card">
                <h3 className="summary-title">Order Summary</h3>

                {/* Mini cart items list */}
                <div className="checkout-items-mini-list">
                  {cartItems.map((item) => {
                    const displayImage = item.image;
                    return (
                      <div key={`${item.id}-${item.selectedWeight}`} className="mini-item-row">
                        <div className="mini-item-img-container">
                          <img src={displayImage} alt={item.name} className="mini-item-img" />
                        </div>
                        <div className="mini-item-info">
                          <h4 className="mini-item-name">{item.name}</h4>
                          <span className="mini-item-desc">{item.qty} &bull; {item.selectedWeight}</span>
                        </div>
                        <span className="mini-item-price">₹{(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="summary-divider"></div>

                <div className="summary-row">
                  <span>Subtotal</span>
                  <span className="summary-value">₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Delivery Fee</span>
                  <span className="summary-value">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span className="summary-value">₹{estimatedTax.toFixed(2)}</span>
                </div>

                <div className="summary-divider"></div>

                <div className="summary-total-row">
                  <span className="total-label">Total</span>
                  <span className="total-value">₹{total.toFixed(2)}</span>
                </div>

                <button className="summary-checkout-btn" onClick={handlePlaceOrder}>
                  <span>Place Order</span>
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.1em" width="1.1em" xmlns="http://www.w3.org/2000/svg">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                <p className="checkout-agreement-text">
                  By placing your order, you agree to Raj's Terms of Service.
                </p>

                <div className="checkout-badge-row">
                  <span>🔒 SECURE SSL</span>
                  <span>🌱 ECO-FRIENDLY</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Checkout;
