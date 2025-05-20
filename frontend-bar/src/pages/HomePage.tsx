import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenido al Sistema del Bar</h1>
      <div style={{ marginTop: '20px' }}>
        <Link to="/dueno">
          <button style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px' }}>
            Panel del Dueño
          </button>
        </Link>
        <Link to="/trabajadores">
          <button style={{ padding: '10px 20px', fontSize: '16px' }}>
            Panel de Trabajadores
          </button>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;