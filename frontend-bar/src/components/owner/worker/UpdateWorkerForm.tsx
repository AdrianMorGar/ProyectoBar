import React, { useState, useEffect } from 'react';
import { fetchUserById, updateUser } from '../../../api';
import { useAuth } from '../../../context/AuthContext';

interface FormData {
  id: number;
  nombre: string;
  contrasena: string;
  habilitado: boolean;
}

const UpdateWorkerForm: React.FC<{ workerId: number }> = ({ workerId }) => {
  const [formData, setFormData] = useState<FormData>({
    id: workerId,
    nombre: '',
    contrasena: '',
    habilitado: true,
  });

  const { user, refreshLogin } = useAuth();

  useEffect(() => {
    const loadWorker = async () => {
      try {
        const data = await fetchUserById(workerId);
        setFormData({
          id: data.id,
          nombre: data.nombre,
          contrasena: '',
          habilitado: data.habilitado,
        });
      } catch (error) {
        alert('Hubo un error al cargar los datos del trabajador.');
      }
    };
    loadWorker();
  }, [workerId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData.id, formData);

      if (user && user.id === formData.id) {
        await refreshLogin(formData.nombre, formData.contrasena);

        setTimeout(() => {
          window.location.reload();
        }, 300); // espera mínima para que el nuevo token se propague antes de las próximas llamadas
      } else {
        window.location.href = ('/dueno/trabajadores');
      }
    } catch (error) {
      console.error(error);
      alert('Hubo un error al actualizar el trabajador');
    }
  };

  return (
    <div className="update-worker-form-container">
      <h2 className="title">Actualizar Trabajador</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label>Contraseña:</label>
          <input
            type="password"
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary submit-button">
          Actualizar Trabajador
        </button>
      </form>
    </div>
  );
};

export default UpdateWorkerForm;