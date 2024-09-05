import React from 'react';
import { Outlet } from 'react-router-dom';
import MyNavBar from '../../mynavbar/MyNavBar'; 
import './MainLayout.css';

function MainLayout() {
  return (
    <>


  <MyNavBar />



  <Outlet />
  
    </>
  );
}

export default MainLayout;


