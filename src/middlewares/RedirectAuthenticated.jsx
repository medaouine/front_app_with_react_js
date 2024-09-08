import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectAuthenticated = ({ element, isAuthenticated, role }) => {
  if (isAuthenticated) {
    if (role === 'admin') {
      return <Navigate to="/admindashboard" />;
    } else if (role === 'user') {
      return <Navigate to="/products" />;
    }
  }

  return element;
};

export default RedirectAuthenticated;
