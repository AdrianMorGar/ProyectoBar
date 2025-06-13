import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../../../api';

interface Order {
  id: number;
  mesa: number | null;
  nombreCliente: string | null;
  pagado: boolean;
}

const ActiveTablesList: React.FC = () => {
  const [activeTables, setActiveTables] = useState<
    { id: number; label: string; value: string; type: 'mesa' | 'cliente' }[]
  >([]);

  useEffect(() => {
    const loadActiveTables = async () => {
      try {
        const orders = await fetchOrders();
        const activeOrders = orders.filter((order: Order) => !order.pagado);

        const unique = new Set<string>();
        const tables = activeOrders
          .map((order: Order) => {
            const isMesa = order.mesa !== null;
            const label = isMesa ? `Mesa ${order.mesa}` : `Barra ${order.nombreCliente}`;
            const value = isMesa ? String(order.mesa) : String(order.nombreCliente);
            const type: 'mesa' | 'cliente' = isMesa ? 'mesa' : 'cliente';

            const uniqueKey = `${type}:${value}`;
            if (!unique.has(uniqueKey)) {
              unique.add(uniqueKey);
              return { id: order.id, label, value, type };
            }
            return null;
          })
          .filter(Boolean) as { id: number; label: string; value: string; type: 'mesa' | 'cliente' }[];

        setActiveTables(tables);
      } catch (error) {
        alert('Error al cargar las mesas activas. Por favor, intenta nuevamente.');
      }
    };

    loadActiveTables();
  }, []);

  const handleTableSelection = (value: string, type: 'mesa' | 'cliente') => {
    localStorage.setItem('selectedTable', JSON.stringify({ value, type }));
    window.location.href = './';
  };

  return (
    <div className="active-tables-container">
      <div className="tables-list">
        {activeTables.length > 0 ? (
          activeTables.map((table) => (
            <div key={table.id} className="table-item">
              <button
                className="btn table-button"
                onClick={() => handleTableSelection(table.value, table.type)}
              >
                {table.label}
              </button>
            </div>
          ))
        ) : (
          <p className="no-tables-message">No hay mesas activas</p>
        )}
      </div>
    </div>
  );
};

export default ActiveTablesList;