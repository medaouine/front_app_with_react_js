
import { useDispatch, useSelector } from 'react-redux';
import { setLoaderToTrue, setLoaderToFalse } from  './../cartSlice'; 
import Swal from 'sweetalert2';
import axios from 'axios';
import { useState } from 'react';

const useForgetPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(setLoaderToTrue());

    try {
      const response = await axios.post('http://127.0.0.1:4000/forgot-password', { email });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data,
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data || 'An error occurred',
      });
    } finally {
      dispatch(setLoaderToFalse());
    }
  };

  return {
    email,
    setEmail,
    handleSubmit,
    loading,
  };
};

export default useForgetPassword;
