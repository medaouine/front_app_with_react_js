import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch } from 'react-redux';
import { setIsLoggedinToTrue } from './../cartSlice'; 
import { useNavigate } from 'react-router-dom';

const useRegister = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    error: null,
    success: null,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState((prevState) => ({ ...prevState, error: null, success: null }));
    setLoading(true);

    const { name, email, password, confirmPassword } = formState;

    // Validate password and confirm password
    if (password !== confirmPassword) {
      setLoading(false);
      setFormState((prevState) => ({ ...prevState, error: 'Passwords do not match.' }));
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:4000/register', { name, email, password });

      if (response.status === 201 && response.data.accessToken && response.data.refreshToken) {
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
          text: 'Registration successful',
        });

        navigate('/');
      } else {
        setFormState((prevState) => ({ ...prevState, error: 'An unexpected error occurred. Please try again.' }));
      }
    } catch (error) {
      let errorMessage = 'An unexpected error occurred. Please try again.';

      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            errorMessage = 'Email already taken. Please use a different email.';
            break;
          case 500:
            errorMessage = 'Internal server error. Please try again later.';
            break;
          default:
            errorMessage = 'An unexpected error occurred. Please try again.';
            break;
        }

        if (data && data.message) {
          errorMessage = data.message;
        }
      }

      setFormState((prevState) => ({ ...prevState, error: errorMessage }));
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formState,
    handleChange,
    handleSubmit,
    loading,
  };
};

export default useRegister;
