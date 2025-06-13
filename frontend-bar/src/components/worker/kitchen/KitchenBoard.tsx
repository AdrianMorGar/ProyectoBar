import React, { useEffect, useState, useRef } from 'react';
import { fetchKitchenOrders, toggleOrderDetailStatus, serveOrderDetail } from '../../../api';

interface OrderDetail {
  id: number;
  cantidad: number;
  precioUnitario: number;
  plato: string;
  estado: string;
  notas?: string;
  mesa?: string;
}

interface KitchenOrderGroup {
  mesa: string;
  detalles: OrderDetail[];
}

const KitchenBoard: React.FC = () => {
  const [orderGroups, setOrderGroups] = useState<KitchenOrderGroup[]>([]);
  const completedTimestamps = useRef<{ [id: number]: number }>({});

  const loadOrders = async () => {
    try {
      const data: KitchenOrderGroup[] = await fetchKitchenOrders();
      setOrderGroups(data);
    } catch (error) {
      console.error("Error loading kitchen orders:", error);
      alert('Error al cargar las comandas. Por favor, intenta nuevamente.');
    }
  };

  useEffect(() => {
    loadOrders();
    const fetchInterval = setInterval(loadOrders, 5000); // Refresca en 5s
    return () => clearInterval(fetchInterval);
  }, []);

  useEffect(() => {
    const checkInterval = setInterval(async () => {
      const now = Date.now();
      let needsUpdate = false;
      const updatedOrderGroups = [...orderGroups];

      for (const group of updatedOrderGroups) {
        for (let i = 0; i < group.detalles.length; i++) {
          const detail = group.detalles[i];
          if (detail.estado === 'COMPLETADO') {
            const timestamp = completedTimestamps.current[detail.id];
            if (!timestamp) {
              completedTimestamps.current[detail.id] = now;
            } else if (now - timestamp >= 15000) { // Se pasa de estado a SERVIDO en 15s
              try {
                await serveOrderDetail(detail.id);
                delete completedTimestamps.current[detail.id];
                needsUpdate = true;
              } catch (error) {
                console.error(`Error auto-serving detail ${detail.id}:`, error);
              }
            }
          }
        }
      }
      if (needsUpdate) {
        loadOrders();
      }
    }, 1000); // Mira el estado en el que se encuentra cada segundo
    return () => clearInterval(checkInterval);
  }, [orderGroups]);

  const handleToggleOrderStatus = async (detailId: number) => {
    try {
      await toggleOrderDetailStatus(detailId);
      setOrderGroups((prevOrderGroups) =>
        prevOrderGroups.map((group) => ({
          ...group,
          detalles: group.detalles.map((detail) => {
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
      console.error("Error toggling order status:", error);
      alert('Error al cambiar el estado del pedido. Por favor, intenta nuevamente.');
    }
  };

  const activeOrderGroups = orderGroups.map(group => ({
    ...group,
    detalles: group.detalles.filter(detail => detail.estado !== 'SERVIDO')
  })).filter(group => group.detalles.length > 0);

  return (
    <div className="board-grid-container kitchen-board">
      {activeOrderGroups.length > 0 ? (
        activeOrderGroups.map((group) => (
          <div key={group.mesa} className="order-group">
            <h3 className="kitchen-order-table-identifier">{group.mesa}</h3>
            <ul className="kitchen-order-detail-list">
              {group.detalles.map((detail) => (
                <li
                  key={detail.id}
                  onClick={() => handleToggleOrderStatus(detail.id)}
                  className={`order-item ${detail.estado.toLowerCase()}`}
                >
                  <div>
                    <strong>{detail.plato}</strong> - Cantidad: {detail.cantidad}
                  </div>
                  <div className="kitchen-order-detail-status">Estado: {detail.estado.replace('_', ' ')}</div>
                  {detail.notas && (
                    <div className="note">Nota: {detail.notas}</div>
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