import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import UpdateWorkerForm from '../../../components/owner/worker/UpdateWorkerForm';
import { useParams } from 'react-router-dom';

const UpdateWorkerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const workerId = parseInt(id || '0');

  return (
    <div>
      <Header title="Actualizar Trabajador" />
      <div style={{ padding: '20px' }}>
        <UpdateWorkerForm workerId={workerId} />
      </div>
      <Footer />
    </div>
  );
};

export default UpdateWorkerPage;