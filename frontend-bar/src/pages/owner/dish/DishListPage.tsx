import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import DishList from '../../../components/owner/dish/DishList';

const DishListPage: React.FC = () => {
  return (
    <div>
      <Header title="Gestión de la Carta" />
      <div style={{ padding: '20px' }}>
        <DishList />
      </div>
      <Footer />
    </div>
  );
};

export default DishListPage;