import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import KitchenBoard from '../../../components/worker/kitchen/KitchenBoard';

const KitchenPage: React.FC = () => {
  return (
    <div>
      <Header title="Tablón de Comandas - Cocina" />
      <div style={{ padding: '20px' }}>
        <KitchenBoard />
      </div>
      <Footer />
    </div>
  );
};

export default KitchenPage;