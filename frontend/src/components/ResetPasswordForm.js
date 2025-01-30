import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetPassword } from '../actions/userAction'; 
import { useParams } from 'react-router-dom';

const ResetPasswordForm = () => {
  const dispatch = useDispatch();
  const { token } = useParams(); // Get the token from the URL params
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
    // If password reset is successful, redirect or show success message
    return <div>Password reset successful. You can now log in.</div>;
  }

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">New Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
