import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import useLogout from '../../../hooks/useLogout';
import './AdminLayout.css'; 
import { useDispatch } from 'react-redux'; 
import { addProduct ,addTocart,setIsLoggedinToFalse} from './../../../cartSlice'; 

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { axiosInstance } =useLogout();

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
    <div className="admin-layout">
      <div className="sidebar">
        <h2>Admin Dashboard</h2>
        <nav>
          <ul>
            <li>
              <NavLink
                to="/admindashboard"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admindashproducts"
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                Products
              </NavLink>
            </li>
          </ul>
        </nav>
        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div className="main-section">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
