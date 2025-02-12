import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../actions/userAction';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './css/ResetPassword.css';
const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const { loading, error, success } = useSelector((state) => state.user);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match.");
    } else {
      dispatch(resetPassword(token, password));
    }
  };

  if (success) {
    return (
      <div className="login-container">
        <div className="auth-card success-card">
          <div className="success-message">
            <h2>Password Reset Successful!</h2>
            <p>You can now log in with your new password.</p>
            <button className="submit-button" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="auth-card">
        <div className="form-header">
          <h2>Reset Password</h2>
        </div>
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">New Password</label>
              <input
                className="form-input"
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                className="form-input"
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button 
              className="submit-button" 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
