import React from 'react';
import UpdateDishForm from '../../../components/owner/dish/UpdateDishForm';
import { useParams } from 'react-router-dom';

const UpdateDishPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dishId = parseInt(id || '0');

  return (
    <UpdateDishForm dishId={dishId} />
  );
};

export default UpdateDishPage;