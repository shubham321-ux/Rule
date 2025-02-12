import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from './Loading';
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated,user } = useSelector((state) => state.user);
  console.log("isAuthenticated:", isAuthenticated,user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) {
    return <Loading/>;
  }

  if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
