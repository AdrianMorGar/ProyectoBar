import React, { useEffect, useState } from 'react';
import {
  fetchActiveOrders,
  fetchActiveOrdersForTable,
  cancelOrderDetail,
  updateOrderDetail,
  updateOrder,
  fetchOrderBill,
} from '../../../api';
import QuantitySelector from './QuantitySelector';

interface PedidoDetalle {
  id: number;
  cantidad: number;
  precioUnitario: number;
  plato: string;
  estado: 'Pendiente' | 'Servido' | 'Cancelado';
  notas?: string;
}

interface Pedido {
  id: number;
  mesa: number | null;
  nombreCliente: string | null;
  fecha: string;
  pagado: boolean;
  detalles: PedidoDetalle[];
}

const EditOrder: React.FC = () => {
  const [detallesMesa, setDetallesMesa] = useState<PedidoDetalle[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState<{ value: string; type: 'mesa' | 'cliente' } | null>(null);
  const [nuevaMesa, setNuevaMesa] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [tempData, setTempData] = useState<{ [key: number]: { cantidad: number; notas: string } }>({});
  const [showTransfer, setShowTransfer] = useState(false);
  const [totalCuenta, setTotalCuenta] = useState<number | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem('selectedTable');
    if (raw) {
      const parsed = JSON.parse(raw);
      setMesaSeleccionada(parsed);
    } else {
      setError('No se ha seleccionado ninguna mesa o cliente.');
    }
  }, []);

  const loadPedidos = async () => {
    try {
      if (!mesaSeleccionada) return;

      setLoading(true);
      let pedidosData: Pedido[] = [];

      if (mesaSeleccionada.type === 'mesa') {
        pedidosData = await fetchActiveOrdersForTable(Number(mesaSeleccionada.value));
      } else {
        const allOrders: Pedido[] = await fetchActiveOrders();
        pedidosData = allOrders.filter(
          (p) => !p.pagado && p.nombreCliente === mesaSeleccionada.value
        );
      }

      if (pedidosData.length === 0) {
        setError('No se encontró ningún pedido activo.');
        return;
      }

      setPedidos(pedidosData);
      const allDetalles = pedidosData.flatMap((pedido) => pedido.detalles || []);
      setDetallesMesa(allDetalles);

      const total = await fetchOrderBill(pedidosData[0].id);
      setTotalCuenta(total);
    } catch {
      setError('Hubo un error al cargar los detalles del pedido.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPedidos();
  }, [mesaSeleccionada]);

  const handleUpdate = async () => {
    try {
      await Promise.all(
        detallesMesa.map((detalle) => {
          const temp = tempData[detalle.id];
          const cantidad = temp?.cantidad ?? detalle.cantidad;
          const notas = temp?.notas ?? detalle.notas ?? '';

          return updateOrderDetail(detalle.id, {
            cantidad,
            estado: detalle.estado.toUpperCase(),
            notas,
          });
        })
      );

      setTempData({});
      await loadPedidos();
      setEditing(false);
    } catch {
      setError('Hubo un error al guardar los cambios.');
    }
  };

  const cancelarPlato = async (id: number, nombrePlato: string) => {
    if (!window.confirm(`¿Seguro que deseas cancelar "${nombrePlato}"?`)) return;

    try {
      await cancelOrderDetail(id);
      await loadPedidos();
    } catch {
      setError('No se pudo cancelar el plato.');
    }
  };

  const handleTransferTable = async () => {
    try {
      if (!nuevaMesa) {
        setError('Debes ingresar un número de mesa válido.');
        return;
      }

      const pedidosNuevaMesa = await fetchActiveOrdersForTable(nuevaMesa);
      if (pedidosNuevaMesa.length > 0) {
        setError('Ya existe un pedido activo para la mesa seleccionada.');
        return;
      }

      const pedido = pedidos[0];
      const pedidoActualizado = {
        ...pedido,
        nombreCliente: null,
        mesa: nuevaMesa,
      };

      await updateOrder(pedido.id, pedidoActualizado);

      const newSelection = { value: nuevaMesa.toString(), type: 'mesa' as const };
      localStorage.setItem('selectedTable', JSON.stringify(newSelection));
      setMesaSeleccionada(newSelection);
      setShowTransfer(false);
      setNuevaMesa(null);
    } catch {
      setError('No se pudo transferir el pedido a otra mesa.');
    }
  };

  const mesaVisual = mesaSeleccionada
    ? mesaSeleccionada.type === 'mesa'
      ? `Mesa #${mesaSeleccionada.value}`
      : `Cliente: ${mesaSeleccionada.value}`
    : '';

  if (error) return <p className="error">{error}</p>;
  if (loading) return <p>Cargando pedido...</p>;
  if (!mesaSeleccionada) return <p>No se ha seleccionado una mesa o cliente.</p>;

  return (
    <div className="edit-order">
      <h1>{mesaVisual}</h1>

      <div className="transferencia">
        {showTransfer ? (
          <div>
            <input
              type="number"
              placeholder="Nueva mesa"
              value={nuevaMesa || ''}
              onChange={(e) => setNuevaMesa(Number(e.target.value))}
            />
            <button onClick={handleTransferTable}>Guardar</button>
            <button onClick={() => setShowTransfer(false)}>Cancelar</button>
          </div>
        ) : (
          <button onClick={() => setShowTransfer(true)} className="btn btn-secondary">
            Transferencia de mesa
          </button>
        )}
      </div>

      {detallesMesa.length === 0 ? (
        <p>No hay platos en el pedido.</p>
      ) : (
        <>
          {detallesMesa
            .filter((d) => d.estado !== 'Cancelado' && !d.plato.toLowerCase().includes('bebida'))
            .map((detalle) => {
              const temp = tempData[detalle.id] || {
                cantidad: detalle.cantidad,
                notas: detalle.notas || '',
              };

              return (
                <div key={detalle.id} className="detalle-card">
                  <h3>{detalle.plato}</h3>
                  <p>Estado actual: {detalle.estado}</p>
                  <p>Precio Unitario: {detalle.precioUnitario.toFixed(2)}€</p>

                  {editing ? (
                    <>
                      <QuantitySelector
                        quantity={temp.cantidad}
                        setQuantity={(newQty) =>
                          setTempData((prev) => ({
                            ...prev,
                            [detalle.id]: {
                              cantidad: newQty,
                              notas: prev[detalle.id]?.notas ?? detalle.notas ?? '',
                            },
                          }))
                        }
                      />
                      <textarea
                        placeholder="Notas para cocina..."
                        value={temp.notas}
                        onChange={(e) =>
                          setTempData((prev) => ({
                            ...prev,
                            [detalle.id]: {
                              cantidad: prev[detalle.id]?.cantidad ?? detalle.cantidad,
                              notas: e.target.value,
                            },
                          }))
                        }
                      />
                    </>
                  ) : (
                    <>
                      <p>Cantidad: {detalle.cantidad}</p>
                      {detalle.notas && <p>Nota: {detalle.notas}</p>}
                    </>
                  )}

                  <div className="botones">
                    <button
                      onClick={() => setEditing(!editing)}
                      className={editing ? 'btn btn-danger' : 'btn btn-success'}
                    >
                      {editing ? 'Cancelar' : 'Editar'}
                    </button>

                    {editing && (
                      <button onClick={handleUpdate} className="btn btn-primary">
                        Guardar cambios
                      </button>
                    )}

                    <button onClick={() => cancelarPlato(detalle.id, detalle.plato)} className="btn btn-danger">
                      Cancelar plato
                    </button>
                  </div>
                </div>
              );
            })}

          <div className="total">
            <strong>Total: {totalCuenta?.toFixed(2) ?? '0.00'}€</strong>
          </div>
        </>
      )}
    </div>
  );
};

export default EditOrder;