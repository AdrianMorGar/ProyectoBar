import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import Bar from '../../../components/worker/bar/Bar';


const BarPage: React.FC = () => {
  return (
    <div>
      <Header title="Detalles del Plato" />
      <div style={{ padding: '20px' }}>
        <Bar />
      </div>
      <Footer />
    </div>
  );
};

export default BarPage;