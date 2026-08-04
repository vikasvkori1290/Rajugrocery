import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

const Login = () => {
  const { login, isAuthenticated } = useContext(AdminAuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@rajgroceries.com');
  const [password, setPassword] = useState('adminpassword');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate('/');
    } else {
      setError(res.message || 'Invalid credentials');
    }
  };

  return (
    <div className="login-portal-layout">
      <div className="login-card">
        <div className="login-logo">
          <div className="brand-icon-box">R</div>
          <span className="login-logo-text">RajAdmin</span>
        </div>
        <h2 className="login-title">Admin Console</h2>
        <p className="login-subtitle">Sign in using administrative credentials</p>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
