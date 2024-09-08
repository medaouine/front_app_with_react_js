import { useSelector } from 'react-redux';

const useAuthStatus = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') ;
  const role = localStorage.getItem('role') ;

  return { isAuthenticated, role };
};

export default useAuthStatus;
