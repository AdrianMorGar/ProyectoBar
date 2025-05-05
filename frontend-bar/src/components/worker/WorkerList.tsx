import React, { useState, useEffect } from 'react';
import { fetchUsers, toggleUserStatus } from '../../api';
import { Link } from 'react-router-dom';

interface Worker {
  id: number;
  nombre: string;
  habilitado: boolean;
}

const WorkerList: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);

  // Cargar trabajadores desde el backend
  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const data = await fetchUsers();
        // Filtrar para excluir al dueño (ID = 1)
        const filteredData = data.filter((worker: Worker) => worker.id !== 1);
        setWorkers(filteredData);
      } catch (error) {
        alert('Hubo un error al cargar los trabajadores.');
      }
    };
    loadWorkers();
  }, []);

  // Función para habilitar/deshabilitar un trabajador
  const handleToggleStatus = async (workerId: number) => {
    try {
      await toggleUserStatus(workerId);
      setWorkers((prevWorkers) =>
        prevWorkers.map((worker) =>
          worker.id === workerId ? { ...worker, habilitado: !worker.habilitado } : worker
        )
      );
    } catch (error) {
      alert('Hubo un error al cambiar el estado del trabajador.');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Lista de Trabajadores</h2>
      <Link to="/trabajadores/nuevo" className="addButton">
        Añadir Trabajador
      </Link>

      <ul className="workerList">
        {workers.map((worker) => (
          <li key={worker.id} className="workerItem">
            <span className="workerName">{worker.nombre}</span>
            <div className="actions">
              <button
                onClick={() => handleToggleStatus(worker.id)}
                className={`actionButton ${worker.habilitado ? 'disableButton' : 'enableButton'}`}
              >
                {worker.habilitado ? 'Deshabilitar' : 'Habilitar'}
              </button>
              <Link
                to={`/trabajadores/editar/${worker.id}`}
                className="actionButton updateButton"
              >
                Actualizar
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WorkerList;