import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BarDish from '../../../components/worker/bar/BarDish';


const BarDishPage: React.FC = () => {
  return (
    <div>
      <Header title="Detalles del Plato" />
      <div style={{ padding: '20px' }}>
        <BarDish />
      </div>
      <Footer />
    </div>
  );
};

export default BarDishPage;

