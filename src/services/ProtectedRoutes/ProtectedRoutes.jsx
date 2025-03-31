import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }) => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  if (!token) {
    return <Navigate to="/sign-in" />;
  }

  if (!username) {
    return <Navigate to="/category" />;
  }

  return children;
};

export default ProtectedRoutes;