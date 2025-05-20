import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDishById } from '../../../api';
import QuantitySelector from './QuantitySelector';

interface Dish {
  id: number;
  nombrePlato: string;
  descripcion: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  imagen: string;
}

const DishDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dish, setDish] = useState<Dish | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [note, setNote] = useState<string>('');

  // Cargar datos del plato por ID
  useEffect(() => {
    const loadDish = async () => {
      try {
        if (id) {
          const data = await fetchDishById(Number(id));
          setDish(data);
        }
      } catch (error) {
        alert('Error al cargar el plato. Por favor, intenta nuevamente.');
      }
    };
    loadDish();
  }, [id]);

  // Añadir al pedido con nota
  const handleAddToOrder = () => {
    if (!dish) return;

    const selectedDish = {
      id: dish.id,
      nombrePlato: dish.nombrePlato,
      cantidad: quantity,
      precio: dish.precio,
      notas: note,
    };

    const existingOrder = JSON.parse(localStorage.getItem('pedido') || '[]');
    const updatedOrder = [...existingOrder];
    const index = updatedOrder.findIndex((d: any) => d.id === selectedDish.id);

    if (index !== -1) {
      updatedOrder[index].cantidad += quantity;
      if (note.trim()) {
        updatedOrder[index].notas = note;
      }
    } else {
      updatedOrder.push(selectedDish);
    }

    localStorage.setItem('pedido', JSON.stringify(updatedOrder));
    window.location.href = '../';
  };

  if (!dish) {
    return <p className="loading-message">Cargando detalles del plato...</p>;
  }

  return (
    <div className="dish-details-container">
      {/* Imagen */}
      <div className="image-container">
        <img src={dish.imagen} alt={dish.nombrePlato} className="dish-image" />
      </div>

      {/* Detalles */}
      <div className="details">
        <h2>{dish.nombrePlato}</h2>
        <p><strong>Descripción:</strong> {dish.descripcion}</p>
        <p><strong>Precio:</strong> {dish.precio.toFixed(2)} €</p>
        <p><strong>Categoría:</strong> {dish.categoria}</p>
        <p><strong>Disponibilidad:</strong> {dish.disponible ? 'Disponible' : 'No disponible'}</p>
      </div>

      {/* Cantidad */}
      <div className="quantity-selector">
        <h3>Cantidad:</h3>
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </div>

      {/* Notas */}
      <div className="notes">
        <h3>Notas:</h3>
        <textarea
          placeholder="Ej: Sin cebolla, extra picante..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="notes-textarea"
        />
      </div>

      {/* Botón */}
      <button className="add-button" onClick={handleAddToOrder}>
        Añadir
      </button>
    </div>
  );
};

export default DishDetails;