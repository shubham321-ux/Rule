import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  console.log("User", user);

  // If not authenticated or the user is not an admin, redirect to login page
  if (!isAuthenticated || user.role !== "admin") {
    alert("Please log in first and ensure you have admin access.");
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated and is an admin, allow access to the protected route
  return children;
};

export default AdminProtectedRoute;
