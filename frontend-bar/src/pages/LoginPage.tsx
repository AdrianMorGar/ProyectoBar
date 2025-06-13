import React from 'react';
import LoginForm from '../components/auth/LoginForm';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { token, user } = useAuth();

  if (token && user) {
    return user.rol === 'DUENO' ? <Navigate to="/dueno/carta" replace /> : <Navigate to="/trabajadores" replace />;
  }

  return (
    <LoginForm />
  );
};

export default LoginPage;