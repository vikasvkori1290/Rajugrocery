import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await register(name, email, password, phone);
    setLoading(false);

    if (res.success) {
      navigate('/profile');
    } else if (res.requiresVerification) {
      navigate(`/verify-otp?email=${res.email}`);
    } else {
      setError(res.message || 'Registration failed');
    }
  };

  return (
    <div className="login-portal-layout" style={{ margin: '40px auto' }}>
      <div className="login-card" style={{ maxWidth: '450px', padding: '36px' }}>
        <div className="login-logo">
          <div className="brand-icon-box" style={{ backgroundColor: '#2D5A27', color: 'white' }}>R</div>
          <span className="login-logo-text" style={{ color: '#2D5A27' }}>Raj Groceries</span>
        </div>
        <h2 className="login-title">Create Account</h2>
        <p className="login-subtitle">Join Raj Groceries to track orders and earn premium loyalty points!</p>

        {error && <div className="login-error-alert" style={{ marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. John Doe"
            />
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="e.g. customer@example.com"
            />
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Phone Number</label>
            <input
              type="tel"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder="e.g. +91 99999 99999"
            />
          </div>

          <div className="form-group" style={{ textAlign: 'left' }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min 6 characters"
                minLength={6}
                style={{ paddingRight: '45px' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  padding: '4px',
                  color: '#FF8C42'
                }}
              >
                {showPassword ? 'HIDE' : 'SHOW'}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" style={{ backgroundColor: '#2D5A27' }} disabled={loading}>
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>

        <p style={{ marginTop: '24px', fontSize: '14px', color: '#6B7280' }}>
          Already have an account? <Link to="/login" style={{ color: '#FF8C42', fontWeight: 700, textDecoration: 'none' }}>Sign In here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
