import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AddDishForm from '../../../components/owner/dish/AddDishForm';

const AddDishPage: React.FC = () => {
  return (
    <div>
      <Header title="Añadir Plato" />
      <div style={{ padding: '20px' }}>
        <AddDishForm />
      </div>
      <Footer />
    </div>
  );
};

export default AddDishPage;