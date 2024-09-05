import React from 'react';
import { Navigate } from 'react-router-dom';

const RedirectAuthenticated = ({ element, isAuthenticated }) => {
  return isAuthenticated ? <Navigate to="/products" /> : element;
};

export default RedirectAuthenticated;
