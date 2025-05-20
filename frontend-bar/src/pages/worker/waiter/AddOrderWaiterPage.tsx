import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AddOrder from '../../../components/worker/waiter/AddOrderWaiter';

const AddOrderWaiterPage: React.FC = () => {
  return (
    <div>
      <Header title="Lista de Pedidos" />
      <div style={{ padding: '20px' }}>
        <AddOrder />
      </div>
      <Footer />
    </div>
  );
};

export default AddOrderWaiterPage;