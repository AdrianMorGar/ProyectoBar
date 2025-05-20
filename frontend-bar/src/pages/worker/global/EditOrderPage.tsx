import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import EditOrder from '../../../components/worker/globlal/EditOrder';
import PrintOrderPDF from '../../../components/worker/bar/PrintOrderPDF';

const EditOrderPage: React.FC = () => {
  return (
    <div>
      <Header title="Tablón de Comandas - Cocina" />
      <div style={{ padding: '20px' }}>
        <EditOrder />
        <PrintOrderPDF />
      </div>
      <Footer />
    </div>
  );
};

export default EditOrderPage;