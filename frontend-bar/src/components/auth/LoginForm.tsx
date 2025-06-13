import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

// const API_LOGIN_URL = 'https://rubber-stesha-adrianmorgar-e368679c.koyeb.app/bar/api/auth/login';
const API_LOGIN_URL = 'http://localhost:8080/bar/api/auth/login';


const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await axios.post(
        API_LOGIN_URL,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const tokenHeader = response.headers.authorization;
      const token = tokenHeader?.split(' ')[1];
      const userData = response.data;

      if (token && userData) {
        login(token, userData);
      } else {
        setError('Respuesta de login inválida del servidor.');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        if (err.response.status === 401 || err.response.status === 403) {
          setError('Nombre de usuario o contraseña incorrectos.');
        } else {
          setError(`Error al iniciar sesión: ${err.response.data.message || err.message}`); // CORREGIDO
        }
      } else {
        setError('Error de red o servidor. Inténtalo más tarde.');
      }
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-form-wrapper">
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
          <div className="logo-container">
            <img src="/img/logo.png" alt="Logo" className="logo-img" />
          </div>
          <h2>Iniciar Sesión</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Usuario:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Contraseña:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
              />
            </div>
            {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
            <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
              Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;