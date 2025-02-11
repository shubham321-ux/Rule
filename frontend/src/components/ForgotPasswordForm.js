import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../actions/userAction';
import { useNavigate } from 'react-router-dom';
import './css/ForgotPassword.css';

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector((state) => state.user);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="auth-card success-card">
          <div className="success-message">
            <h2>Email Sent!</h2>
            <p>Check your email for a password reset link.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="form-header">
          <h2>Forgot Password</h2>
        </div>
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                className="form-input"
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button 
              className="submit-button" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
