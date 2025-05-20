import React, { useState, useEffect } from 'react';
import { fetchDishes, fetchTypes } from '../../../api';

interface Dish {
  id: number;
  nombrePlato: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  tipoId: number;
}

interface Type {
  id: number;
  nombreTipo: string;
}

const DishList: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const dishesData = await fetchDishes();
        const typesData = await fetchTypes();
        setDishes(dishesData);
        setTypes(typesData);
      } catch (error) {
        alert('Error al cargar los datos. Por favor, intenta nuevamente.');
      }
    };
    loadInitialData();
  }, []);

  const filteredTypes = types.filter((type) =>
    dishes.some((dish) => dish.tipoId === type.id)
  );

  const toggleTypeFilter = (typeId: number) => {
    setSelectedTypeId((prevId) => (prevId === typeId ? null : typeId));
  };

  const visibleDishes =
    selectedTypeId !== null
      ? dishes.filter((dish) => dish.tipoId === selectedTypeId)
      : dishes;

  const visibleTypes = selectedTypeId !== null
    ? types.filter((type) => type.id === selectedTypeId)
    : filteredTypes;

  return (
    <div className="dish-list-container">
      {/* Botones de Redirección */}
      <div className="action-buttons">
        <button
          className="btn btn-success"
          onClick={() => (window.location.href = '/trabajadores/comandero/NuevoPedido')}
        >
          Añadir
        </button>
        <button
          className="btn btn-primary"
          onClick={() => (window.location.href = '/trabajadores/comandero/EditarPedido')}
        >
          Pedido
        </button>
        <button
          className="btn btn-warning"
          onClick={() => (window.location.href = '/trabajadores/comandero/mesas')}
        >
          Mesas
        </button>
      </div>

      {/* Botones de Tipos de Plato */}
      {filteredTypes.length > 0 && (
        <div className="type-buttons">
          {filteredTypes.map((type) => (
            <button
              key={type.id}
              className={`type-button ${selectedTypeId === type.id ? 'active' : ''}`}
              onClick={() => toggleTypeFilter(type.id)}
            >
              {type.nombreTipo}
            </button>
          ))}
        </div>
      )}

      {/* Lista de Platos */}
      <div className="dishes-list">
        {visibleTypes.map((type) => {
          const typeDishes = visibleDishes.filter((dish) => dish.tipoId === type.id);
          return (
            <div key={type.id} className="type-section">
              <h2>{type.nombreTipo}</h2>
              <div className="dishes-grid">
                {typeDishes.map((dish) => (
                  <div
                    key={dish.id}
                    className="dish-card"
                    onClick={() => (window.location.href = `/trabajadores/comandero/plato/${dish.id}`)}
                  >
                    <img src={dish.imagen} alt={dish.nombrePlato} className="dish-image" />
                    <p className="dish-name">{dish.nombrePlato}</p>
                    <p className="dish-price">{dish.precio.toFixed(2)} €</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {visibleDishes.length === 0 && <p className="no-dishes-message">No hay platos disponibles</p>}
      </div>
    </div>
  );
};

export default DishList;