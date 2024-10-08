import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import './MyNavBar.css';
import useLogout from '../../hooks/useLogout';
import {
  setIsLoggedinToTrue,
  setIsLoggedinToFalse,
} from './../../cartSlice'; 


function MyNavBar() {
  const { axiosInstance } =useLogout();
  const dispatch = useDispatch();
  const cartItemCount = useSelector((state) => state.shoppingCart.length);
  const grandTotal = useSelector((state) => state.grandTotal);
  //const isAuthenticated = useSelector((state) => state.isLogged); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const reduxIsAuthenticated = useSelector((state) => state.isLogged);

 
  const navigate = useNavigate();


  useEffect(() => {
    setIsAuthenticated(reduxIsAuthenticated);
  }, [reduxIsAuthenticated]);











  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    try {
    
      const response = await axiosInstance.delete('http://127.0.0.1:4000/logout', {
        data: { token: refreshToken },
      });



      if (response.status === 200 && response.data.message === "success") {
        console.log('Logout response:', response.data.message);

        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('name');
        localStorage.removeItem('email');
        localStorage.removeItem('role');

         dispatch(setIsLoggedinToFalse());
        console.log('Logout successful. Redirecting to login.');
        navigate('/');
      } else {
        console.error('Unexpected response:', response.data);
      }
   

   










    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="navbar">
      <div className="navbar-section navbar-logo">
        <span className="company-name">MyCompany</span>
      </div>
      <nav className="navbar-section navbar-links">
        {!isAuthenticated ? (
          <>
            <NavLink to="/register" end className={({ isActive }) => isActive ? 'active-link' : ''}>Register</NavLink>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active-link' : ''}>Login</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/products" className={({ isActive }) => isActive ? 'active-link' : ''}>Products</NavLink>
            <NavLink to="/cart" className={({ isActive }) => isActive ? 'active-link' : ''}>
              Cart
              {cartItemCount > 0 && (
                <span className="cart-info">
                  <span className="cart-count">{cartItemCount}</span>
                  <span className="grand-total">${grandTotal.toFixed(2)}</span>
                </span>
              )}
            </NavLink>
            <NavLink 
              to="#"
              className="logout-link"
              onClick={(e) => {
                e.preventDefault();
                handleLogout();
              }}
            >
              Logout
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default MyNavBar;