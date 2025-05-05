import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SalesCalendar from '../../components/sales/SalesCalendar';

const SalesPage: React.FC = () => {

  return (
    <div>
      <Header title="Resumen de Ventas" />
      <div style={{ padding: '20px' }}>
        <SalesCalendar />
      </div>
      <Footer />
    </div>
  );
};

export default SalesPage;