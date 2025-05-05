import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import AddWorkerForm from '../../components/worker/AddWorkerForm';

const AddWorkerPage: React.FC = () => {
  return (
    <div>
      <Header title="Añadir Trabajador" />
      <div style={{ padding: '20px' }}>
        <AddWorkerForm />
      </div>
      <Footer />
    </div>
  );
};

export default AddWorkerPage;