import React from 'react'
import { Navigate } from 'react-router-dom';

const PublicRoutes = ({ children }) => {
  const token = localStorage.getItem('token');
  return token? <Navigate to='/events' /> : children
}

export default PublicRoutes
