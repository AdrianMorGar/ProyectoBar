import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import UpdateDishForm from '../../../components/owner/dish/UpdateDishForm';
import { useParams } from 'react-router-dom';

const UpdateDishPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dishId = parseInt(id || '0');

  return (
    <div>
      <Header title="Actualizar Plato" />
      <div style={{ padding: '20px' }}>
        <UpdateDishForm dishId={dishId} />
      </div>
      <Footer />
    </div>
  );
};

export default UpdateDishPage;