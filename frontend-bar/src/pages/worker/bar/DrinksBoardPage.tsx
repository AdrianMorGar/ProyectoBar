import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import DrinksBoard from '../../../components/worker/bar/DrinksBoard';


const DrinksBoardPage: React.FC = () => {
  return (
    <div>
      <Header title="Tablón de Bebidas" />
      <div style={{ padding: '20px' }}>
        <DrinksBoard />
      </div>
      <Footer />
    </div>
  );
};

export default DrinksBoardPage;