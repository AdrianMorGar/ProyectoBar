import React from 'react';
import { Link } from 'react-router-dom';

const WorkerLobby: React.FC = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Panel de Trabajadores</h1>
      <div style={{ marginTop: '20px' }}>
        <Link to="/trabajadores/cocina">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
            Cocina
          </button>
        </Link>
        <Link to="/trabajadores/barra">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
            Barra
          </button>
        </Link>
        <Link to="/trabajadores/comandero">
          <button style={{ margin: '10px', padding: '10px 20px', fontSize: '16px' }}>
            Comandero
          </button>
        </Link>
      </div>
    </div>
  );
};

export default WorkerLobby;