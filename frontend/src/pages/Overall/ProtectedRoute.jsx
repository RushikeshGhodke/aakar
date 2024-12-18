import React from 'react';
import { Navigate } from 'react-router-dom';
import { useEmployee } from '../EmployeeContext';

const ProtectedRoute = ({ children }) => {
  const { loggedIn } = useEmployee(); // Ensure this is updated on refresh

  return loggedIn ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
