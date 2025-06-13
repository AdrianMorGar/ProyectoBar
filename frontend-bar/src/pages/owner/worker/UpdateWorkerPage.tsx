import React from 'react';
import UpdateWorkerForm from '../../../components/owner/worker/UpdateWorkerForm';
import { useParams } from 'react-router-dom';

const UpdateWorkerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const workerId = parseInt(id || '0');

  return (
    <UpdateWorkerForm workerId={workerId} />
  );
};

export default UpdateWorkerPage;