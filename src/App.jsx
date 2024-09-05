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

  let isAuthenticated= localStorage.getItem('isAuthenticated') === "yes";

  

  if(isAuthenticated){
    dispatch(setIsLoggedinToTrue());
    setIsLoggedinToTrue
  }else{
    dispatch(setIsLoggedinToFalse()); 
  }

  console.log ("isAuthenticated",isAuthenticated);
  console.log ("isLoggedin from redux ",isLoggedin);




  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<RedirectAuthenticated element={<Login />} isAuthenticated={isAuthenticated} />} />
          <Route path="/register" element={<RedirectAuthenticated element={<Register />} isAuthenticated={isAuthenticated} />} />
          <Route path="/products" element={<ProtectedRoute element={<Product />} isAuthenticated={isAuthenticated} />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} isAuthenticated={isAuthenticated} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;