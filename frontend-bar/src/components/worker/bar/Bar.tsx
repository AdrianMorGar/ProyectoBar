import React, { useState, useEffect } from 'react';
import { fetchTypes } from '../../../api';

interface Type {
  id: number;
  nombreTipo: string;
}

const Bar: React.FC = () => {
  const [types, setTypes] = useState<Type[]>([]);

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
      {/* Botones de Redirección */}
      <div className="button-group">
        <button onClick={() => (window.location.href = '/trabajadores/barra/NuevoPedido')} className="btn btn-success">
          Añadir
        </button>
        <button onClick={() => (window.location.href = '/trabajadores/barra/EditarPedido')} className="btn btn-primary">
          Pedido
        </button>
        <button onClick={() => (window.location.href = '/trabajadores/barra/mesas')} className="btn btn-warning">
          Mesas
        </button>
        <button onClick={() => (window.location.href = '/trabajadores/barra/bebidas')} className="btn btn-purple">
          Bebidas
        </button>
      </div>

      {/* Tipos de Plato */}
      {types.length > 0 && (
        <div className="type-grid">
          {types.map((type) => (
            <div
              key={type.id}
              className="type-card"
              onClick={() => (window.location.href = `/trabajadores/barra/tipo/${type.id}`)}
            >
              <img
                src={`https://via.placeholder.com/100?text= ${encodeURIComponent(type.nombreTipo)}`}
                alt={type.nombreTipo}
                className="type-image"
              />
              <p className="type-name">{type.nombreTipo}</p>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje si no hay tipos disponibles */}
      {types.length === 0 && <p className="no-types-message">No hay tipos de plato disponibles</p>}
    </div>
  );
};

export default Bar;