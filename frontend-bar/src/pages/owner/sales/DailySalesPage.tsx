import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import DailySalesCalendar from '../../../components/owner/sales/DailySalesCalendar';

const DailySalesPage: React.FC = () => {

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

export default DailySalesPage;