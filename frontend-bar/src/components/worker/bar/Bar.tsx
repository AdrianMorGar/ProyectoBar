import React, { useState, useEffect } from 'react';
import { fetchTypes } from '../../../api';
import { Link, useNavigate } from 'react-router-dom';

interface Type {
  id: number;
  nombreTipo: string;
  imagen: string;
}

const Bar: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const typesData = await fetchTypes();
        setTypes(typesData);
      } catch (error) {
        alert('Error al cargar los datos. Por favor, intenta nuevamente.');
      }
    };
    loadInitialData();
  }, []);

  return (
    <div className="bar-container">
      <div className="worker-action-buttons">
        <button onClick={() => navigate('/trabajadores/barra/NuevoPedido')} className="btn btn-success">
          Añadir
        </button>
        <button onClick={() => navigate('/trabajadores/barra/EditarPedido')} className="btn btn-primary">
          Pedido
        </button>
        <button onClick={() => navigate('/trabajadores/barra/mesas')} className="btn btn-warning">
          Mesas
        </button>
        <button onClick={() => navigate('/trabajadores/barra/bebidas')} className="btn btn-info">
          Bebidas
        </button>
      </div>

      {types.length > 0 ? (
        <div className="worker-category-grid">
          {types.map((type) => (
            <Link
              to={`/trabajadores/barra/tipo/${type.id}`}
              key={type.id}
              className="worker-item-card"
            >
              <img
                src={type.imagen}
                alt={type.nombreTipo}
                className="item-image"
              />
              <div className="item-info">
                <h3 className="item-name">{type.nombreTipo}</h3>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="no-types-message">No hay tipos de plato disponibles.</p>
      )}
    </div>
  );
};

export default Bar;