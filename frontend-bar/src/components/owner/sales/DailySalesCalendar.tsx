import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { fetchDailySalesByMonth } from '../../../api';

const DailySalesCalendar: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegar programáticamente
  const { year: yearParam, month: monthParam } = useParams<{ year: string; month: string }>();
  const [year, setYear] = useState(parseInt(yearParam || new Date().getFullYear().toString(), 10));
  const [month, setMonth] = useState(parseInt(monthParam || (new Date().getMonth() + 1).toString(), 10));
  const [dailySales, setDailySales] = useState<Map<number, number>>(new Map());
  const [totalMonthlySales, setTotalMonthlySales] = useState(0);

  useEffect(() => {
    const loadSales = async () => {
      try {
        const data = await fetchDailySalesByMonth(year, month);

        // Calcular el total mensual y verlo
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

  // Manejo de cambios de mes
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

    // Actualizar la URL al cambiar de mes
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
    <div className="container">
      <h2 className="title">Ganancias de {getMonthName(month)} {year}</h2>

      {/* Botones para cambiar de mes */}
      <div className="monthButtons">
        <button className="monthButton" onClick={() => changeMonth(-1)}>
          {'<'} Mes Anterior
        </button>
        <button className="monthButton" onClick={() => changeMonth(1)}>
          Siguiente Mes {'>'}
        </button>
      </div>

      {/* Lista de días y ganancias */}
      <ul className="dayList">
        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
          <li key={day} className="dayItem">
            <span className="dayName">{`${day} de ${getMonthName(month)}`}</span>
            <div className="dayDetails">
              <span>${dailySales.get(day)?.toFixed(2) || '0.00'}</span>
              <Link to={`/dueno/detalles-ventas/${year}/${month}/${day}`} className="detailsButton">
                Detalles
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <div className="total">Total del Mes: ${totalMonthlySales.toFixed(2)}</div>
    </div>
  );
};

export default DailySalesCalendar;