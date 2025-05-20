import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import DishList from '../../../components/worker/waiter/DishList';

const WaiterPage: React.FC = () => {
  return (
    <div>
      <Header title="Comandero - Gestión de Pedidos" />
      <div style={{ padding: '20px' }}>
        <DishList />
      </div>
      <Footer />
    </div>
  );
};

export default WaiterPage;