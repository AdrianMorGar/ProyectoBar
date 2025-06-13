import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, Outlet, useLocation, NavLink } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import LogoutButton from './context/LogoutButton';

// Componentes del Dueño
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
import BarDishPage from './pages/worker/bar/BarDishPage';
import BebidaBoardPage from './pages/worker/bar/DrinksBoardPage';

// Páginas de Login e Inicio
import LoginPage from './pages/LoginPage';

const AppHeader: React.FC = () => {
  const { user, token } = useAuth();
  const location = useLocation();

  if (location.pathname === '/login') {
    return null;
  }

  const handleGoBack = () => {
    const current = location.pathname;

    if (current.startsWith('/trabajadores/barra/')) {
      window.location.href = '/trabajadores/barra';
    } else if (current.startsWith('/trabajadores/comandero/')) {
      window.location.href = '/trabajadores/comandero';
    } else if (
      current === '/trabajadores/cocina' ||
      current === '/trabajadores/barra' ||
      current === '/trabajadores/comandero'
    ) {
      window.location.href = '/trabajadores';
    } else {
      window.location.href = '/trabajadores';
    }
  };

  return (
    <header className="app-header">
      <div className="app-header-left">
        <Link to="/" className="app-header-title">
          Mi Restaurante
        </Link>
      </div>
      {user?.rol === 'TRABAJADOR' && <button className="boton-volver" onClick={handleGoBack}>Volver</button>}
      {user?.rol === 'DUENO' && (
        <nav className="app-header-owner-nav">
          <NavLink to="/dueno/carta" className={({ isActive }) => `owner-nav-link ${isActive ? 'active' : ''}`}>Gestionar Carta</NavLink>
          <NavLink to="/dueno/trabajadores" className={({ isActive }) => `owner-nav-link ${isActive ? 'active' : ''}`}>Trabajadores</NavLink>
          <NavLink to="/dueno/ventas" className={({ isActive }) => `owner-nav-link ${isActive ? 'active' : ''}`}>Ventas</NavLink>
          <NavLink to="/dueno/perfil" className={({ isActive }) => `owner-nav-link ${isActive ? 'active' : ''}`}>Mi Perfil</NavLink>
        </nav>
      )}
      <nav className="app-header-auth-nav">
        {token && user?.rol === 'DUENO' && (
          <LogoutButton />
        )}
      </nav>
    </header>
  );
};


const AppFooter: React.FC = () => {
  const location = useLocation();
  if (location.pathname === '/login') {
    return null;
  }
  return (
    <footer className="app-footer">
      <p>&copy; 2025 - Bar Application</p>
    </footer>
  );
};

const MainLayout: React.FC = () => {
  return (
    <>
      <AppHeader />
      <main className="main-content">
        <Outlet />
      </main>
      <AppFooter />
    </>
  );
};

const AppRoutes: React.FC = () => {
  const { token, user, isLoading } = useAuth();

  if (isLoading) return <div style={{ textAlign: 'center', marginTop: '50px', fontSize: '1.2rem' }}>Cargando aplicación...</div>;

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            token && user ? (
              user.rol === 'DUENO' ? <Navigate to="/dueno/carta" replace /> : <Navigate to="/trabajadores" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/dueno/carta" element={<ProtectedRoute roles={['DUENO']}><DishListPage /></ProtectedRoute>} />
        <Route path="/dueno/carta/nuevo" element={<ProtectedRoute roles={['DUENO']}><AddDishPage /></ProtectedRoute>} />
        <Route path="/dueno/carta/editar/:id" element={<ProtectedRoute roles={['DUENO']}><UpdateDishPage /></ProtectedRoute>} />
        <Route path="/dueno/trabajadores" element={<ProtectedRoute roles={['DUENO']}><WorkersPage /></ProtectedRoute>} />
        <Route path="/dueno/trabajadores/nuevo" element={<ProtectedRoute roles={['DUENO']}><AddWorkerPage /></ProtectedRoute>} />
        <Route path="/dueno/trabajadores/editar/:id" element={<ProtectedRoute roles={['DUENO']}><UpdateWorkerPage /></ProtectedRoute>} />
        <Route path="/dueno/ventas" element={<ProtectedRoute roles={['DUENO']}><SalesPage /></ProtectedRoute>} />
        <Route path="/dueno/ventas/detalles/:year/:month" element={<ProtectedRoute roles={['DUENO']}><DailySalesPage /></ProtectedRoute>} />
        <Route path="/dueno/detalles-ventas/:year/:month/:day" element={<ProtectedRoute roles={['DUENO']}><DailySalesDetailsPage /></ProtectedRoute>} />
        <Route path="/dueno/perfil" element={<ProtectedRoute roles={['DUENO']}><ProfilePage /></ProtectedRoute>} />

        <Route path="/trabajadores" element={<ProtectedRoute roles={['TRABAJADOR']}><WorkerLobby /></ProtectedRoute>} />
        <Route path="/trabajadores/cocina" element={<ProtectedRoute roles={['TRABAJADOR']}><KitchenPage /></ProtectedRoute>} />
        <Route path="/trabajadores/barra" element={<ProtectedRoute roles={['TRABAJADOR']}><BarPage /></ProtectedRoute>} />
        <Route path="/trabajadores/barra/tipo/:typeId" element={<ProtectedRoute roles={['TRABAJADOR']}><BarDishPage /></ProtectedRoute>} />
        <Route path="/trabajadores/barra/NuevoPedido" element={<ProtectedRoute roles={['TRABAJADOR']}><AddOrderBarPage /></ProtectedRoute>} />
        <Route path="/trabajadores/barra/EditarPedido" element={<ProtectedRoute roles={['TRABAJADOR']}><EditOrderPage /></ProtectedRoute>} />
        <Route path="/trabajadores/barra/mesas" element={<ProtectedRoute roles={['TRABAJADOR']}><TablesPage /></ProtectedRoute>} />
        <Route path="/trabajadores/barra/plato/:id" element={<ProtectedRoute roles={['TRABAJADOR']}><DishDetailsPage /></ProtectedRoute>} />
        <Route path="/trabajadores/barra/bebidas" element={<ProtectedRoute roles={['TRABAJADOR']}><BebidaBoardPage /></ProtectedRoute>} />
        <Route path="/trabajadores/comandero" element={<ProtectedRoute roles={['TRABAJADOR']}><WaiterPage /></ProtectedRoute>} />
        <Route path="/trabajadores/comandero/NuevoPedido" element={<ProtectedRoute roles={['TRABAJADOR']}><AddOrderWaiterPage /></ProtectedRoute>} />
        <Route path="/trabajadores/comandero/EditarPedido" element={<ProtectedRoute roles={['TRABAJADOR']}><EditOrderPage /></ProtectedRoute>} />
        <Route path="/trabajadores/comandero/mesas" element={<ProtectedRoute roles={['TRABAJADOR']}><TablesPage /></ProtectedRoute>} />
        <Route path="/trabajadores/comandero/plato/:id" element={<ProtectedRoute roles={['TRABAJADOR']}><DishDetailsPage /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
};

export default App;

