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
      alert('Trabajador deshabilitado exitosamente');
    } catch (error) {
      alert('Hubo un error al deshabilitar al trabajador.');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Lista de Trabajadores</h2>
      <Link to="nuevo" className="addButton">
        Añadir Trabajador
      </Link>

      <ul className="workerList">
        {workers.map((worker) => (
          <li key={worker.id} className="workerItem">
            <span className="workerName">{worker.nombre}</span>
            <div className="actions">
              <button
                onClick={() => handleDelete(worker.id, worker.nombre)}
                className="actionButton disableButton"
              >
                Deshabilitar
              </button>
              <Link to={`editar/${worker.id}`} className="actionButton updateButton">
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
