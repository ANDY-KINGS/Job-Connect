import React from 'react';
import { Navigate } from 'react-router-dom';

const GuestRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (token) {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const redirectPath =
      user.role === 'admin' ? '/admin' :
        user.role === 'employer' ? '/employer' :
          user.role === 'user' ? '/user/dashboard' : '/jobseeker';
    return <Navigate to={redirectPath} replace />;
  }
  return children;
};

export default GuestRoute;