import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../../context/LogoutButton';

const WorkerLobby: React.FC = () => {
  return (
    <div className="worker-lobby-container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Panel de Trabajadores</h1>
      <div className="worker-lobby-buttons" style={{ marginTop: '20px' }}>
        <Link to="/trabajadores/cocina">
          <button className="btn btn-lg btn-cocina" style={{ margin: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Cocina
          </button>
        </Link>
        <Link to="/trabajadores/barra">
          <button className="btn btn-lg btn-barra" style={{ margin: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Barra
          </button>
        </Link>
        <Link to="/trabajadores/comandero">
          <button className="btn btn-lg btn-comandero" style={{ margin: '10px', padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}>
            Comandero
          </button>
        </Link>
      </div>
      <LogoutButton />
    </div>
  );
};

export default WorkerLobby;