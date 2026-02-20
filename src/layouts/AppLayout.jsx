import { Outlet, useNavigate} from "react-router-dom";
import { Navbar } from "../components/Navbar";
import "../styles/layout.css";

export function AppLayout() {
  const navigate = useNavigate();
  const handleLogout = () => {
     navigate("/", { replace: true });
  };

  return (
    <div className="layout-wrapper">
      <Navbar />
      <aside className="sidebar-left">
        <nav className="sidebar-nav">
          <a href="/dashboard" className="sidebar-link">
            <span>📊</span>
            <span>Dashboard</span>
          </a>
          <a href="/productos" className="sidebar-link">
            <span>📦</span>
            <span>Productos</span>
          </a>
          <a href="/inventarios" className="sidebar-link">
            <span>📋</span>
            <span>Inventario</span>
          </a>
          <a href="/pedidos" className="sidebar-link">
            <span>🛒</span>
            <span>Pedidos</span>
          </a>
          <a href="/ventas" className="sidebar-link">
            <span>💰</span>
            <span>Ventas</span>
          </a>
          <a href="/proveedores" className="sidebar-link">
            <span>🏢</span>
            <span>Proveedores</span>
          </a>
          <a href="/usuarios" className="sidebar-link">
            <span>👥</span>
            <span>Usuarios</span>
          </a>
        </nav>
        <button className="sidebar-logout" onClick={handleLogout}  >Cerrar Sesion </button>
      </aside>
      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}
