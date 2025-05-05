import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const OwnerDashboard: React.FC = () => {
  return (
    <div>
      <Header title="Panel del Dueño" />
      <div style={{ padding: '20px' }}>
        <h2>Bienvenido, Dueño</h2>
        <p>Desde aquí puedes gestionar tu negocio:</p>
        <ul>
          <li>
            <Link to="/carta">Gestionar Carta</Link>
          </li>
          <li>
            <Link to="/trabajadores">Gestionar Trabajadores</Link>
          </li>
          <li>
            <Link to="/ventas">Ver Ventas</Link>
          </li>
          <li>
            <Link to="/perfil">Actualizar Perfil</Link>
          </li>
        </ul>
      </div>
      <Footer />
    </div>
  );
};

export default OwnerDashboard;