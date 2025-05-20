import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchDailySalesDetails } from '../../../api';

interface SalesDetail {
  id: number;
  total: number;
  detalles: {
    id: number;
    cantidad: number;
    precioUnitario: number;
    plato: string;
  }[];
}

const DailySalesDetails: React.FC = () => {
  const { year, month, day } = useParams<{ year: string; month: string; day: string }>();
  const [salesDetails, setSalesDetails] = useState<SalesDetail[]>([]);

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();

  const parsedYear = parseInt(year || currentYear.toString());
  const parsedMonth = parseInt(month || currentMonth.toString());
  const parsedDay = parseInt(day || currentDay.toString());

  useEffect(() => {
    const loadSalesDetails = async () => {
      try {
        const data = await fetchDailySalesDetails(parsedYear, parsedMonth, parsedDay);
        if (Array.isArray(data)) {
          setSalesDetails(data);
        } else {
          alert('Los datos recibidos no son válidos.');
        }
      } catch (error) {
        alert('Hubo un error al cargar los detalles de ventas.');
      }
    };
    loadSalesDetails();
  }, [parsedYear, parsedMonth, parsedDay]);

  // Calcular el total del día
  const dailyTotal = salesDetails.reduce((sum, pedido) => sum + pedido.total, 0);

  const getMonthName = (monthNumber: number): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1];
  };

  return (
    <div className="container">
      <h2 className="title">Detalles de Ventas del {`${parsedDay} de ${getMonthName(parsedMonth)} ${parsedYear}`}</h2>

      <ul className="salesList">
        {salesDetails.length > 0 ? (
          salesDetails.map((pedido) => (
            <li key={pedido.id} className="salesItem">
              <h3 className="salesTitle">Pedido #{pedido.id} - Total: ${pedido.total.toFixed(2)}</h3>
              <ul className="detailsList">
                {pedido.detalles.map((detalle) => (
                  <li key={detalle.id} className="detailItem">
                    <span>{detalle.plato} (Cantidad: {detalle.cantidad}), Precio Unitario: ${detalle.precioUnitario.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))
        ) : (
          <p className="noDataMessage">No hay detalles de ventas para este día.</p>
        )}
      </ul>

      <div className="total">Total del Día: ${dailyTotal.toFixed(2)}</div>
    </div>
  );
};

export default DailySalesDetails;