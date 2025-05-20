import React from 'react';
import jsPDF from 'jspdf';
import {
  fetchOrders,
  fetchActiveOrdersForTable,
  fetchOrderBill,
  updateOrder,
} from '../../../api';

const PrintOrderPDF: React.FC = () => {
  const handlePrint = async () => {
    const raw = localStorage.getItem('selectedTable');
    if (!raw) {
      alert('No hay pedido seleccionado para imprimir.');
      return;
    }

    const selected = JSON.parse(raw); // { value: '3', type: 'mesa' | 'cliente' }

    let pedido = null;

    try {
      if (selected.type === 'mesa') {
        const pedidos = await fetchActiveOrdersForTable(Number(selected.value));
        pedido = pedidos.find((p: any) => !p.pagado);
      } else {
        const all = await fetchOrders();
        pedido = all.find((p: any) => p.nombreCliente === selected.value && !p.pagado);
      }

      if (!pedido) {
        alert('No se encontró el pedido.');
        return;
      }

      const detallesActivos = pedido.detalles.filter(
        (item: any) => item.estado.toUpperCase() !== 'CANCELADO'
      );

      if (detallesActivos.length === 0) {
        alert('Este pedido no tiene productos activos para imprimir.');
        return;
      }

      const total = await fetchOrderBill(pedido.id);

      const doc = new jsPDF({ unit: 'mm', format: [80, 150 + detallesActivos.length * 10] });

      doc.setFontSize(12);
      doc.text('Bar Restaurante', 40, 10, { align: 'center' });

      const info = selected.type === 'mesa'
        ? `Mesa: ${pedido.mesa}`
        : `Cliente: ${pedido.nombreCliente}`;
      doc.text(info, 40, 18, { align: 'center' });

      doc.text(`Fecha: ${new Date(pedido.fecha).toLocaleString()}`, 40, 24, {
        align: 'center',
      });

      doc.setFontSize(10);
      let y = 32;

      doc.text('-----------------------------', 40, y, { align: 'center' });

      detallesActivos.forEach((item: any) => {
        y += 6;
        doc.text(`${item.plato}`, 10, y);
        doc.text(`${item.cantidad} x ${item.precioUnitario.toFixed(2)} €`, 10, y + 4);
        doc.text(
          `${(item.cantidad * item.precioUnitario).toFixed(2)} €`,
          70,
          y + 4,
          { align: 'right' }
        );
        y += 4;
      });

      y += 6;
      doc.text('-----------------------------', 40, y, { align: 'center' });

      y += 8;
      doc.setFontSize(12);
      doc.text(`TOTAL: $${total.toFixed(2)}`, 40, y, { align: 'center' });

      doc.save(`pedido-${pedido.id}.pdf`);

      await updateOrder(pedido.id, {
        ...pedido,
        pagado: true,
      });

      localStorage.removeItem('selectedTable');
      window.location.href = 'http://localhost:5173/trabajadores/barra';
    } catch (error) {
      alert('Error al imprimir el pedido.');
    }
  };

  return (
    <button
      onClick={handlePrint}
      style={{
        marginTop: '10px',
        padding: '8px 16px',
        backgroundColor: '#17a2b8',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
      }}
    >
      Imprimir Pedido
    </button>
  );
};

export default PrintOrderPDF;
