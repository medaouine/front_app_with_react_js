import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom'; 

const useResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        text: 'Please make sure the new password and confirmation password match.',
      });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:4000/reset-password', { token, newPassword });
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: response.data,
      }).then(() => {
        navigate('/'); 
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err.response?.data || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    handleSubmit,
    loading,
  };
};

export default useResetPassword;
