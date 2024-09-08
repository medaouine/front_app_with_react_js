import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setIsLoggedinToTrue } from './../cartSlice'; 

const useLogin = () => {
    const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:4000/login', { email, password });

      if (response.status === 200) {
        localStorage.setItem('isAuthenticated', 'yes');
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        localStorage.setItem('name', response.data.user.name);
        localStorage.setItem('email', response.data.user.email);
        localStorage.setItem('role', response.data.user.role);
        dispatch(setIsLoggedinToTrue());

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Login successful',
        });

        // Redirect to home page
        navigate('/');
      } else {
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
        setError('An unexpected error occurred. Please try again.');
      }

    
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: error.response?.data?.message || 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
    loading,
    error,
  };
};

export default useLogin;
