import React, { useEffect, useState } from 'react';
import QuantitySelector from '../globlal/QuantitySelector';
import { createOrder, createOrderDetail, fetchActiveOrdersForTable } from '../../../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

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
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

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
      if (!user) {
        alert('Error: No se ha podido identificar al usuario. Por favor, inicie sesión de nuevo.');
        return;
      }

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
        const createdOrder = await createOrder({ 
          mesa: finalTable,
          usuario_id: user.id 
        });
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
    <div className="add-order-container">
      <div className="header">
        <h1>Pedido Actual</h1>
        <button className="btn btn-danger cancel-order-button" onClick={handleCancelOrder}>
          Cancelar Pedido
        </button>
      </div>
      <div className="table-selection">
        <h2>Número de Mesa</h2>
        {tableNumber !== null && selectionLocked ? (
          <div className="selected-table">
            <p>Mesa seleccionada: {tableNumber}</p>
            <button className="btn btn-warning remove-table-button btn-sm" onClick={handleRemoveTable}>
              Eliminar Mesa
            </button>
          </div>
        ) : (
          <input
            type="number"
            placeholder="Número de mesa"
            value={inputTableNumber}
            onChange={(e) => setInputTableNumber(e.target.value)}
            className="input-field"
          />
        )}
      </div>
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
                  <button className="btn btn-secondary save-note-button btn-sm" onClick={() => setEditingNoteId(null)}>
                    Guardar Nota
                  </button>
                </div>
              ) : (
                <>
                  {dish.notas && <p className="note">{dish.notas}</p>}
                  <button className="btn btn-link edit-note-button btn-sm" onClick={() => setEditingNoteId(dish.id)}>
                    Editar Nota
                  </button>
                </>
              )}

              <div className="remove-dish">
                <button className="remove-dish-button" onClick={() => removeDish(dish.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-dishes-message">No hay platos seleccionados</p>
        )}
      </div>
      {AddOrders.length > 0 && (tableNumber || inputTableNumber.trim() !== '') && (
        <button className="btn btn-success place-order-button btn-lg" onClick={handlePlaceOrder}>
          Pedir
        </button>
      )}
    </div>
  );
};

export default AddOrderWaiter;