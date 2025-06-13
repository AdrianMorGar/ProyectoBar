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
    <div className="sales-page-container">
      <div className="sales-header">
        <h2 className="title">Ganancias del Año {year}</h2>
        <div className="date-navigation">
          <button className="btn btn-default" onClick={() => changeYear(-1)}>
            {'<'} Año Anterior
          </button>
          <button className="btn btn-default" onClick={() => changeYear(1)}>
            Siguiente Año {'>'}
          </button>
        </div>
      </div>
      <ul className="sales-list">
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <li key={month} className="sales-list-item-wrapper">
            <Link
              to={`detalles/${year}/${month}`}
              className="sales-item-link-wrapper"
            >
              <div className="sales-list-item">
                <div className="item-header">
                  <span className="monthName">
                    {new Date(year, month - 1).toLocaleString('es-ES', { month: 'long' })}
                  </span>
                </div>
                <div className="monthDetails">
                  <span className="item-amount">{monthlySales.get(month)?.toFixed(2) || '0.00'} €</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="total-sales">Total del Año: {totalYearlySales.toFixed(2)} €</div>
    </div>
  );
};

export default SalesCalendar;