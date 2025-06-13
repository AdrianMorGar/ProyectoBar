import React, { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import * as AuthContext from './AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: Array<'DUENO' | 'TRABAJADOR'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { token, user, isLoading } = AuthContext.useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Verificando autenticación...</div>;
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.rol)) {
    alert(`No tienes permiso para acceder a esta página. Rol requerido: ${roles.join('/')}, Tu rol: ${user.rol}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;