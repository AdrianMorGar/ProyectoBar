import React, { useState, useEffect } from 'react';
import { fetchUsers, toggleUserStatus } from '../../../api';
import { Link } from 'react-router-dom';

interface Worker {
  id: number;
  nombre: string;
  habilitado: boolean;
}

const WorkerList: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const data = await fetchUsers();
        const filteredData = data.filter((worker: Worker) => worker.id !== 1);
        setWorkers(filteredData);
      } catch (error) {
        alert('Hubo un error al cargar los trabajadores.');
      }
    };
    loadWorkers();
  }, []);

  const handleDelete = async (workerId: number, nombre: string) => {
    const confirmDelete = window.confirm(
      `¿Estás seguro que deseas deshabilitar a "${nombre}"? Esto impedirá que acceda al sistema.`
    );
    if (!confirmDelete) return;

    try {
      await toggleUserStatus(workerId);
      setWorkers((prevWorkers) =>
        prevWorkers.filter((worker) => worker.id !== workerId)
      );
    } catch (error) {
      alert('Hubo un error al deshabilitar al trabajador.');
    }
  };

  return (
    <div className="worker-list-container">
      <div className="list-header">
        <h2>Gestión de Trabajadores</h2>
        <Link to="nuevo" className="btn btn-success">
          Añadir Trabajador
        </Link>
      </div>
      <ul className="workerList">
        {workers.map((worker) => (
          <li key={worker.id} className="worker-item">
            <span className="worker-name">{worker.nombre}</span>
            <div className="actions">
              <button
                onClick={() => handleDelete(worker.id, worker.nombre)}
                className="btn btn-sm btn-danger"
              >
                Deshabilitar
              </button>
              <Link to={`editar/${worker.id}`} className="btn btn-sm btn-info">
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