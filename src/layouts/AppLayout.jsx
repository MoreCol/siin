import { Outlet, useNavigate, Link } from 'react-router-dom';

import '../styles/layout.css';

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
          <button className="user-btn" type="button">
            <MdPerson className="nav-icon" />
            <span>Juan S.</span> ▼
          </button>
        </div>
      </header>

      <div className="layout-body">
        <aside className="sidebar-left">
          <nav className="sidebar-nav">
            <Link to="/dashboard" className="sidebar-link">
              <MdDashboard />
              <span>Dashboard</span>
            </Link>

            <Link to="/productos" className="sidebar-link">
              <MdShoppingCart />
              <span>Productos</span>
            </Link>

            <Link to="/inventarios" className="sidebar-link">
              <MdInventory2 />
              <span>Inventario</span>
            </Link>

            <Link to="/pedidos" className="sidebar-link">
              <span>🛒</span>
              <span>Pedidos</span>
            </Link>

            <Link to="/ventas" className="sidebar-link">
              <MdSell />
              <span>Ventas</span>
            </Link>

            <Link to="/proveedores" className="sidebar-link">
              <MdLocalShipping />
              <span>Proveedores</span>
            </Link>

            <Link to="/usuarios" className="sidebar-link">
              <MdPeople />
              <span>Usuarios</span>
            </Link>
          </nav>

          <button className="sidebar-logout" onClick={handleLogout} type="button">
            <MdExitToApp />
            <span>Cerrar Sesion</span>
          </button>
        </aside>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
