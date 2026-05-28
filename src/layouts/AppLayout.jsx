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
  MdExitToApp,
  MdConfirmationNumber
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
    <div className="flex flex-col min-h-screen bg-slate-50 ">
      <header className=" !p-6 items-center justify-between  border-b border-slate-200  flex  w-full h-14  fixed  p-6  bg-linear-to-r bg-white ">
        <div className="flex flex-col">
          <label className=" text-slate-900 font-medium text-2xl ">Miscelanea Moreno</label>
          <label className="text-[14px]  text-slate-400">Sistema de Inventario</label>
        </div>

        <div className="flex items-center gap-2">
          <div>
            <div
              className="w-11 h-11  rounded-full bg-slate-900
            flex items-center justify-center text-white text-[12px]"
            >
              {user ? `${user.nombre[0]}${user.apellido[0]}` : 'US'}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1  ">
        <aside className="  fixed
      top-14
      left-0
      w-full
      h-[72px]
      bg-white
      border-b
      border-slate-300
      z-40
      flex
      items-center
      justify-between
      px-4 ">
          <nav className="  flex
        items-center
        gap-1
        overflow-x-auto
        whitespace-nowrap ">
            <Link to="/dashboard" className="sidebar-link">
              <MdDashboard />
              <label>Dashboard</label>
            </Link>

            <Link to="/productos" className="sidebar-link">
              <MdShoppingCart />
              <label>Productos</label>
            </Link>

            <Link to="/inventarios" className="sidebar-link">
              <MdInventory2 />
              <label>Inventario</label>
            </Link>

            <Link to="/pedidos" className="sidebar-link">
              <MdConfirmationNumber />
              <label>Pedidos</label>
            </Link>

            <Link to="/ventas" className="sidebar-link">
              <MdSell />
              <label>Ventas</label>
            </Link>

            <Link to="/proveedores" className="sidebar-link">
              <MdLocalShipping />
              <label>Proveedores</label>
            </Link>

            <Link to="/usuarios" className="sidebar-link">
              <MdPeople />
              <label>Usuarios</label>
            </Link>
          </nav>

          <button
            onClick={handleLogout}
            type="button"
            className="flex
        items-center
        gap-2
        !px-4
        !py-3
        text-slate-400
        font-medium
        rounded-xl
        hover:text-red-500
        hover:bg-red-50
        transition-colors
        duration-150
        shrink-0"
          >
            <MdExitToApp />
            <label>Salir</label>
          </button>
        </aside>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
