import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import DailySalesDetails from '../../../components/owner/sales/DailySalesDetails';

const DailySalesDetailsPage: React.FC = () => {
  return (
    <div>
      <Header title="Detalles de Ventas Diarias" />
      <div style={{ padding: '20px' }}>
        <DailySalesDetails />
      </div>
      <Footer />
    </div>
  );
};

export default DailySalesDetailsPage;