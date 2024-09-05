import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import './login.css';
import {
  setIsLoggedinToTrue,
  setIsLoggedinToFalse,
} from './../../../cartSlice'; 





const Login = () => {




  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setLoading(true); 

    try {
      const response = await axios.post('http://127.0.0.1:4000/login', { email, password });

      if (response.status === 200) {
        console.log('Login successful:', response.data);

        localStorage.setItem('isAuthenticated', "yes");
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('name', response.data.user.name);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('role', response.data.user.role);
        dispatch(setIsLoggedinToTrue());
       // dispatch(setIsLoggedinToFalse()); 
       

          navigate('/');
       
      } else {
        console.log('Unexpected response status:', response.status);
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        switch (status) {
          case 400:
            setError('User not found. Please check your email.');
            break;
          case 401:
            setError('Incorrect password. Please try again.');
            break;
          case 500:
            setError('Internal server error. Please try again later.');
            break;
          default:
            setError('An unexpected error occurred. Please try again.');
            break;
        }
      } else {
        console.error('Login error:', error.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">

     
        <h2 className="login-heading">Login</h2>



        {error && <div className="login-alert">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
         
          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;







