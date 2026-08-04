import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const OtpVerify = () => {
  const { verifyOtp, resendOtp, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // References for digit inputs to auto focus shift
  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Focus next input box
    if (element.value !== '' && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace to delete and focus previous
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    if (pasteData.length === 6 && !isNaN(pasteData)) {
      const pasteOtp = pasteData.split('');
      setOtp(pasteOtp);
      inputRefs[5].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits of the OTP code.');
      setLoading(false);
      return;
    }

    const res = await verifyOtp(email, otpCode);
    setLoading(false);

    if (res.success) {
      setSuccess('Email verified successfully! Redirecting...');
      setTimeout(() => navigate('/profile'), 1500);
    } else {
      setError(res.message || 'Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    setError('');
    setSuccess('');
    setCanResend(false);
    
    const res = await resendOtp(email);
    if (res.success) {
      setSuccess('A new 6-digit OTP code has been sent to your email.');
      setTimer(60);
    } else {
      setError(res.message || 'Failed to resend OTP.');
      setCanResend(true);
    }
  };

  return (
    <div className="login-portal-layout" style={{ margin: '40px auto' }}>
      <div className="login-card" style={{ maxWidth: '480px', padding: '40px 36px' }}>
        <div className="login-logo">
          <div className="brand-icon-box" style={{ backgroundColor: '#2D5A27', color: 'white' }}>R</div>
          <span className="login-logo-text" style={{ color: '#2D5A27' }}>Raj Groceries</span>
        </div>
        
        <h2 className="login-title">Verify Email</h2>
        <p className="login-subtitle">
          We have sent a 6-digit OTP verification code to:<br/>
          <strong style={{ color: '#111827' }}>{email}</strong>
        </p>

        {error && <div className="login-error-alert" style={{ marginBottom: '24px' }}>{error}</div>}
        {success && <div style={{ backgroundColor: '#D1FAE5', color: '#065F46', padding: '14px', borderRadius: '8px', marginBottom: '24px', fontWeight: 600, fontSize: '14px', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Digit Inputs Row */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '12px', 
              marginBottom: '32px' 
            }}
            onPaste={handlePaste}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                ref={inputRefs[index]}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                style={{
                  width: '50px',
                  height: '56px',
                  borderRadius: '10px',
                  border: '2px solid #E5E7EB',
                  textAlign: 'center',
                  fontSize: '22px',
                  fontWeight: 800,
                  color: '#111827',
                  backgroundColor: '#F9FAFB',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#2D5A27';
                  e.target.style.backgroundColor = '#FFFFFF';
                  e.target.style.boxShadow = '0 0 0 3px rgba(45, 90, 39, 0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#E5E7EB';
                  e.target.style.backgroundColor = '#F9FAFB';
                  e.target.style.boxShadow = 'none';
                }}
              />
            ))}
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            style={{ backgroundColor: '#2D5A27' }} 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>

        <div style={{ marginTop: '28px', fontSize: '14px', color: '#6B7280' }}>
          Didn't receive the code?{' '}
          {canResend ? (
            <button 
              onClick={handleResend}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FF8C42',
                fontWeight: 800,
                cursor: 'pointer',
                padding: 0,
                fontSize: '14px'
              }}
            >
              Resend OTP
            </button>
          ) : (
            <span>Resend code in <strong style={{ color: '#111827' }}>{timer}s</strong></span>
          )}
        </div>

        <p style={{ marginTop: '20px', fontSize: '13px' }}>
          <Link to="/login" style={{ color: '#9CA3AF', textDecoration: 'none' }}>&larr; Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;
