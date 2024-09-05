import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import './register.css';
import {
  setIsLoggedinToTrue,
  setIsLoggedinToFalse,
} from './../../../cartSlice'; 

const Register = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const [success, setSuccess] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setSuccess(null); 
    setLoading(true); 

    try {
      const response = await axios.post('http://127.0.0.1:4000/register', { name, email, password });

      if (response.status === 201 && response.data.accessToken && response.data.refreshToken) {

         console.log("response from register route",response.data.accessToken, response.status)

        console.log('Registration successful:', response.data);
        localStorage.setItem('isAuthenticated', "yes");
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('name', response.data.user.name);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('role', response.data.user.role);

        const role = response.data.user.role;

        dispatch(setIsLoggedinToTrue());
        //dispatch(setIsLoggedinToFalse()); 

      
          navigate('/');
       
      } else {
        console.log('Unexpected response status or missing tokens:', response.status);
        setError('An unexpected error occurred. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        const { status } = error.response;
        switch (status) {
          case 400:
            setError('Email already taken. Please use a different email.');
            break;
          case 500:
            setError('Internal server error. Please try again later.');
            break;
          default:
            setError('An unexpected error occurred. Please try again.');
            break;
        }
      } else {
        console.error('Registration error:', error.message);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-heading">Register</h2>
        {error && <div className="register-alert">{error}</div>} 
        {success && <div className="register-alert success">{success}</div>} 
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
