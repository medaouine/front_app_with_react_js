import { useState , useEffect} from 'react'   
import { BrowserRouter as Router, Routes, Route, Link ,Navigate} from 'react-router-dom';
import './App.css'
import  Register from './components/pages/register/Register';

import  ForgetPassword from './components/pages/forgetpassword/ForgetPassword';
import  ResetPassword  from './components/pages/resetpassord/ResetPassword';

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
import NoPageFound from './components/pages/nopagefound/NoPageFound';
import AdminLayout from './components/layouts/adminlayout/AdminLayout';
import AdminUsers from './components/pages/adminpages/users/AdminUsers';
import AdminProduct from './components/pages/adminpages/products/AdminProduct';




function App() {

  const isLoggedin = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();
   const isAuthenticated = localStorage.getItem('isAuthenticated') === "yes";
   const role = localStorage.getItem('role');
   useEffect(() => {
     dispatch(isAuthenticated ? setIsLoggedinToTrue() : setIsLoggedinToFalse());
   }, [dispatch]); 
 
   console.log(" isLoggedin", isLoggedin);
   console.log("role", isLoggedin);
  // 
  return (
    <Router>
      <Routes>    
        <Route element={<MainLayout />}>
          <Route path="/" element={<RedirectAuthenticated element={<Login />} isAuthenticated={isLoggedin}   role= {role} />} />
          <Route path="/register" element={<RedirectAuthenticated element={<Register />} isAuthenticated={isLoggedin}  role= {role}/>} />
          <Route path="/forgetpassword" element={<RedirectAuthenticated element={<ForgetPassword/>} isAuthenticated={isLoggedin}  role= {role}/>} />
          <Route path="/resetpassword" element={<RedirectAuthenticated element={<ResetPassword />} isAuthenticated={isLoggedin} role= {role} />} />
          <Route path="/products" element={<ProtectedRoute element={<Product />} isAuthenticated={isLoggedin} role={role}  requiredRole ="user"  />} />
          <Route path="/cart" element={<ProtectedRoute element={<Cart />} isAuthenticated={isLoggedin}  role={role}    requiredRole ="user" />} />      
        </Route>


        <Route element={<AdminLayout />}>
          <Route path="/admindashboard" element={<ProtectedRoute element={<AdminUsers/>  } isAuthenticated={isLoggedin}   role= {role} />} />  
          <Route path="/admindashproducts" element={<ProtectedRoute element={<AdminProduct/>} isAuthenticated={isLoggedin}   role= {role} />} />  
        
        
        </Route>



        <Route path="/unauthorized" element={<h1 style={{ marginTop: '100px'}}> Unauthorized</h1>}  />
        <Route path="/*" element={<NoPageFound/>} /> 

      
   


      </Routes>



    
    </Router>
  );
}

export default App;