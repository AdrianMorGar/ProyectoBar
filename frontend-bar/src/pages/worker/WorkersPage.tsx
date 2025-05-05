import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WorkerList from '../../components/worker/WorkerList';

const WorkersPage: React.FC = () => {
  return (
    <div>
      <Header title="Gestión de Trabajadores" />
      <div style={{ padding: '20px' }}>
        < WorkerList/>
      </div>
      <Footer />
    </div>
  );
};

export default WorkersPage;