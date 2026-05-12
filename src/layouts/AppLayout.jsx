import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // borra la sesion
    localStorage.removeItem('user'); //borra la información del usuario
    navigate('/', { replace: true }); // lleva al login
  };

  return (
    <div className="layout-wrapper">
      <header className="navbar-top">
        <div className="navbar-left">
          <span className="navbar-app-name">Miscelanea </span>
          <span className="navbar-app-name"> Moreno</span>
        </div>

        <div className="navbar-center">
          
        </div>

        <div className="navbar-right">
          <button className="user-btn" type="button">
            <MdPerson className="nav-icon" />
         <span>
          {user ? `${user.nombre} ${user.apellido}` : 'Usuario'}
        </span>
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
