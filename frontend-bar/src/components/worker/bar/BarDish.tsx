import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDishes } from '../../../api';

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

const BarDish: React.FC = () => {
  const { typeId: typeIdParam } = useParams<{ typeId: string }>();
  const [displayDishes, setDisplayDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadDishes = useCallback(async () => {
    if (!typeIdParam) {
      setLoading(false);
      setError("No se ha especificado un tipo de plato.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const dishesData: Dish[] = await fetchDishes();
      const currentTypeId = parseInt(typeIdParam, 10);

      const filteredDishesByType = dishesData.filter(
        (dish: Dish) => dish.tipoId === currentTypeId && dish.habilitado && dish.disponible
      );

      const uniqueDishesMap = new Map<string, Dish>();
      filteredDishesByType.forEach((dish: Dish) => {
        if (!uniqueDishesMap.has(dish.nombrePlato)) {
          uniqueDishesMap.set(dish.nombrePlato, dish);
        }
      });
      setDisplayDishes(Array.from(uniqueDishesMap.values()));

    } catch (err) {
      console.error("Error loading dishes for BarDish:", err);
      setError('Hubo un error al cargar los platos.');
    } finally {
      setLoading(false);
    }
  }, [typeIdParam]);

  useEffect(() => {
    loadDishes();
  }, [loadDishes]);

  if (loading) return <p className="loading-message">Cargando platos...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <div className="bar-dish-container">
      <h1>Platos del Tipo Seleccionado</h1>
      {displayDishes.length === 0 ? (
        <p className="no-dishes-message">No hay platos disponibles para este tipo.</p>
      ) : (
        <div className="worker-dish-grid">
          {displayDishes.map((dish) => (
            <div
              key={dish.id}
              className="worker-item-card"
              onClick={() => navigate(`/trabajadores/barra/plato/${dish.id}`)}
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
      )}
    </div>
  );
};

export default BarDish;