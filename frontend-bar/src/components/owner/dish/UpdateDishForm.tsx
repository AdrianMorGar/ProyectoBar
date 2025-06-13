import React, { useState, useEffect, useCallback } from 'react';
import { fetchDishById, updateDish, searchDishesByName, fetchTypes as apiFetchTypes } from '../../../api';

interface Dish {
  id: number;
  nombrePlato: string;
  descripcion: string;
  imagen: string;
  tipoId: number;
  categoria: string;
  precio: number;
  disponible: boolean;
  habilitado: boolean;
}

interface VariationData {
  id: number;
  precio: string;
  disponible: boolean;
  habilitado: boolean;
  categoria: string;
}

interface Type {
  id: number;
  nombreTipo: string;
}

const UpdateDishForm: React.FC<{ dishId: number }> = ({ dishId }) => {
  const [nombrePlato, setNombrePlato] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [imagen, setImagen] = useState<string>('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
  const [tipoId, setTipoId] = useState<number | undefined>(undefined);
  const [allTypes, setAllTypes] = useState<Type[]>([]);
  const [isBebida, setIsBebida] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [foodVariations, setFoodVariations] = useState<Record<string, VariationData | undefined>>({});
  const [singleDishData, setSingleDishData] = useState<VariationData | null>(null);
  const [fetchedPrimaryDish, setFetchedPrimaryDish] = useState<Dish | null>(null);

  const loadDishData = useCallback(async () => {
    setIsLoading(true);
    try {
      const typesData = await apiFetchTypes();
      setAllTypes(typesData);

      const loadedDish = await fetchDishById(dishId) as Dish | null;
      if (!loadedDish) {
        alert('Error: No se pudo encontrar el plato principal.');
        setIsLoading(false);
        setFetchedPrimaryDish(null);
        return;
      }

      setFetchedPrimaryDish(loadedDish);
      setNombrePlato(loadedDish.nombrePlato);
      setDescripcion(loadedDish.descripcion);
      setImagen(loadedDish.imagen || '');
      setSelectedImagePreview(loadedDish.imagen || null);
      setTipoId(loadedDish.tipoId);

      if (loadedDish.categoria === 'BEBIDA') {
        setIsBebida(true);
        setSingleDishData({
          id: loadedDish.id,
          precio: loadedDish.precio.toString(),
          disponible: loadedDish.disponible,
          habilitado: loadedDish.habilitado,
          categoria: loadedDish.categoria,
        });
        setFoodVariations({});
      } else {
        setIsBebida(false);
        const potentialVariations = await searchDishesByName(loadedDish.nombrePlato) as Dish[];
        const relatedVariations = potentialVariations.filter(
          (d: Dish) => d.tipoId === loadedDish.tipoId &&
            ['TAPA', 'MEDIA', 'PLATO'].includes(d.categoria) &&
            d.habilitado
        );

        const variationsMap: Record<string, VariationData> = {};
        if (relatedVariations.length > 0) {
          relatedVariations.forEach((v: Dish) => {
            variationsMap[v.categoria] = {
              id: v.id,
              precio: v.precio.toString(),
              disponible: v.disponible,
              habilitado: v.habilitado,
              categoria: v.categoria,
            };
          });
        } else if (['TAPA', 'MEDIA', 'PLATO'].includes(loadedDish.categoria)) {
          variationsMap[loadedDish.categoria] = {
            id: loadedDish.id,
            precio: loadedDish.precio.toString(),
            disponible: loadedDish.disponible,
            habilitado: loadedDish.habilitado,
            categoria: loadedDish.categoria,
          };
        }
        setFoodVariations(variationsMap);
        setSingleDishData(null);
      }
    } catch (error) {
      alert('Hubo un error al cargar los datos del plato para actualizar.');
      setFetchedPrimaryDish(null);
    } finally {
      setIsLoading(false);
    }
  }, [dishId]);

  useEffect(() => {
    loadDishData();
  }, [loadDishData]);

  const handleCommonChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'nombrePlato') setNombrePlato(value);
    if (name === 'descripcion') setDescripcion(value);
    if (name === 'tipoId') setTipoId(Number(value));
  };

  const handleImageUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagen(base64String);
        setSelectedImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVariationChange = (categoria: string, field: keyof Omit<VariationData, 'id' | 'categoria'>, value: string | boolean) => {
    if (isBebida && singleDishData) {
      setSingleDishData(prev => prev ? { ...prev, [field]: value } : null);
    } else {
      setFoodVariations(prev => {
        const variation = prev[categoria];
        if (variation) {
          return { ...prev, [categoria]: { ...variation, [field]: value as any } };
        }
        return prev;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tipoId === undefined) {
      alert("El tipo de plato es requerido.");
      return;
    }

    const commonPayload = {
      nombrePlato,
      descripcion,
      imagen,
      tipoId: tipoId,
    };

    try {
      if (isBebida && singleDishData) {
        if (!singleDishData.precio.trim() || parseFloat(singleDishData.precio) < 0) {
          alert("El precio de la bebida no es válido.");
          return;
        }
        const payload = {
          ...commonPayload,
          precio: parseFloat(singleDishData.precio),
          disponible: singleDishData.disponible,
          habilitado: singleDishData.habilitado,
          categoria: singleDishData.categoria,
        };
        await updateDish(singleDishData.id, payload);
      } else {
        const updatePromises = [];
        const foodCategories = Object.keys(foodVariations) as Array<keyof typeof foodVariations>;

        if (foodCategories.length === 0 && fetchedPrimaryDish && !['TAPA', 'MEDIA', 'PLATO'].includes(fetchedPrimaryDish.categoria)) {
          alert("No hay variaciones de comida definidas para actualizar (y el plato original no es Tapa/Media/Plato estándar).");
        } else if (foodCategories.length === 0 && !isBebida) {
          alert("No hay variaciones de comida seleccionadas o con precio válido para actualizar.");
          return;
        }

        for (const categoria of foodCategories) {
          const variation = foodVariations[categoria];
          if (variation) {
            if (!variation.precio.trim() || parseFloat(variation.precio) < 0) {
              alert(`El precio para ${categoria} no es válido.`);
              return;
            }
            const payload = {
              ...commonPayload,
              precio: parseFloat(variation.precio),
              disponible: variation.disponible,
              habilitado: variation.habilitado,
              categoria: variation.categoria,
            };
            updatePromises.push(updateDish(variation.id, payload));
          }
        }

        if (updatePromises.length > 0) {
          await Promise.all(updatePromises);
        }
      }
      window.location.href = ('/dueno/carta');
    } catch (error) {
      alert('Hubo un error al actualizar el/los plato(s).');
    }
  };

  if (isLoading) {
    return <p>Cargando datos del plato...</p>;
  }

  return (
    <div className="container dish-form-container">
      <h2>Actualizar Plato</h2>
      <form onSubmit={handleSubmit}>
        <div className="formGroup">
          <label>Nombre del Plato:</label>
          <input type="text" name="nombrePlato" value={nombrePlato} onChange={handleCommonChange} required />
        </div>
        <div className="formGroup">
          <label>Descripción:</label>
          <textarea name="descripcion" value={descripcion} onChange={handleCommonChange} required />
        </div>
        <div className="formGroup">
          <label htmlFor="imagenArchivoUpdate">Cambiar imagen (opcional):</label>
          <input
            type="file"
            id="imagenArchivoUpdate"
            name="imagen"
            accept="image/*"
            onChange={handleImageUpdateChange}
          />
        </div>
        {selectedImagePreview && (
          <div className="image-preview-container">
            <label>Vista previa actual:</label>
            <img
              src={selectedImagePreview}
              alt="Vista previa de la imagen"
              style={{ maxWidth: '200px', maxHeight: '200px', border: '1px solid #ccc', padding: '5px', borderRadius: '5px' }}
            />
          </div>
        )}
        <div className="formGroup">
          <label>Tipo:</label>
          <select name="tipoId" value={tipoId || ''} onChange={handleCommonChange} required>
            <option value="" disabled>Seleccione un tipo</option>
            {allTypes.map(type => (
              <option key={type.id} value={type.id}>{type.nombreTipo}</option>
            ))}
          </select>
        </div>

        <hr />

        {isBebida && singleDishData ? (
          <>
            <h4>Detalles de la Bebida</h4>
            <div className="formGroup">
              <label>Precio Bebida:</label>
              <input
                type="number"
                step="0.1"
                value={singleDishData.precio}
                onChange={(e) => handleVariationChange('BEBIDA', 'precio', e.target.value)}
                required
              />
            </div>
          </>
        ) : (
          <>
            <h4>Precios y Estado de Variaciones de Comida</h4>
            <div className="food-options-grid">
              {['TAPA', 'MEDIA', 'PLATO'].map(cat => {
                const variation = foodVariations[cat];
                if (!variation && !(cat in foodVariations)) return null;
                if (!variation) return null;
                return (
                  <div key={cat} className="food-option-item">
                    <h5>{cat}</h5>
                    <div className="formGroup">
                      <label>Precio {cat}:</label>
                      <input
                        type="number"
                        step="0.1"
                        value={variation.precio}
                        onChange={(e) => handleVariationChange(cat, 'precio', e.target.value)}
                        required={variation.habilitado}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <button type="submit" className="btn btn-success submit-button" style={{ marginTop: '20px' }}>
          Actualizar Plato(s)
        </button>
      </form>
    </div>
  );
};

export default UpdateDishForm;
