import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Componentes del Dueño
import OwnerDashboard from './pages/owner/OwnerDashboard';
import DishListPage from './pages/owner/dish/DishListPage';
import WorkersPage from './pages/owner/worker/WorkersPage';
import SalesPage from './pages/owner/sales/SalesPage';
import DailySalesPage from './pages/owner/sales/DailySalesPage';
import DailySalesDetailsPage from './pages/owner/sales/DailySalesDetailsPage';
import ProfilePage from './pages/owner/ProfilePage';
import AddDishPage from './pages/owner/dish/AddDishPage';
import AddWorkerPage from './pages/owner/worker/AddWorkerPage';
import UpdateWorkerPage from './pages/owner/worker/UpdateWorkerPage';
import UpdateDishPage from './pages/owner/dish/UpdateDishPage';

// Componentes de los Trabajadores
import WorkerLobby from './pages/worker/WorkerLobby';
import KitchenPage from './pages/worker/kitchen/KitchenPage';
import BarPage from './pages/worker/bar/BarPage';
import WaiterPage from './pages/worker/waiter/WaiterPage';
import AddOrderWaiterPage from './pages/worker/waiter/AddOrderWaiterPage';
import AddOrderBarPage from './pages/worker/bar/AddOrderBarPage';
import TablesPage from './pages/worker/global/TablesPage';
import EditOrderPage from './pages/worker/global/EditOrderPage';
import DishDetailsPage from './pages/worker/waiter/DishDetailsPage';


// Página de inicio
import HomePage from './pages/HomePage';
import BarDishPage from './pages/worker/bar/BarDishPage';
import BebidaBoardPage from './pages/worker/bar/BebidaBoardPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Página inicial */}
        <Route path="/" element={<HomePage />} />

        {/* Rutas del Dueño */}
        <Route path="/dueno" element={<OwnerDashboard />} />
        <Route path="/dueno/carta" element={<DishListPage />} />
        <Route path="/dueno/carta/nuevo" element={<AddDishPage />} />
        <Route path="/dueno/carta/editar/:id" element={<UpdateDishPage />} />
        <Route path="/dueno/trabajadores" element={<WorkersPage />} />
        <Route path="/dueno/trabajadores/nuevo" element={<AddWorkerPage />} />
        <Route path="/dueno/trabajadores/editar/:id" element={<UpdateWorkerPage />} />
        <Route path="/dueno/ventas" element={<SalesPage />} />
        <Route path="/dueno/ventas/detalles/:year/:month" element={<DailySalesPage />} />
        <Route path="/dueno/detalles-ventas/:year/:month/:day" element={<DailySalesDetailsPage />} />
        <Route path="/dueno/perfil" element={<ProfilePage />} />

        {/* Rutas de los Trabajadores */}
        <Route path="/trabajadores" element={<WorkerLobby />} />
        <Route path="/trabajadores/cocina" element={<KitchenPage />} />
        <Route path="/trabajadores/barra" element={<BarPage />} />
        <Route path="/trabajadores/barra/tipo/:typeId" element={<BarDishPage />} />
        <Route path="/trabajadores/barra/NuevoPedido" element={<AddOrderBarPage />} />
        <Route path="/trabajadores/barra/EditarPedido" element={<EditOrderPage />} />
        <Route path="/trabajadores/barra/mesas" element={<TablesPage />} />
        <Route path="/trabajadores/barra/plato/:id" element={<DishDetailsPage />} />
        <Route path="/trabajadores/barra/bebidas" element={<BebidaBoardPage />} />
        <Route path="/trabajadores/comandero" element={<WaiterPage />} />
        <Route path="/trabajadores/comandero/NuevoPedido" element={<AddOrderWaiterPage />} />
        <Route path="/trabajadores/comandero/EditarPedido" element={<EditOrderPage />} />
        <Route path="/trabajadores/comandero/mesas" element={<TablesPage />} />
        <Route path="/trabajadores/comandero/plato/:id" element={<DishDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App;