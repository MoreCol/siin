import { Outlet, useNavigate } from 'react-router-dom';

import '../styles/layout.css';

import '../styles/navbar.css';
import {
  MdDashboard,
  MdInventory2,
  MdShoppingCart,
  MdSell,
  MdPeople,
  MdPerson,
  MdLocalShipping,
  MdExitToApp
} from 'react-icons/md';

export function AppLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="layout-wrapper">
      {' '}
      <>
        <header className="navbar-top">
          <div className="navbar-left">
            <span className="navbar-logo"></span>
            <span className="navbar-app-name">Miscelanea </span>
            <span className="navbar-app-name"> Moreno</span>
          </div>

          <div className="navbar-center">
            <input className="navbar-search" type="text" placeholder="Buscar productos, proveedores..." />
          </div>
          <div className="navbar-right">
            <button className="user-btn">
              <MdPerson className="nav-icon" />
              <span>Juan S.</span> ▼
            </button>
          </div>
        </header>
      </>
      <aside className="sidebar-left">
        <nav className="sidebar-nav">
          <a href="/dashboard" className="sidebar-link">
            <MdDashboard />
            <span>Dashboard</span>
          </a>

          <a href="/productos" className="sidebar-link">
            <MdShoppingCart />
            <span>Productos</span>
          </a>

          <a href="/inventarios" className="sidebar-link">
            <MdInventory2 />

            <span>Inventario</span>
          </a>

          <a href="/pedidos" className="sidebar-link">
            <span>🛒</span>
            <span>Pedidos</span>
          </a>

          <a href="/ventas" className="sidebar-link">
            <MdSell />
            <span>Ventas</span>
          </a>

          <a href="/proveedores" className="sidebar-link">
            <MdLocalShipping />
            <span>Proveedores</span>
          </a>

          <a href="/usuarios" className="sidebar-link">
            <MdPeople />
            <span>Usuarios</span>
          </a>
        </nav>

        <button className="sidebar-logout" onClick={handleLogout}>
          <MdExitToApp />
          <span>Cerrar Sesion</span>
        </button>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
