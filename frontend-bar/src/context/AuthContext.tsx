import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface UserData {
  id: number;
  nombre: string;
  rol: 'DUENO' | 'TRABAJADOR';
}

interface AuthContextType {
  token: string | null;
  user: UserData | null;
  login: (jwtToken: string, userData: UserData, redirect?: boolean) => void;
  logout: () => void;
  isLoading: boolean;
  refreshLogin: (username: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [user, setUser] = useState<UserData | null>(JSON.parse(localStorage.getItem('authUser') || 'null'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setIsLoading(false);
  }, []);

  const login = (jwtToken: string, userData: UserData, redirect = true) => {
    localStorage.setItem('authToken', jwtToken);
    localStorage.setItem('authUser', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;

    if (redirect) {
      if (userData.rol === 'DUENO') {
        navigate('/dueno/carta');
      } else if (userData.rol === 'TRABAJADOR') {
        navigate('/trabajadores');
      } else {
        navigate('/');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const refreshLogin = async (username: string, password: string) => {
    try {
      const response = await axios.post(
        'https://competitive-lin-adrian-morgar394-0f4897ac.koyeb.app/bar/api/auth/login',
        // 'http://localhost:8080/bar/api/auth/login',
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = response.headers.authorization?.split(' ')[1];
      const userData = response.data;

      if (token && userData) {
        login(token, userData, false);
      } else {
        throw new Error('No se pudo refrescar el token');
      }
    } catch (error) {
      console.error('Error al refrescar login:', error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading, refreshLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
