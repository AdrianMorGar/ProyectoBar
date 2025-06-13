import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { fetchDishes, fetchTypes } from '../../../api';
import { useNavigate } from 'react-router-dom';

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

interface Type {
  id: number;
  nombreTipo: string;
}

const DishList: React.FC = () => {
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [displayDishes, setDisplayDishes] = useState<Dish[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [selectedTypeId, setSelectedTypeId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const dishesData = await fetchDishes();
      const typesData = await fetchTypes();

      const availableAndEnabledDishes = dishesData.filter((dish: Dish) => dish.habilitado && dish.disponible);
      setAllDishes(availableAndEnabledDishes);
      setTypes(typesData);
    } catch (error) {
      console.error('Error al cargar los datos para el comandero:', error);
      alert('Error al cargar los datos. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    let currentVisibleDishes = allDishes;
    if (selectedTypeId !== null) {
      currentVisibleDishes = allDishes.filter((dish) => dish.tipoId === selectedTypeId);
    }

    const uniqueDishesMap = new Map<string, Dish>();
    currentVisibleDishes.forEach(dish => {
      if (!uniqueDishesMap.has(dish.nombrePlato)) {
        uniqueDishesMap.set(dish.nombrePlato, dish);
      }
    });
    setDisplayDishes(Array.from(uniqueDishesMap.values()));
  }, [allDishes, selectedTypeId]);

  const filteredTypes = useMemo(() => {
    return types.filter((type) =>
      allDishes.some((dish) => dish.tipoId === type.id)
    );
  }, [allDishes, types]);

  const toggleTypeFilter = (typeId: number) => {
    setSelectedTypeId((prevId) => (prevId === typeId ? null : typeId));
  };
  
  const visibleTypes = useMemo(() => {
    if (selectedTypeId !== null) {
      return types.filter((type) => type.id === selectedTypeId && filteredTypes.some(ft => ft.id === type.id));
    }
    return filteredTypes;
  }, [types, selectedTypeId, filteredTypes]);

  if (isLoading && !allDishes.length) {
    return <p className="loading-message">Cargando platos...</p>;
  }

  return (
    <>
      <div className="worker-action-buttons">
        <button onClick={() => navigate('/trabajadores/comandero/NuevoPedido')} className="btn btn-success">
          Añadir
        </button>
        <button onClick={() => navigate('/trabajadores/comandero/EditarPedido')} className="btn btn-primary">
          Pedido
        </button>
        <button onClick={() => navigate('/trabajadores/comandero/mesas')} className="btn btn-warning">
          Mesas
        </button>
      </div>

      {filteredTypes.length > 0 && (
        <div className="type-filter-buttons">
          <button
            className={`btn ${selectedTypeId === null ? 'active' : ''}`}
            onClick={() => setSelectedTypeId(null)}
          >
            Todos
          </button>
          {filteredTypes.map((type) => (
            <button
              key={type.id}
              className={`btn ${selectedTypeId === type.id ? 'active' : ''}`}
              onClick={() => toggleTypeFilter(type.id)}
            >
              {type.nombreTipo}
            </button>
          ))}
        </div>
      )}
      
      <div className="waiter-dishes-grid-container">
        {visibleTypes.map((type) => {
          const dishesForThisTypeSection = displayDishes.filter(dish => dish.tipoId === type.id);

          if (dishesForThisTypeSection.length === 0) {
            if (selectedTypeId === type.id || (selectedTypeId === null && filteredTypes.some(ft => ft.id === type.id))) {
                 return (
                    <div key={type.id} className="waiter-dish-type-section">
                        <h2 className="waiter-dish-type-section-title">{type.nombreTipo}</h2>
                        <p className="no-dishes-message">No hay platos disponibles para este tipo.</p>
                    </div>
                );
            }
            return null; 
          }

          return (
            <div key={type.id} className="waiter-dish-type-section">
              <h2 className="waiter-dish-type-section-title">{type.nombreTipo}</h2>
              <div className="worker-dish-grid"> 
                {dishesForThisTypeSection.map((dish) => (
                  <div
                    key={dish.id}
                    className="worker-item-card"
                    onClick={() => navigate(`/trabajadores/comandero/plato/${dish.id}`)}
                  >
                    <img
                      src={dish.imagen}
                      alt={dish.nombrePlato}
                      className="item-image"
                    />
                    <div className="item-info">
                      <h3 className="item-name">{dish.nombrePlato}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {displayDishes.length === 0 && visibleTypes.length > 0 && !isLoading && (
             <p className="no-dishes-message">No hay platos disponibles para los filtros seleccionados.</p>
        )}
        {filteredTypes.length === 0 && !isLoading && (
          <p className="no-types-message">No hay tipos de plato definidos con platos disponibles.</p>
        )}
      </div>
    </>
  );
};

export default DishList;