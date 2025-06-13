import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDishById, fetchDishes } from '../../../api'; 
import QuantitySelector from './QuantitySelector';

interface Dish {
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

interface CommonDishInfo {
  nombrePlato: string;
  descripcion: string;
  imagen: string;
  tipoId: number;
}

const DishDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [commonDishInfo, setCommonDishInfo] = useState<CommonDishInfo | null>(null);
  const [variations, setVariations] = useState<Dish[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDishDetails = useCallback(async () => {
    setIsLoading(true);
    if (!id) {
      setIsLoading(false);
      return;
    }
    try {
      const primaryDish = await fetchDishById(Number(id));
      if (!primaryDish) {
        alert('Error: Plato no encontrado.');
        setIsLoading(false);
        return;
      }

      setCommonDishInfo({
        nombrePlato: primaryDish.nombrePlato,
        descripcion: primaryDish.descripcion,
        imagen: primaryDish.imagen,
        tipoId: primaryDish.tipoId,
      });

      if (primaryDish.categoria === 'BEBIDA') {
        if (primaryDish.habilitado) {
            setVariations([primaryDish]);
            setSelectedVariation(primaryDish.disponible ? primaryDish : null);
        } else {
            setVariations([]);
            setSelectedVariation(null);
            alert('Esta bebida no está disponible en el sistema.');
        }
      } else {
        const allDishes = await fetchDishes(); 
        const siblingVariations = allDishes.filter(
          (d: Dish) =>
            d.nombrePlato === primaryDish.nombrePlato &&
            d.tipoId === primaryDish.tipoId &&
            ['TAPA', 'MEDIA', 'PLATO'].includes(d.categoria) &&
            d.habilitado 
        );

        const orderMap: { [key: string]: number } = { 'TAPA': 1, 'MEDIA': 2, 'PLATO': 3 };
        siblingVariations.sort((a: { categoria: string | number; }, b: { categoria: string | number; }) => (orderMap[a.categoria] || 99) - (orderMap[b.categoria] || 99));

        setVariations(siblingVariations);
        const firstAvailableVariation = siblingVariations.find((v: { disponible: any; }) => v.disponible);
        setSelectedVariation(firstAvailableVariation || null);
      }
    } catch (error) {
      alert('Error al cargar los detalles del plato. Por favor, intenta nuevamente.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadDishDetails();
  }, [loadDishDetails]);

  const handleAddToOrder = () => {
    if (!selectedVariation) {
      alert('Por favor, selecciona una variación del plato.');
      return;
    }
    if (!selectedVariation.disponible) {
      alert('Esta variación no está disponible actualmente.');
      return;
    }

    const dishToAdd = {
      id: selectedVariation.id, 
      nombrePlato: `${commonDishInfo?.nombrePlato} (${selectedVariation.categoria})`, 
      cantidad: quantity,
      precio: selectedVariation.precio,
      notas: note,
    };

    const existingOrder = JSON.parse(localStorage.getItem('pedido') || '[]');
    const updatedOrder = [...existingOrder];
    const index = updatedOrder.findIndex((d: any) => d.id === dishToAdd.id);

    if (index !== -1) {
      updatedOrder[index].cantidad += quantity;
      if (note.trim()) {
        updatedOrder[index].notas = (updatedOrder[index].notas ? updatedOrder[index].notas + "; " : "") + note;
      }
    } else {
      updatedOrder.push(dishToAdd);
    }

    localStorage.setItem('pedido', JSON.stringify(updatedOrder));
    window.location.href = '../'; 
  };

  if (isLoading) {
    return <p className="loading-message">Cargando detalles del plato...</p>;
  }

  if (!commonDishInfo || variations.length === 0) {
    return <p className="error-message">No se encontraron detalles o variaciones para este plato, o no está habilitado.</p>;
  }

  return (
    <div className="dish-details-container">
      <div className="image-container">
        <img src={commonDishInfo.imagen} alt={commonDishInfo.nombrePlato} className="dish-image" />
      </div>

      <div className="details">
        <h2>{commonDishInfo.nombrePlato}</h2>
        <p><strong>Descripción:</strong> {commonDishInfo.descripcion}</p>

        {variations.length > 1 && !variations[0].categoria.includes('BEBIDA') && (
          <div className="variation-selector">
            <h3>Selecciona Tamaño:</h3>
            {variations.map(v => (
              <label key={v.id} className={`variation-option ${!v.disponible ? 'unavailable' : ''} ${selectedVariation?.id === v.id ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="variation"
                  value={v.id}
                  checked={selectedVariation?.id === v.id}
                  onChange={() => setSelectedVariation(v.disponible ? v : null)}
                  disabled={!v.disponible}
                />
                {v.categoria} - {v.precio.toFixed(2)} € {v.disponible ? '' : '(No Disponible)'}
              </label>
            ))}
          </div>
        )}

        {selectedVariation ? (
          <>
            <p><strong>Precio Seleccionado:</strong> {selectedVariation.precio.toFixed(2)} €</p>
            <p><strong>Categoría:</strong> {selectedVariation.categoria}</p>
            <p><strong>Disponibilidad:</strong> {selectedVariation.disponible ? 'Disponible' : 'No disponible'}</p>
          </>
        ) : variations[0]?.categoria.includes('BEBIDA') && variations[0].disponible ? (
             <>
               <p><strong>Precio:</strong> {variations[0].precio.toFixed(2)} €</p>
               <p><strong>Categoría:</strong> {variations[0].categoria}</p>
               <p><strong>Disponibilidad:</strong> {variations[0].disponible ? 'Disponible' : 'No disponible'}</p>
            </>
        ) : (
          <p className="error-message">Por favor, selecciona una variación disponible.</p>
        )}
      </div>

      <div className="quantity-selector">
        <h3>Cantidad:</h3>
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </div>

      <div className="notes">
        <h3>Notas:</h3>
        <textarea
          placeholder="Ej: Sin cebolla, extra picante..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="notes-textarea"
        />
      </div>

      <button 
        className="btn btn-success add-to-order-button btn-lg" 
        onClick={handleAddToOrder} 
        disabled={!selectedVariation || !selectedVariation.disponible}
      >
        Añadir al Pedido
      </button>
    </div>
  );
};

export default DishDetails;