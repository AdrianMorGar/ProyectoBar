import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import ActiveTablesList from '../../../components/worker/globlal/ActiveTablesList';

const TablesPage: React.FC = () => {
  return (
    <div>
      <Header title="Gestión de Mesas" />
      <div style={{ padding: '20px' }}>
        <ActiveTablesList />
      </div>
      <Footer />
    </div>
  );
};

export default TablesPage;