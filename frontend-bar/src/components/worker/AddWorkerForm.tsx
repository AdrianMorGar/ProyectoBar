import React, { useState } from 'react';
import { createUser } from '../../api';

const AddWorkerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    contrasena: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Añadimos trabajadores
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({ ...formData });
      alert('Trabajador añadido exitosamente');
    } catch (error) {
      alert('Hubo un error al añadir el trabajador');
    }
  };

  return (
    <div className="container">
      <h2 className="title">Añadir Nuevo Trabajador</h2>
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
          Añadir Trabajador
        </button>
      </form>
    </div>
  );
};

export default AddWorkerForm;