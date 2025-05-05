import Header from '../../components/Header';
import Footer from '../../components/Footer';
import DailySalesCalendar from '../../components/sales/DailySalesCalendar';

const SalesPage: React.FC = () => {

  return (
    <div>
      <Header title="Resumen de Ventas en el mes" />
      <div style={{ padding: '20px' }}>
        <DailySalesCalendar />
      </div>
      <Footer />
    </div>
  );
};

export default SalesPage;