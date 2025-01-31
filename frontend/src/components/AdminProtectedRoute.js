import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  console.log("userrr", user);

  if (!isAuthenticated || user.role == "admin") {
    alert("please log in first and ensure you have admin access");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
