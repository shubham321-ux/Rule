import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// ProtectedRoute Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    alert("please log in first for this ")
    return <Navigate to="/login" replace />;
  }

  // If the user is authenticated, render the children (the protected route)
  return children;
};

export default ProtectedRoute;
