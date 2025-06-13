import React from 'react';
import { useAuth } from './AuthContext';

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    document.cookie = "JSESSIONID=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    logout();
  };

  return (
    <button
      onClick={handleLogout}
      className='owner-logout-button'
    >
      Cerrar sesión
    </button>
  );
};

export default LogoutButton;
