import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, isAuthenticated, loading, updateProfile } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // List of 8 premium avatar image URLs
  const avatars = [
    '/avatars/shinchan.png',
    '/avatars/nobita.png',
    '/avatars/doraemon.png',
    '/avatars/shizuka.png',
    '/avatars/shiva.png',
    '/avatars/doremi.png',
    '/avatars/gian.png',
    '/avatars/suneo.png'
  ];

  // Profile Edit modal states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [updating, setUpdating] = useState(false);

  // Address Edit modal states
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressText, setEditAddressText] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch user orders dynamically from DB
      api.get('/orders/myorders')
        .then(({ data }) => {
          setOrders(data || []);
        })
        .catch((err) => {
          console.error('Error fetching user orders', err);
        })
        .finally(() => {
          setOrdersLoading(false);
        });

      // Show welcome coins popup once per session
      const shownBefore = sessionStorage.getItem('welcomePopupShown');
      if (!shownBefore) {
        setShowPopup(true);
        sessionStorage.setItem('welcomePopupShown', 'true');
      }
    }
  }, [isAuthenticated]);

  // Fallback / Redirect if not authenticated
  if (loading) {
    return <div style={{ padding: '80px', textAlign: 'center', fontSize: '18px', fontWeight: 600 }}>Loading Account Console...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const user = {
    fullName: authUser?.name || 'Customer',
    email: authUser?.email || '',
    phone: authUser?.phone || 'Not Provided',
    memberSince: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'March 2026',
    points: 1000, // 1000 Raj Coins
  };

  const handleEditClick = () => {
    setEditName(user.fullName);
    setEditPhone(user.phone === 'Not Provided' ? '' : user.phone);
    setEditAvatar(authUser?.avatar || avatars[1]);
    setEditError('');
    setEditSuccess('');
    setIsEditing(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    setUpdating(true);

    const res = await updateProfile({ name: editName, phone: editPhone, avatar: editAvatar });
    setUpdating(false);

    if (res.success) {
      setEditSuccess('Profile updated successfully!');
      setTimeout(() => setIsEditing(false), 1000);
    } else {
      setEditError(res.message || 'Failed to update profile');
    }
  };

  const handleAddressEditClick = () => {
    setEditAddressText(authUser?.address || '');
    setIsEditingAddress(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const res = await updateProfile({ address: editAddressText });
    setUpdating(false);
    if (res.success) {
      setIsEditingAddress(false);
    }
  };

  return (
    <div className="profile-page-wrapper">
      {/* Welcome Congratulatory Popup */}
      {showPopup && (
        <div className="welcome-popup-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          animation: 'fadeIn 0.3s'
        }}>
          <div className="welcome-popup-card" style={{
            background: '#ffffff',
            padding: '40px',
            borderRadius: '24px',
            textAlign: 'center',
            maxWidth: '400px',
            width: '95%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1.5px solid #F1ECE4'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: '#2D5A27', fontWeight: 800, fontSize: '24px', marginBottom: '12px' }}>Congratulations!</h2>
            <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: '1.6', marginBottom: '24px' }}>
              You have received <strong style={{ color: '#FF8C42' }}>100 Raj Coins</strong> for registering with Raj Groceries!
            </p>
            <button 
              onClick={() => setShowPopup(false)}
              style={{
                backgroundColor: '#2D5A27',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '15px',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(45, 90, 39, 0.2)'
              }}
            >
              Claim Coins
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="welcome-popup-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="welcome-popup-card" style={{
            background: '#ffffff',
            padding: '32px',
            borderRadius: '20px',
            maxWidth: '450px',
            width: '95%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1.5px solid #F1ECE4',
            textAlign: 'left'
          }}>
            <h2 style={{ color: '#2D5A27', fontWeight: 800, fontSize: '22px', marginBottom: '8px' }}>Edit Personal Info</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>Choose your avatar, and update your name or phone number.</p>

            {editError && <div className="login-error-alert" style={{ marginBottom: '16px' }}>{editError}</div>}
            {editSuccess && <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontWeight: 600, fontSize: '14px' }}>{editSuccess}</div>}

            <form onSubmit={handleEditSubmit}>
              {/* Avatar Selector Grid */}
              <div className="form-group">
                <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Select Profile Avatar</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {avatars.map((av, idx) => (
                    <img 
                      key={idx}
                      src={av} 
                      alt={`Avatar ${idx + 1}`}
                      onClick={() => setEditAvatar(av)}
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: editAvatar === av ? '3px solid #2D5A27' : '2px solid transparent',
                        transform: editAvatar === av ? 'scale(1.05)' : 'none',
                        boxShadow: editAvatar === av ? '0 4px 10px rgba(45,90,39,0.25)' : 'none',
                        transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  placeholder="e.g. +91 99999 99999"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address (Read-only)</label>
                <input 
                  type="email" 
                  className="form-input" 
                  value={user.email} 
                  disabled 
                  style={{ backgroundColor: '#E5E7EB', color: '#4B5563', cursor: 'not-allowed' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#F3F4F6',
                    color: '#4B5563',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '30px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updating}
                  style={{
                    flex: 1,
                    backgroundColor: '#2D5A27',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '30px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Address Modal */}
      {isEditingAddress && (
        <div className="welcome-popup-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div className="welcome-popup-card" style={{
            background: '#ffffff',
            padding: '36px',
            borderRadius: '20px',
            maxWidth: '450px',
            width: '95%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            border: '1.5px solid #F1ECE4',
            textAlign: 'left'
          }}>
            <h2 style={{ color: '#2D5A27', fontWeight: 800, fontSize: '22px', marginBottom: '8px' }}>Edit Default Address</h2>
            <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '24px' }}>Enter your complete home address for grocery deliveries.</p>

            <form onSubmit={handleAddressSubmit}>
              <div className="form-group">
                <label className="form-label">Delivery Address</label>
                <textarea 
                  className="form-input" 
                  value={editAddressText}
                  onChange={(e) => setEditAddressText(e.target.value)}
                  required 
                  rows={4}
                  placeholder="Street Name, Building, Flat No., City, State, Pin Code"
                  style={{ resize: 'none', height: 'auto' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsEditingAddress(false)}
                  style={{
                    flex: 1,
                    backgroundColor: '#F3F4F6',
                    color: '#4B5563',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '30px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updating}
                  style={{
                    flex: 1,
                    backgroundColor: '#2D5A27',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '30px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {updating ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Back button for mobile */}
      <div className="profile-mobile-header">
        <button className="mobile-back-btn" onClick={() => navigate(-1)}>
          <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <span className="profile-mobile-title">My Account</span>
      </div>

      <div className="profile-layout-grid">
        {/* LEFT SIDEBAR PANEL */}
        <aside className="profile-sidebar-panel">
          <div className="profile-avatar-section">
            <div className="profile-avatar-container" onClick={handleEditClick} style={{ cursor: 'pointer' }}>
              <img 
                src={authUser?.avatar || avatars[1]} 
                alt={user.fullName} 
                className="profile-avatar-img" 
              />
              <button className="profile-avatar-edit-badge" onClick={(e) => { e.stopPropagation(); handleEditClick(); }}>edit</button>
            </div>
            <h3 className="profile-name-text">{user.fullName}</h3>
            <p className="profile-subtitle-text">{user.email}</p>
          </div>

          <nav className="profile-sidebar-menu">
            <button 
              className={`profile-menu-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="profile-menu-icon">👤</span> My Profile
            </button>
            <button 
              className={`profile-menu-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="profile-menu-icon">📋</span> Order History
            </button>
            <button 
              className={`profile-menu-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <span className="profile-menu-icon">📍</span> Saved Addresses
            </button>
            <button 
              className={`profile-menu-item ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              <span className="profile-menu-icon">💳</span> Payment Methods
            </button>
            <button 
              className={`profile-menu-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <span className="profile-menu-icon">🔔</span> Notifications
            </button>
            <button 
              className="profile-menu-item signout-btn"
              onClick={logout}
            >
              <span className="profile-menu-icon">🚪</span> Sign Out
            </button>
          </nav>
        </aside>

        {/* RIGHT DETAILS VIEWPORT */}
        <main className="profile-details-viewport">
          {activeTab === 'profile' && (
            <div className="tab-view-container animate-fade-in">
              <div className="details-header-row">
                <div>
                  <h1 className="viewport-main-title">Account Overview</h1>
                  <p className="viewport-subtitle">Manage your account details and track your fresh deliveries.</p>
                </div>
                <button className="edit-profile-btn" onClick={handleEditClick}>Edit Profile</button>
              </div>

              {/* Personal Info & Address Cards */}
              <div className="overview-cards-grid">
                <div className="overview-card info-card" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="card-section-title" style={{ margin: 0 }}>Personal Information</h3>
                    <button 
                      onClick={handleEditClick}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#FF8C42',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="info-fields-grid">
                    <div>
                      <span className="field-label">FULL NAME</span>
                      <p className="field-val">{user.fullName}</p>
                    </div>
                    <div>
                      <span className="field-label">EMAIL ADDRESS</span>
                      <p className="field-val">{user.email}</p>
                    </div>
                    <div>
                      <span className="field-label">PHONE NUMBER</span>
                      <p className="field-val">{user.phone}</p>
                    </div>
                    <div>
                      <span className="field-label">MEMBER SINCE</span>
                      <p className="field-val">{user.memberSince}</p>
                    </div>
                  </div>
                </div>

                <div className="overview-card address-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="card-section-title" style={{ margin: 0 }}>Default Address</h3>
                    <span className="primary-address-badge">PRIMARY</span>
                  </div>
                  <div className="address-details-block">
                    {authUser?.address ? (
                      <>
                        <h4 className="address-title-text">Home Address</h4>
                        <p className="address-street-text" style={{ whiteSpace: 'pre-wrap' }}>{authUser.address}</p>
                      </>
                    ) : (
                      <p className="address-street-text" style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No address saved yet</p>
                    )}
                  </div>
                  <button className="change-address-link" onClick={handleAddressEditClick}>
                    {authUser?.address ? 'Change Address >' : 'Add Address >'}
                  </button>
                </div>
              </div>

              {/* Recent Orders section */}
              <div className="recent-orders-section">
                <div className="section-header-bar">
                  <h3 className="card-section-title">Recent Orders</h3>
                  <button className="view-all-orders-link" onClick={() => setActiveTab('orders')}>View all orders</button>
                </div>

                {ordersLoading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '30px 20px' }}>
                    <p style={{ color: '#6B7280', marginBottom: '16px', fontSize: '15px' }}>No recent orders found.</p>
                    <Link to="/shop" className="order-row-action-btn" style={{ textDecoration: 'none', display: 'inline-block' }}>
                      Shop Now
                    </Link>
                  </div>
                ) : (
                  <div className="orders-cards-list">
                    {orders.slice(0, 3).map((ord) => (
                      <div key={ord._id} className="order-summary-row">
                        <div className="order-row-left">
                          <img src={ord.orderItems?.[0]?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'} alt="Order item thumbnail" className="order-row-thumb" />
                          <div>
                            <h4 className="order-id-label">Order #{ord._id?.slice(-8).toUpperCase()}</h4>
                            <p className="order-row-desc">{ord.orderItems?.length || 0} items &bull; ₹{ord.totalPrice?.toFixed(2)} &bull; {new Date(ord.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="order-row-right">
                          <span className={`status-pill delivered`}>{ord.status || 'Received'}</span>
                          <button className="order-row-action-btn" onClick={() => navigate(`/checkout`)}>Re-order items</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Rewards & fresh pass cards */}
              <div className="rewards-pass-grid">
                <div className="rewards-card-green">
                  <div className="rewards-header">
                    <div>
                      <p className="rewards-label">RAJ REWARDS</p>
                      <h2 className="rewards-points-count">{user.points.toLocaleString()} Raj Coins</h2>
                    </div>
                    <span className="rewards-stars-icon">⭐</span>
                  </div>
                  <div className="rewards-progress-container">
                    <div className="rewards-progress-bar" style={{ width: '80%' }}></div>
                  </div>
                  <p className="rewards-footer-text">550 coins until your next ₹500 reward</p>
                </div>

                <div className="freshpass-card">
                  <div className="freshpass-icon-box">eco</div>
                  <div className="freshpass-info-block">
                    <h4 className="freshpass-title">Delivery Pass Monthly</h4>
                    <p className="freshpass-expiry">Active &bull; Next billing Oct 28</p>
                  </div>
                  <button className="freshpass-action-arrow">&rarr;</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="tab-view-container animate-fade-in">
              <h1 className="viewport-main-title">Order History</h1>
              <p className="viewport-subtitle">Review details of your current and past transactions.</p>
              
              {ordersLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>Loading your transactions...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '50px 20px', background: 'white', borderRadius: '16px', marginTop: '24px', border: '1.5px solid #F1ECE4' }}>
                  <p style={{ color: '#6B7280', marginBottom: '20px', fontSize: '16px' }}>No orders found in your history.</p>
                  <Link to="/shop" className="order-row-action-btn" style={{ textDecoration: 'none', padding: '12px 30px', fontSize: '14px' }}>
                    Shop Now
                  </Link>
                </div>
              ) : (
                <div className="orders-cards-list" style={{ marginTop: '24px' }}>
                  {orders.map((ord) => (
                    <div key={ord._id} className="order-summary-row" style={{ padding: '24px', backgroundColor: 'white', borderRadius: '16px', border: '1.5px solid #F1ECE4', marginBottom: '12px' }}>
                      <div className="order-row-left">
                        <img src={ord.orderItems?.[0]?.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=80'} alt="Order item thumbnail" className="order-row-thumb" style={{ width: '64px', height: '64px' }} />
                        <div>
                          <h4 className="order-id-label" style={{ fontSize: '16px' }}>Order #{ord._id?.slice(-8).toUpperCase()}</h4>
                          <p className="order-row-desc">{ord.orderItems?.length || 0} items &bull; ₹{ord.totalPrice?.toFixed(2)} &bull; {new Date(ord.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="order-row-right">
                        <span className={`status-pill delivered`}>{ord.status || 'Received'}</span>
                        <button className="order-row-action-btn">View Invoice</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="tab-view-container animate-fade-in">
              <div className="details-header-row">
                <div>
                  <h1 className="viewport-main-title">Saved Addresses</h1>
                  <p className="viewport-subtitle">Manage your shipping and delivery destinations.</p>
                </div>
                <button className="edit-profile-btn" onClick={handleAddressEditClick}>
                  {authUser?.address ? 'Edit Address' : '+ Add Address'}
                </button>
              </div>

              <div className="overview-cards-grid" style={{ marginTop: '24px' }}>
                <div className="overview-card address-card" style={{ maxWidth: '400px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 className="card-section-title" style={{ margin: 0 }}>Home</h3>
                    <span className="primary-address-badge">PRIMARY</span>
                  </div>
                  {authUser?.address ? (
                    <p className="address-street-text" style={{ whiteSpace: 'pre-wrap' }}>{authUser.address}</p>
                  ) : (
                    <p className="address-street-text" style={{ color: '#9CA3AF', fontStyle: 'italic' }}>No address saved yet</p>
                  )}
                  <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
                    <button className="change-address-link" onClick={handleAddressEditClick} style={{ fontSize: '13px' }}>Edit</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="tab-view-container animate-fade-in">
              <div className="details-header-row">
                <div>
                  <h1 className="viewport-main-title">Payment Methods</h1>
                  <p className="viewport-subtitle">Configure your credit cards and online payment wallets.</p>
                </div>
                <button className="edit-profile-btn">+ Add Payment Card</button>
              </div>

              <div className="overview-cards-grid" style={{ marginTop: '24px' }}>
                <div className="overview-card address-card" style={{ maxWidth: '400px', backgroundColor: '#F9FAFB' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '24px' }}>💳</span>
                    <span className="primary-address-badge" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>DEFAULT</span>
                  </div>
                  <h4 className="address-title-text" style={{ fontSize: '16px' }}>Visa Ending in 4242</h4>
                  <p className="address-street-text" style={{ color: '#9CA3AF' }}>Expires 12/2028</p>
                  <button className="change-address-link" style={{ marginTop: '16px', fontSize: '13px', color: '#EF4444' }}>Remove</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="tab-view-container animate-fade-in">
              <h1 className="viewport-main-title">Notifications</h1>
              <p className="viewport-subtitle">Configure how you receive updates about orders and promotions.</p>
              
              <div className="overview-card info-card" style={{ marginTop: '24px', padding: '32px' }}>
                <div className="form-group" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Order Status Updates</h4>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>Get updates about your delivery package in real-time.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#2D5A27' }} />
                </div>
                
                <div style={{ height: '1px', backgroundColor: '#F3F4F6', margin: '20px 0' }}></div>

                <div className="form-group" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: '#111827' }}>Promotions & Coupons</h4>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>Receive alerts when there are discount events or vouchers.</p>
                  </div>
                  <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: '#2D5A27' }} />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
