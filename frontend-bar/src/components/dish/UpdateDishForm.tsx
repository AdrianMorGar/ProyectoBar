import React, { useState, useEffect } from 'react';
import { fetchDishById, updateDish } from '../../api';

interface FormData {
  id: number;
  nombrePlato: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  habilitado: boolean;
  imagen: string;
  tipoId: number;
}

const UpdateDishForm: React.FC<{ dishId: number }> = ({ dishId }) => {
  const [formData, setFormData] = useState<FormData>({
    id: dishId,
    nombrePlato: '',
    descripcion: '',
    precio: 0,
    categoria: 'PLATO',
    disponible: true,
    habilitado: true,
    imagen: '',
    tipoId: 2,
  });

  // Captura de datos seleccionado por id
  useEffect(() => {
    const loadDish = async () => {
      try {
        const data = await fetchDishById(dishId);
        setFormData({
          id: data.id,
          nombrePlato: data.nombrePlato,
          descripcion: data.descripcion,
          precio: data.precio,
          categoria: data.categoria,
          disponible: data.disponible,
          habilitado: data.habilitado,
          imagen: data.imagen,
          tipoId: data.tipoId,
        });
      } catch (error) {
        alert('Hubo un error al cargar el plato');
      }
    };
    loadDish();
  }, [dishId]);

  // Manejador de cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Guardar actualizacion
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateDish(formData.id, formData);
      alert('Plato actualizado exitosamente');
    } catch (error) {
      alert('Hubo un error al actualizar el plato');
    }
  };

  return (
    <div className="container">
      <h2>Actualizar Plato</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Nombre del Plato:</label>
          <input
            type="text"
            name="nombrePlato"
            value={formData.nombrePlato}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label>Descripción:</label>
          <input
            type="text"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            required
          />
        </div>
        <div className="formGroup">
          <label>Precio:</label>
          <input
            type="number"
            step="0.1"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="submitButton">
          Actualizar Plato
        </button>
      </form>
    </div>
  );
};

export default UpdateDishForm;