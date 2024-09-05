import { useState , useEffect} from 'react'   
import { BrowserRouter as Router, Routes, Route, Link ,Navigate} from 'react-router-dom';
import './App.css'
import  Register from './components/pages/register/Register';
import Login from './components/pages/login/Login';
import Product from './components/pages/products/Product';
import MainLayout from './components/layouts/mainLayout/MainLayout';
import Cart from './components/pages/cart/Cart';
import { useSelector, useDispatch } from 'react-redux';
import ProtectedRoute from './middlewares/ProtectedRoute';
import RedirectAuthenticated from './middlewares/RedirectAuthenticated';

import {
  setIsLoggedinToTrue,
  setIsLoggedinToFalse,
} from './cartSlice'; 

function App() {

  const isLoggedin = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === "yes";
    dispatch(isAuthenticated ? setIsLoggedinToTrue() : setIsLoggedinToFalse());
  }, [dispatch]);


  
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<RedirectAuthenticated element={<Login />} isAuthenticated={isLoggedin} />} />
          <Route path="/register" element={<RedirectAuthenticated element={<Register />} isAuthenticated={isLoggedin} />} />
          <Route path="/products" element={<ProtectedRoute element={<Product />} isAuthenticated={isLoggedin} />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} isAuthenticated={isLoggedin} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;