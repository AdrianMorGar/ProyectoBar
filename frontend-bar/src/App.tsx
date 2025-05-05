import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OwnerDashboard from './pages/OwnerDashboard';
import DishListPage from './pages/dish/DishListPage';
import WorkersPage from './pages/worker/WorkersPage';
import SalesPage from './pages/sales/SalesPage';
import DailySalesPage from './pages/sales/DailySalesPage';
import DailySalesDetailsPage from './pages/sales/DailySalesDetailsPage';
import ProfilePage from './pages/ProfilePage';
import AddDishPage from './pages/dish/AddDishPage';
import AddWorkerPage from './pages/worker/AddWorkerPage';
import UpdateWorkerPage from './pages/worker/UpdateWorkerPage';
import UpdateDishPage from './pages/dish/UpdateDishPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OwnerDashboard />} />
        <Route path="/carta" element={<DishListPage />} />
        <Route path="/carta/nuevo" element={<AddDishPage />} />
        <Route path="/carta/editar/:id" element={<UpdateDishPage />} />
        <Route path="/trabajadores" element={<WorkersPage />} />
        <Route path="/trabajadores/nuevo" element={<AddWorkerPage />} />
        <Route path="/trabajadores/editar/:id" element={<UpdateWorkerPage />} />
        <Route path="/ventas" element={<SalesPage />} />
        <Route path="/ventas/detalles/:year/:month" element={<DailySalesPage />} />
        <Route path="/detalles-ventas/:year/:month/:day" element={<DailySalesDetailsPage />} /> 
        <Route path="/perfil" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;