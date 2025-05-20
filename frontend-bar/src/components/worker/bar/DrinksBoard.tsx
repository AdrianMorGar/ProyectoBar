import React, { useEffect, useState } from 'react';
import { fetchDrinkOrders, serveOrderDetail } from '../../../api';

interface OrderDetail {
  id: number;
  cantidad: number;
  precioUnitario: number;
  plato: string;
  estado: string;
  notas?: string;
}

const DrinksBoard: React.FC = () => {
  const [orders, setOrders] = useState<{ mesa: string; detalles: OrderDetail[] }[]>([]);

  const loadOrders = async () => {
    try {
      const data = await fetchDrinkOrders();
      setOrders(data);
    } catch (error) {
      alert('Error al cargar las bebidas. Por favor, intenta nuevamente.');
    }
  };

  // Refresca cada 5 min
  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const markAsServed = async (detailId: number) => {
    try {
      await serveOrderDetail(detailId);
      loadOrders();
    } catch (err) {
      alert('Error al marcar como servido. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="bebida-board">
      <h2>Tablón de Bebidas</h2>
      {orders.length > 0 ? (
        orders.map(({ mesa, detalles }) => (
          <div key={mesa} className="order-group">
            <h3>{mesa}</h3>
            <ul className="order-list">
              {detalles.map((detail) => (
                <li
                  key={detail.id}
                  onClick={() => markAsServed(detail.id)}
                  className={`order-item ${detail.estado === 'SERVIDO' ? 'served' : ''} ${
                    detail.estado === 'PENDIENTE' ? 'pending' : ''
                  }`}
                >
                  <div>
                    <strong>{detail.plato}</strong> - Cantidad: {detail.cantidad}
                  </div>
                  {detail.notas && <div className="note">Nota: {detail.notas}</div>}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="no-orders-message">No hay bebidas pendientes.</p>
      )}
    </div>
  );
};

export default DrinksBoard;