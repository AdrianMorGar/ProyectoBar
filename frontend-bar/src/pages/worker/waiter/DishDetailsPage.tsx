import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import DishDetails from '../../../components/worker/globlal/DishDetails';

const DishDetailsPage: React.FC = () => {
  return (
    <div>
      <Header title="Detalles del Plato" />
      <div style={{ padding: '20px' }}>
        <DishDetails />
      </div>
      <Footer />
    </div>
  );
};

export default DishDetailsPage;