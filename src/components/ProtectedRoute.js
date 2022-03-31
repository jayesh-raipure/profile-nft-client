import React from "react";
// import { Redirect, Route } from "react-router-dom";
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes = () => {
  const authLogin = localStorage.getItem("metaMask_token")
  
  console.log("authLogin", authLogin);

  return authLogin 
    ? <Outlet />
    : <Navigate to="/login" />;
}


export default PrivateRoutes;