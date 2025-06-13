import React, { useState, useEffect } from 'react';
import { createDish, fetchTypes } from '../../../api';

interface Type {
  id: number;
  nombreTipo: string;
}

const AddDishForm: React.FC = () => {
  const [nombrePlato, setNombrePlato] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imagen, setImagen] = useState<string>('');
  const [tipoId, setTipoId] = useState<number>(2);
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [types, setTypes] = useState<Type[]>([]);
  const [itemKind, setItemKind] = useState<'COMIDA' | 'BEBIDA'>('COMIDA');
  const [foodOptions, setFoodOptions] = useState({
    TAPA: { selected: false, precio: '' },
    MEDIA: { selected: false, precio: '' },
    PLATO: { selected: true, precio: '' },
  });
  const [precioBebida, setPrecioBebida] = useState('');

  useEffect(() => {
    const loadTypes = async () => {
      try {
        const data = await fetchTypes();
        setTypes(data);
      } catch (error) {
        alert('Hubo un error al cargar los tipos de plato.');
      }
    };
    loadTypes();
  }, []);

  const handleCommonInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'nombrePlato') setNombrePlato(value);
    if (name === 'descripcion') setDescripcion(value);
    if (name === 'tipoId') setTipoId(Number(value));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImagePreview(base64String);
        setImagen(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setImagen('');
      setSelectedImagePreview(null);
    }
  };

  const handleItemKindChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemKind(e.target.value as 'COMIDA' | 'BEBIDA');
  };

  const handleFoodOptionChange = (category: keyof typeof foodOptions) => {
    setFoodOptions(prev => ({
      ...prev,
      [category]: { ...prev[category], selected: !prev[category].selected }
    }));
  };

  const handleFoodPriceChange = (category: keyof typeof foodOptions, price: string) => {
    setFoodOptions(prev => ({
      ...prev,
      [category]: { ...prev[category], precio: price }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const dishesToCreate = [];
    const commonData = {
      nombrePlato,
      descripcion,
      imagen,
      tipoId: Number(tipoId),
    };

    if (!nombrePlato.trim() || !descripcion.trim()) {
      alert('El nombre y la descripción del plato son obligatorios.');
      return;
    }
    if (!tipoId) {
      alert('Debe seleccionar un tipo para el plato.');
      return;
    }

    if (itemKind === 'COMIDA') {
      let hasSelectedFoodOption = false;
      for (const key in foodOptions) {
        const option = foodOptions[key as keyof typeof foodOptions];
        if (option.selected) {
          hasSelectedFoodOption = true;
          if (!option.precio.trim() || parseFloat(option.precio) <= 0) {
            alert(`Por favor, introduce un precio válido para ${key}.`);
            return;
          }
          dishesToCreate.push({
            ...commonData,
            precio: parseFloat(option.precio),
            categoria: key,
          });
        }
      }
      if (!hasSelectedFoodOption) {
        alert('Debes seleccionar al menos una categoría de comida (Tapa, Media o Plato) y asignarle un precio.');
        return;
      }
    } else {
      if (!precioBebida.trim() || parseFloat(precioBebida) <= 0) {
        alert('Por favor, introduce un precio válido para la bebida.');
        return;
      }
      dishesToCreate.push({
        ...commonData,
        precio: parseFloat(precioBebida),
        categoria: 'BEBIDA',
      });
    }

    if (dishesToCreate.length === 0) {
      alert('No has configurado ningún plato o bebida para crear.');
      return;
    }

    try {
      await Promise.all(dishesToCreate.map(dishData => createDish(dishData)));
      window.location.href = ('/dueno/carta');
    } catch (error) {
      alert('Hubo un error al añadir el/los plato(s). Revisa la consola para más detalles.');
    }
  };

  return (
    <div className="dish-form-container">
      <h2>Añadir Nuevo Plato/Bebida</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Nombre del Plato/Bebida:</label>
          <input
            type="text"
            name="nombrePlato"
            value={nombrePlato}
            onChange={handleCommonInputChange}
            required
          />
        </div>

        <div className="formGroup">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={descripcion}
            onChange={handleCommonInputChange}
            required
          />
        </div>

        <div className="formGroup">
          <label htmlFor="imagenArchivo">Sube tu imagen (opcional):</label>
          <input
            type="file"
            id="imagenArchivo"
            name="imagen"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {selectedImagePreview && (
          <div className="image-preview-container">
            <img
              src={selectedImagePreview}
              alt="Vista previa de la imagen"
              className="previewImage"
              style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}
            />
          </div>
        )}

        <div className="formGroup">
          <label>Tipo:</label>
          <select name="tipoId" value={tipoId} onChange={handleCommonInputChange} required>
            <option value="" disabled={tipoId !== 2}>Selecciona un tipo</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.nombreTipo}
              </option>
            ))}
          </select>
        </div>

        <div className="formGroup">
          <label>Tipo de Artículo:</label>
          <select value={itemKind} onChange={handleItemKindChange}>
            <option value="COMIDA">Comida</option>
            <option value="BEBIDA">Bebida</option>
          </select>
        </div>

        {itemKind === 'COMIDA' && (
          <>
            <h4>Definir Precios para Comida:</h4>
            <div className="food-options-grid">
              {(Object.keys(foodOptions) as Array<keyof typeof foodOptions>).map((cat) => (
                <div className="food-option-item" key={cat}>
                  <label style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                      type="checkbox"
                      checked={foodOptions[cat].selected}
                      onChange={() => handleFoodOptionChange(cat)}
                      style={{ marginRight: '10px' }}
                    />
                    Crear {cat}
                  </label>
                  {foodOptions[cat].selected && (
                    <input
                      type="number"
                      step="0.1"
                      placeholder={`Precio ${cat}`}
                      value={foodOptions[cat].precio}
                      onChange={(e) => handleFoodPriceChange(cat, e.target.value)}
                      style={{ marginTop: '5px', marginLeft: '25px' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {itemKind === 'BEBIDA' && (
          <div className="formGroup">
            <label>Precio Bebida:</label>
            <input
              type="number"
              step="0.1"
              name="precioBebida"
              value={precioBebida}
              onChange={(e) => setPrecioBebida(e.target.value)}
            />
          </div>
        )}

        <button type="submit" className="btn btn-success submit-button" style={{ marginTop: '20px' }}>
          Añadir Plato(s)/Bebida
        </button>
      </form>
    </div>
  );
};

export default AddDishForm;
