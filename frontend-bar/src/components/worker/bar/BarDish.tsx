import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDishes } from '../../../api';

interface Dish {
  id: number;
  nombrePlato: string;
  descripcion: string;
  precio: number;
  categoria: string;
  imagen: string;
  tipoId: number;
}

const BarDish: React.FC = () => {
  const { typeId } = useParams<{ typeId: string }>();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDishes = async () => {
      try {
        setLoading(true);
        const dishesData = await fetchDishes();
        const filteredDishes = dishesData.filter((dish: { tipoId: number; }) => dish.tipoId === parseInt(typeId || '0'));
        setDishes(filteredDishes);
      } catch (err) {
        setError('Hubo un error al cargar los platos.');
      } finally {
        setLoading(false);
      }
    };

    if (typeId) {
      loadDishes();
    }
  }, [typeId]);

  if (error) return <p className="error-message">{error}</p>;
  if (loading) return <p className="loading-message">Cargando platos...</p>;

  return (
    <div className="bar-dish-container">
      <h1>Platos del Tipo Seleccionado</h1>
      {dishes.length === 0 ? (
        <p className="no-dishes-message">No hay platos disponibles para este tipo.</p>
      ) : (
        <div className="dishes-grid">
          {dishes.map((dish) => (
            <div
              key={dish.id}
              className="dish-card"
              onClick={() => navigate(`/trabajadores/barra/plato/${dish.id}`)}
            >
              <img src={dish.imagen} alt={dish.nombrePlato} className="dish-image" />
              <p className="dish-name">{dish.nombrePlato}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BarDish;