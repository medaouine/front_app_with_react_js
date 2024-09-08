import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';

import {
    setIsLoggedinToTrue,
    setIsLoggedinToFalse,
    setLoaderToTrue,
    setLoaderToFalse

  } from './../cartSlice'; 





const getStoredTokens = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  return { accessToken, refreshToken };
};


const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
};

const REFRESH_ENDPOINT = 'http://127.0.0.1:4000/token';

const getApiUrl = () => {
  const role = localStorage.getItem('role');
  if (role === 'admin') {
    return 'http://127.0.0.1:4000/';
  } else if (role === 'user') {
    return 'http://127.0.0.1:4000/';
  } else {
  
    return 'http://127.0.0.1:4000/delivery';
  }
};


const  useLogout = () => {

  const dispatch = useDispatch();
 



  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const axiosInstance = axios.create({
    baseURL: getApiUrl(),
    headers: {
      'Content-Type': 'application/json',
    },
  });



  console.log(" getApiUrl()===============",getApiUrl())
  axiosInstance.interceptors.request.use(
    (config) => {
      dispatch(setLoaderToTrue()); 
      const { accessToken } = getStoredTokens();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log('acessToken added to header ');
      }
      return config;
    },
    (error) => {
      dispatch(setLoaderToFalse()); // Set loading state to false on error
      console.error('Request error:', error);

      console.log("========error===== ",error)
      return Promise.reject(error);
    }
  );


  axiosInstance.interceptors.response.use(
    (response) => {
      dispatch(setLoaderToFalse()); // Set loading state to false on success
      console.log('=============orginal request succeded========================');

      return response;
    },
    async (error) => {
      const { response } = error;
      dispatch(setLoaderToFalse()); // Set loading state to false on error
      console.log('======Response error for original request=========', response);

      const { status } = response;

      if (status === 403 && !isRefreshing) {
        console.log('==================Token expired, refreshing====================================');
        setIsRefreshing(true);
        const { refreshToken } = getStoredTokens();

        try {
         
          const { data } = await axios.post(REFRESH_ENDPOINT, { refreshToken });
          console.log('==================Received new tokens============================');
          const { accessToken: newAccessToken } = data;

          
          storeTokens(newAccessToken, refreshToken);

          console.log('==================retrying the original request ===========================');
          const originalRequest = response.config;
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          setIsRefreshing(false);
          console.log('Retrying original request with new token:');
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          console.error('Error refreshing token:', refreshError);
          setIsRefreshing(false);
        
          console.log('================== redirect to login============================');
          dispatch(setIsLoggedinToFalse()); 
          navigate('/');
          return Promise.reject(refreshError);
        }
      }

      console.error('Unhandled error:', error);
      return Promise.reject(error);
    }
  );


  return {
    axiosInstance,
    error,
 
  };
};

export default  useLogout;










