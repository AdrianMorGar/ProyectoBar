import React, { useState, useEffect } from 'react';
import { fetchDishes, fetchTypes, toggleDishAvailability, toggleDishDisponibility, searchDishesByName } from '../../../api';
import { Link } from 'react-router-dom';

interface Dish {
  id: number;
  nombrePlato: string;
  descripcion: string;
  precio: number;
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
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      const dishesData = await fetchDishes();
      const typesData = await fetchTypes();
      setDishes(dishesData);
      setTypes(typesData);
    };
    loadInitialData();
  }, []);

  // Filtro de platos por nombre
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setSearchTerm(name);
    if (name.trim() === '') {
      const data = await fetchDishes();
      setDishes(data);
    } else {
      const filteredDishes = await searchDishesByName(name);
      setDishes(filteredDishes);
    }
  };

  // Eliminación de plato con confirmación
  const handleDelete = async (dishId: number) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este plato?');
    if (confirmDelete) {
      try {
        await toggleDishAvailability(dishId);
        setDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== dishId));
        alert('Plato eliminado exitosamente');
      } catch (error) {
        alert('Hubo un error al eliminar el plato');
      }
    }
  };

  // Manejar el toggle de disponibilidad
  const handleToggleAvailability = async (dishId: number) => {
    try {
      await toggleDishDisponibility(dishId);
      setDishes((prevDishes) =>
        prevDishes.map((dish) =>
          dish.id === dishId ? { ...dish, disponible: !dish.disponible } : dish
        )
      );
    } catch (error) {
      alert('Hubo un error al alternar la disponibilidad del plato');
    }
  };

  // Agrupar platos por tipo
  const groupedDishes = types
    .filter((type) => dishes.some((dish) => dish.tipoId === type.id))
    .map((type) => ({
      type,
      dishes: dishes.filter((dish) => dish.tipoId === type.id),
    }));

  return (
    <div className="container">
      {/* Filtro y botón de añadir */}
      <div className="header">
        <input
          type="text"
          placeholder="Buscar plato..."
          value={searchTerm}
          onChange={handleSearch}
          className="searchInput"
        />
        <Link to="nuevo" className="addButton">
          Añadir Plato
        </Link>
      </div>

      {/* Listado de platos agrupados por tipo */}
      {groupedDishes.length > 0 ? (
        groupedDishes.map(({ type, dishes: typeDishes }) => (
          <div key={type.id}>
            <h3 className="typeHeader">Tipo: {type.nombreTipo}</h3>
            {typeDishes.map((dish) => (
              <div key={dish.id} className="dishCard">
                <img src={dish.imagen} alt={dish.nombrePlato} className="dishImage" />
                <div className="dishDetails">
                  <h4 className="dishName">{dish.nombrePlato}</h4>
                  <p className="dishDescription">{dish.descripcion}</p>
                  <p className="dishPrice">${dish.precio}</p>
                </div>
                <div className="actions">
                  <button
                    onClick={() => handleToggleAvailability(dish.id)}
                    className={`actionButton ${dish.disponible ? 'available' : 'notAvailable'}`}
                  >
                    {dish.disponible ? 'Disponible' : 'No Disponible'}
                  </button>
                  <button
                    onClick={() => handleDelete(dish.id)}
                    className={`actionButton delete`}
                  >
                    Eliminar
                  </button>
                  <Link
                    to={`editar/${dish.id}`}
                    className={`actionButton update`}
                  >
                    Actualizar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ))
      ) : (
        <p>No hay platos disponibles.</p>
      )}
    </div>
  );
};

export default DishList;