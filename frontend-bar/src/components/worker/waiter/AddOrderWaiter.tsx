import React, { useEffect, useState } from 'react';
import QuantitySelector from '../globlal/QuantitySelector';
import { createOrder, createOrderDetail, fetchActiveOrdersForTable } from '../../../api';
import { useNavigate } from 'react-router-dom';

interface AddOrder {
  id: number;
  nombrePlato: string;
  cantidad: number;
  precio: number;
  notas?: string;
}

interface SelectedTable {
  value: string;
  type: 'mesa' | 'cliente';
}

const AddOrderWaiter: React.FC = () => {
  const [AddOrders, setAddOrders] = useState<AddOrder[]>([]);
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [inputTableNumber, setInputTableNumber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectionLocked, setSelectionLocked] = useState<SelectedTable | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null); // <-- ID del plato editando
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('pedido') || '[]');
    setAddOrders(storedOrder);

    const selectedTable = localStorage.getItem('selectedTable');
    if (selectedTable) {
      const parsed: SelectedTable = JSON.parse(selectedTable);

      if (parsed.type === 'cliente') {
        setError('No tienes permiso para servir a barra con este rol.');
        setTimeout(() => navigate('/trabajadores/comandero'), 3000);
        return;
      }

      if (parsed.type === 'mesa') {
        setTableNumber(Number(parsed.value));
        setSelectionLocked(parsed);
      }
    }
  }, [navigate]);

  const updateQuantity = (id: number, newQuantity: number) => {
    const updatedOrder = AddOrders.map((dish) =>
      dish.id === id ? { ...dish, cantidad: newQuantity } : dish
    );
    setAddOrders(updatedOrder);
    localStorage.setItem('pedido', JSON.stringify(updatedOrder));
  };

  const updateNote = (id: number, newNote: string) => {
    const updatedOrder = AddOrders.map((dish) =>
      dish.id === id ? { ...dish, notas: newNote } : dish
    );
    setAddOrders(updatedOrder);
    localStorage.setItem('pedido', JSON.stringify(updatedOrder));
  };

  const removeDish = (id: number) => {
    const updatedOrder = AddOrders.filter((dish) => dish.id !== id);
    setAddOrders(updatedOrder);
    localStorage.setItem('pedido', JSON.stringify(updatedOrder));
  };

  const handleRemoveTable = () => {
    localStorage.removeItem('selectedTable');
    setSelectionLocked(null);
    setTableNumber(null);
    setInputTableNumber('');
  };

  const handlePlaceOrder = async () => {
    try {
      const finalTable = tableNumber ?? (inputTableNumber ? Number(inputTableNumber) : null);
      if (!finalTable) {
        alert('Por favor, asigna un número de mesa.');
        return;
      }

      const activeOrders = await fetchActiveOrdersForTable(finalTable);
      const unpaidOrders = activeOrders.filter((order: { pagado: boolean }) => !order.pagado);

      let pedidoId: number;

      if (unpaidOrders.length > 0) {
        pedidoId = unpaidOrders[0].id;
      } else {
        const createdOrder = await createOrder({ mesa: finalTable });
        if (!createdOrder.id) {
          throw new Error('El pedido recién creado no tiene un ID válido.');
        }
        pedidoId = createdOrder.id;
      }

      for (const dish of AddOrders) {
        await createOrderDetail({
          pedidoId,
          platoId: dish.id,
          cantidad: dish.cantidad,
          notas: dish.notas || '',
        });
      }

      localStorage.removeItem('pedido');
      localStorage.removeItem('selectedTable');
      setAddOrders([]);
      setTableNumber(null);
      setInputTableNumber('');
      setSelectionLocked(null);
      navigate('/trabajadores/comandero');
    } catch (error) {
      alert('Hubo un error al procesar el pedido. Por favor, intenta nuevamente.');
    }
  };

  const handleCancelOrder = () => {
    localStorage.removeItem('pedido');
    localStorage.removeItem('selectedTable');
    setAddOrders([]);
    setTableNumber(null);
    setInputTableNumber('');
    setSelectionLocked(null);
    navigate('/trabajadores/comandero');
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="add-order-waiter">
      {/* Encabezado */}
      <div className="header">
        <h1>Pedido Actual</h1>
        <button className="cancel-button" onClick={handleCancelOrder}>
          Cancelar Pedido
        </button>
      </div>

      {/* Selección de Mesa */}
      <div className="table-selection">
        <h2>Número de Mesa</h2>
        {tableNumber !== null && selectionLocked ? (
          <div className="selected-table">
            <p>Mesa seleccionada: {tableNumber}</p>
            <button className="remove-table-button" onClick={handleRemoveTable}>
              Eliminar Mesa
            </button>
          </div>
        ) : (
          <input
            type="number"
            placeholder="Número de mesa"
            value={inputTableNumber}
            onChange={(e) => setInputTableNumber(e.target.value)}
            className="table-input"
          />
        )}
      </div>

      {/* Lista de Platos */}
      <div className="dishes-list">
        {AddOrders.length > 0 ? (
          AddOrders.map((dish) => (
            <div key={dish.id} className="dish-item">
              <strong>{dish.nombrePlato}</strong>
              <div className="quantity-selector">
                <span>Cantidad: </span>
                <QuantitySelector
                  quantity={dish.cantidad}
                  setQuantity={(newQuantity) => updateQuantity(dish.id, newQuantity)}
                />
              </div>

              {editingNoteId === dish.id ? (
                <div className="note-editor">
                  <textarea
                    placeholder="Notas para cocina..."
                    value={dish.notas || ''}
                    onChange={(e) => updateNote(dish.id, e.target.value)}
                    className="note-textarea"
                  />
                  <button className="save-note-button" onClick={() => setEditingNoteId(null)}>
                    Guardar Nota
                  </button>
                </div>
              ) : (
                <>
                  {dish.notas && <p className="note">{dish.notas}</p>}
                  <button className="edit-note-button" onClick={() => setEditingNoteId(dish.id)}>
                    Editar Nota
                  </button>
                </>
              )}

              <div className="remove-dish">
                <button onClick={() => removeDish(dish.id)}>Eliminar</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-dishes-message">No hay platos seleccionados</p>
        )}
      </div>

      {/* Botón Pedir */}
      {AddOrders.length > 0 && (tableNumber || inputTableNumber.trim() !== '') && (
        <button className="place-order-button" onClick={handlePlaceOrder}>
          Pedir
        </button>
      )}
    </div>
  );
};

export default AddOrderWaiter;