import React, { useEffect, useState } from 'react';
import QuantitySelector from '../globlal/QuantitySelector';
import { createOrder, createOrderDetail, fetchOrders } from '../../../api';
import { useNavigate } from 'react-router-dom';

interface SelectedDish {
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

const AddOrderBar: React.FC = () => {
  const [selectedDishes, setSelectedDishes] = useState<SelectedDish[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [selectionLocked, setSelectionLocked] = useState<SelectedTable | null>(null);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrder = JSON.parse(localStorage.getItem('pedido') || '[]');
    setSelectedDishes(storedOrder);

    const storedTable = localStorage.getItem('selectedTable');
    if (storedTable) {
      const parsed: SelectedTable = JSON.parse(storedTable);
      setSelectionLocked(parsed);
      parsed.type === 'mesa' ? setTableNumber(parsed.value) : setClientName(parsed.value);
    }
  }, []);

  const updateQuantity = (id: number, newQuantity: number) =>
    setSelectedDishes((prev) => {
      const updated = prev.map((dish) => (dish.id === id ? { ...dish, cantidad: newQuantity } : dish));
      localStorage.setItem('pedido', JSON.stringify(updated));
      return updated;
    });

  const updateNote = (id: number, newNote: string) =>
    setSelectedDishes((prev) => {
      const updated = prev.map((dish) => (dish.id === id ? { ...dish, notas: newNote } : dish));
      localStorage.setItem('pedido', JSON.stringify(updated));
      return updated;
    });

  const removeDish = (id: number) =>
    setSelectedDishes((prev) => {
      const updated = prev.filter((dish) => dish.id !== id);
      localStorage.setItem('pedido', JSON.stringify(updated));
      return updated;
    });

  const handleRemoveSelection = () => {
    localStorage.removeItem('selectedTable');
    setSelectionLocked(null);
    setTableNumber('');
    setClientName('');
  };

  const handlePlaceOrder = async () => {
    try {
      const mesa = tableNumber.trim();
      const cliente = clientName.trim();

      if (!mesa && !cliente) {
        alert('Por favor, asigna un número de mesa o un nombre de cliente.');
        return;
      }

      const isMesa = !!mesa;
      const value = isMesa ? mesa : cliente;

      const orders = await fetchOrders();
      const unpaidOrders = orders.filter(
        (order: any) =>
          !order.pagado &&
          ((isMesa && order.mesa === Number(value)) || (!isMesa && order.nombreCliente === value))
      );

      const pedidoId = unpaidOrders.length > 0 ? unpaidOrders[0].id : (await createOrder({ mesa: isMesa ? Number(value) : null, nombreCliente: isMesa ? null : value })).id;

      for (const dish of selectedDishes) {
        await createOrderDetail({
          pedidoId,
          platoId: dish.id,
          cantidad: dish.cantidad,
          notas: dish.notas || '',
        });
      }

      localStorage.removeItem('pedido');
      localStorage.removeItem('selectedTable');
      setSelectedDishes([]);
      setTableNumber('');
      setClientName('');
      setSelectionLocked(null);
      navigate('/trabajadores/barra');
    } catch (error) {
      alert('Hubo un error al procesar el pedido. Por favor, intenta nuevamente.');
    }
  };

  const handleCancelOrder = () => {
    localStorage.removeItem('pedido');
    localStorage.removeItem('selectedTable');
    setSelectedDishes([]);
    setTableNumber('');
    setClientName('');
    setSelectionLocked(null);
    navigate('/trabajadores/barra');
  };

  return (
    <div className="add-order-bar">
      {/* Encabezado */}
      <div className="header">
        <h1>Pedido Actual</h1>
        <button className="cancel-button" onClick={handleCancelOrder}>Cancelar Pedido</button>
      </div>

      {/* Selección de Mesa o Nombre */}
      <div className="table-selection">
        <h2>Asignar Mesa o Nombre</h2>
        <div className="input-group">
          <input
            type="number"
            placeholder="Número de mesa"
            value={tableNumber}
            disabled={!!selectionLocked}
            onChange={(e) => {
              setTableNumber(e.target.value);
              setClientName('');
            }}
            className="input-field"
          />
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={clientName}
            disabled={!!selectionLocked}
            onChange={(e) => {
              setClientName(e.target.value);
              setTableNumber('');
            }}
            className="input-field"
          />
          {selectionLocked && (
            <button className="remove-button" onClick={handleRemoveSelection}>
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Lista de Platos */}
      <div className="dishes-list">
        {selectedDishes.length > 0 ? (
          selectedDishes.map((dish) => (
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
              <button className="remove-dish-button" onClick={() => removeDish(dish.id)}>
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p className="no-dishes-message">No hay platos seleccionados</p>
        )}
      </div>

      {/* Botón Pedir */}
      {selectedDishes.length > 0 && (tableNumber || clientName.trim()) && (
        <button className="place-order-button" onClick={handlePlaceOrder}>
          Pedir
        </button>
      )}
    </div>
  );
};

export default AddOrderBar;