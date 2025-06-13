import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../../context/LogoutButton';

const OwnerDashboard: React.FC = () => {
  return (
    <div className="header-section center owner-nav">
      <NavLink to="/dueno/carta" className={({ isActive }) => isActive ? "active owner-nav-link" : "owner-nav-link"}>
        Gestionar Carta
      </NavLink>
      <NavLink to="/dueno/trabajadores" className={({ isActive }) => isActive ? "active owner-nav-link" : "owner-nav-link"}>
        Trabajadores
      </NavLink>
      <NavLink to="/dueno/ventas" className={({ isActive }) => isActive ? "active owner-nav-link" : "owner-nav-link"}>
        Ventas
      </NavLink>
      <NavLink to="/dueno/perfil" className={({ isActive }) => isActive ? "active owner-nav-link" : "owner-nav-link"}>
        Mi Perfil
      </NavLink>
      <LogoutButton />
    </div>
  );
};

export default OwnerDashboard;
