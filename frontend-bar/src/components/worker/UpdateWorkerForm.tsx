import React, { useState, useEffect } from 'react';
import { fetchUserById, updateUser } from '../../api';

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

  // Captura de datos seleccionado por id
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

  // Manejador de cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Guardar actualizacion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser(formData.id, formData);
      alert('Trabajador actualizado exitosamente');
    } catch (error) {
      alert('Hubo un error al actualizar el trabajador');
    }
  };

  return (
    <div className="container">
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
        <button type="submit" className="submitButton">
          Actualizar Trabajador
        </button>
      </form>
    </div>
  );
};

export default UpdateWorkerForm;