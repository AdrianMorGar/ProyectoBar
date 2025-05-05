import React, { useState, useEffect } from 'react';
import { createDish, fetchTypes, createType, deleteType } from '../../api';

interface Type {
  id: number;
  nombreTipo: string;
}

const AddDishForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombrePlato: '',
    descripcion: '',
    precio: 0.0,
    categoria: 'PLATO',
    imagen: '',
    tipoId: 2,
  });

  const [types, setTypes] = useState<Type[]>([]);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [newTypeName, setNewTypeName] = useState('');
  const [showTypeManager, setShowTypeManager] = useState(false);

  // Cargar tipos disponibles
  useEffect(() => {
    const loadTypes = async () => {
      const data = await fetchTypes();
      setTypes(data);
    };
    loadTypes();
  }, []);

  // ERROR: Estado defectuoso el guardado de imagenes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'imagen') {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const filePath = `/img/${fileName}`;

        const reader = new FileReader();
        reader.onload = () => {
        };
        reader.readAsDataURL(file);

        setFormData({ ...formData, imagen: filePath });
        setSelectedImagePreview(URL.createObjectURL(file));
      } else {
        setFormData({ ...formData, imagen: '' });
        setSelectedImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Envio al backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dishData = {
        nombrePlato: formData.nombrePlato,
        descripcion: formData.descripcion,
        precio: formData.precio,
        categoria: formData.categoria,
        imagen: formData.imagen,
        tipoId: formData.tipoId,
      };

      await createDish(dishData);
      alert('Plato añadido exitosamente');

      setFormData({
        nombrePlato: '',
        descripcion: '',
        precio: 0.0,
        categoria: 'PLATO',
        imagen: '',
        tipoId: 2,
      });
      setSelectedImagePreview(null);
    } catch (error) {
      alert('Hubo un error al añadir el plato');
    }
  };

  const handleCreateType = async () => {
    try {
      const newType = await createType({ nombreTipo: newTypeName });
      setTypes([...types, newType]);
      setNewTypeName('');
      alert('Nuevo tipo creado exitosamente');
    } catch (error) {
      alert('Hubo un error al crear el tipo');
    }
  };

  const handleDeleteType = async (typeId: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este tipo?');
    if (confirmDelete) {
      try {
        await deleteType(typeId);
        setTypes(types.filter((type) => type.id !== typeId));
        alert('Tipo eliminado exitosamente');
      } catch (error) {
        alert('Hubo un error al eliminar el tipo. ¡No puedes borar un tipo si exixte un palto en el!');
      }
    }
  };

  return (
    <div className="container">
      {/* Formulario para añadir un nuevo plato */}
      <h2>Añadir Nuevo Plato</h2>
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
        <div className="formGroup">
          <label>Categoría:</label>
          <select name="categoria" value={formData.categoria} onChange={handleChange}>
            <option value="TAPA">Tapa</option>
            <option value="MEDIA">Media</option>
            <option value="PLATO">Plato</option>
            <option value="BEBIDA">Bebida</option>
          </select>
        </div>
        <div className="formGroup">
          <label>Imagen (opcional):</label>
          <input type="file" name="imagen" accept="image/*" onChange={handleChange} />
        </div>
        {selectedImagePreview && (
          <div>
            <p>Vista previa:</p>
            <img src={selectedImagePreview} alt="Vista previa" className="previewImage" />
          </div>
        )}
        <div className="formGroup">
          <label>Tipo:</label>
          <select name="tipoId" value={formData.tipoId} onChange={handleChange}>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nombreTipo}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Añadir Plato</button>
      </form>

      {/* Sección para gestionar tipos */}
      <div className="typeManager">
        <button onClick={() => setShowTypeManager(!showTypeManager)}>
          {showTypeManager ? 'Ocultar Gestión de Tipos' : 'Mostrar Gestión de Tipos'}
        </button>
        {showTypeManager && (
          <div>
            <div>
              <h4>Crear Nuevo Tipo</h4>
              <input
                type="text"
                placeholder="Nombre del tipo"
                value={newTypeName}
                onChange={(e) => setNewTypeName(e.target.value)}
              />
              <button onClick={handleCreateType}>Crear Tipo</button>
            </div>

            <div>
              <h4>Tipos Existentes</h4>
              <ul className="typeList">
                {types.map((type) => (
                  <li key={type.id}>
                    <span>{type.nombreTipo}</span>
                    <button onClick={() => handleDeleteType(type.id)}>Eliminar</button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddDishForm;