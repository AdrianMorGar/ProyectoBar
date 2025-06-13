import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchDailySalesByMonth } from '../../../api';

const DailySalesCalendar: React.FC = () => {
  const navigate = useNavigate();
  const { year: yearParam, month: monthParam } = useParams<{ year: string; month: string }>();
  const [year, setYear] = useState(parseInt(yearParam || new Date().getFullYear().toString(), 10));
  const [month, setMonth] = useState(parseInt(monthParam || (new Date().getMonth() + 1).toString(), 10));
  const [dailySales, setDailySales] = useState<Map<number, number>>(new Map());
  const [totalMonthlySales, setTotalMonthlySales] = useState(0);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await fetchDailySalesByMonth(year, month);
        const salesMap = new Map(Object.entries(data).map(([day, total]) => [parseInt(day), Number(total)]));
        setDailySales(salesMap);
        const monthlyTotal = Array.from(salesMap.values()).reduce((sum, value) => sum + value, 0);
        setTotalMonthlySales(monthlyTotal);
      } catch (error) {
        alert('Hubo un error al cargar las ventas');
      }
    };
    loadSales();
  }, [year, month]);

  const changeMonth = (increment: number) => {
    let newMonth = month + increment;
    let newYear = year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    } else if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }

    setYear(newYear);
    setMonth(newMonth);
    navigate(`/dueno/ventas/detalles/${newYear}/${newMonth}`);
  };

  const getMonthName = (monthNumber: number): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[monthNumber - 1];
  };

  return (
    <div className="sales-page-container">
      <div className="sales-header">
        <h2 className="title">Ganancias de {getMonthName(month)} {year}</h2>
        <div className="date-navigation">
          <button className="btn btn-default" onClick={() => changeMonth(-1)}>
            {'<'} Mes Anterior
          </button>
          <button className="btn btn-default" onClick={() => changeMonth(1)}>
            Siguiente Mes {'>'}
          </button>
        </div>
      </div>
      <ul className="sales-list">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <li key={day} className="sales-list-item-wrapper">
            <Link
              to={`/dueno/detalles-ventas/${year}/${month}/${day}`}
              className="sales-item-link-wrapper"
            >
              <div className="sales-list-item">
                <div className="item-header">
                  <span className="dayName">{`${day} de ${getMonthName(month)}`}</span>
                </div>
                <div className="dayDetails">
                  <span className="item-amount">{dailySales.get(day)?.toFixed(2) || '0.00'} €</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="total-sales">Total del Mes: {totalMonthlySales.toFixed(2)} €</div>
    </div>
  );
};

export default DailySalesCalendar;