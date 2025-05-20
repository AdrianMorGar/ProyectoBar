import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMonthlySalesByYear } from '../../../api';

const SalesCalendar: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthlySales, setMonthlySales] = useState<Map<number, number>>(new Map());
  const [totalYearlySales, setTotalYearlySales] = useState(0);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await fetchMonthlySalesByYear(year);

        // Calcular el total anual
        const salesMap = new Map(Object.entries(data).map(([month, total]) => [parseInt(month), total]));
        setMonthlySales(salesMap);
        const yearlyTotal = Array.from(salesMap.values()).reduce((sum, value) => sum + value, 0);
        setTotalYearlySales(yearlyTotal);
      } catch (error) {
        alert('Hubo un error al cargar las ventas');
      }
    };
    loadSales();
  }, [year]);

  const changeYear = (increment: number) => {
    setYear((prevYear) => prevYear + increment);
  };

  return (
    <div className="container">
      <h2 className="title">Ganancias del Año {year}</h2>

      {/* Botones para cambiar de año */}
      <div className="yearButtons">
        <button className="yearButton" onClick={() => changeYear(-1)}>
          {'<'} Año Anterior
        </button>
        <button className="yearButton" onClick={() => changeYear(1)}>
          Siguiente Año {'>'}
        </button>
      </div>

      {/* Lista de meses y ganancias */}
      <ul className="monthList">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <li key={month} className="monthItem">
            <span className="monthName">
              {new Date(year, month - 1).toLocaleString('default', { month: 'long' })}
            </span>
            <div className="monthDetails">
              <span>${monthlySales.get(month)?.toFixed(2) || '0.00'}</span>
              <Link to={`detalles/${year}/${month}`} className="detailsButton">
                Detalles
              </Link>
            </div>
          </li>
        ))}
      </ul>

      {/* Total anual */}
      <div className="total">Total del Año: ${totalYearlySales.toFixed(2)}</div>
    </div>
  );
};

export default SalesCalendar;