import React, { useEffect, useState, useRef } from 'react';
import { fetchKitchenOrders, toggleOrderDetailStatus, serveOrderDetail } from '../../../api';

interface OrderDetail {
  id: number;
  cantidad: number;
  precioUnitario: number;
  plato: string;
  estado: string;
  notas?: string;
}

const KitchenBoard: React.FC = () => {
  const [orders, setOrders] = useState<{ mesa: string; detalles: OrderDetail[] }[]>([]);
  const completedTimestamps = useRef<{ [id: number]: number }>({});

  const loadOrders = async () => {
    try {
      const data = await fetchKitchenOrders();
      setOrders(data);
    } catch (error) {
      alert('Error al cargar las comandas. Por favor, intenta nuevamente.');
    }
  };

  useEffect(() => {
    loadOrders();
    const fetchInterval = setInterval(loadOrders, 5000);
    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(() => {
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          detalles: order.detalles.map((detail) => {
            if (detail.estado === 'COMPLETADO') {
              const now = Date.now();
              const timestamp = completedTimestamps.current[detail.id];

              if (!timestamp) {
                completedTimestamps.current[detail.id] = now;
              } else if (now - timestamp >= 15000) {
                serveOrderDetail(detail.id)
                delete completedTimestamps.current[detail.id];
                return { ...detail, estado: 'SERVIDO' };
              }
            }
            return detail;
          }),
        }))
      );
    }, 1000);
    return () => clearInterval(checkInterval);
  }, []);

  const toggleOrderStatus = async (detailId: number) => {
    try {
      await toggleOrderDetailStatus(detailId);
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          detalles: order.detalles.map((detail) => {
            if (detail.id === detailId) {
              const nextEstado =
                detail.estado === 'PENDIENTE'
                  ? 'EN_PROCESO'
                  : detail.estado === 'EN_PROCESO'
                  ? 'COMPLETADO'
                  : 'PENDIENTE';

              if (nextEstado === 'COMPLETADO') {
                completedTimestamps.current[detailId] = Date.now();
              } else {
                delete completedTimestamps.current[detailId];
              }

              return { ...detail, estado: nextEstado };
            }
            return detail;
          }),
        }))
      );
    } catch (error) {
      alert('Error al cambiar el estado del pedido. Por favor, intenta nuevamente.');
    }
  };

  return (
    <div className="kitchen-board">
      {orders.length > 0 ? (
        orders.map(({ mesa, detalles }) => (
          <div key={mesa} className="order-group">
            <h3>{mesa}</h3>
            <ul className="order-list">
              {detalles.map((detail) => (
                <li
                  key={detail.id}
                  onClick={() => toggleOrderStatus(detail.id)}
                  className={`order-item ${detail.estado.toLowerCase()}`}
                >
                  <div>
                    <strong>{detail.plato}</strong> - Cantidad: {detail.cantidad}
                  </div>
                  <div className="order-status">Estado: {detail.estado}</div>
                  {detail.notas && (
                    <div className="order-note">Nota: {detail.notas}</div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p className="no-orders-message">No hay comandas activas.</p>
      )}
    </div>
  );
};

export default KitchenBoard;