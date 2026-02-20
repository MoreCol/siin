import { Link, useNavigate } from "react-router-dom"; // ✅ CORRECTO (NO useState)
import "../styles/navbar.css"; // ✅ CSS


export function Navbar() {
const navigate = useNavigate();

  const handleLogout = ()=>{
    localStorage.removeItem("token");
        setTimeout(() => { navigate("/");},500 );




  }
  return (
    <>
    <header className="navbar-top">
      <div className="navbar-left">
        <span className="navbar-logo">🦎</span>
          <span className="navbar-app-name">Miselanea </span>
        <span className="navbar-app-name"> Moreno</span>
      </div>

      <div className="navbar-center">
        <input
          className="navbar-search"
          type="text"
          placeholder="Buscar productos, proveedores..."
        />
      </div>
      <div className="navbar-right">
        <button className="user-btn" >
          👤 <span>Juan S.</span> ▼
        </button>
         </div>
      
</header>
      <aside className="sidebar-left">
      <nav className="sidebar-nav">
        <Link to="/dashboard" className="sidebar-link">📊<span>Panel de Control</span></Link>
        <Link to="/productos" className="sidebar-link">📦<span>Productos</span></Link>
        <Link to="/inventarios" className="sidebar-link">📋<span>Inventario</span></Link>
          <Link to="/pedidos" className="sidebar-link">📑 <span>Pedidos</span></Link>
        <Link to="/ventas" className="sidebar-link">💰<span>Ventas</span></Link>
                <Link to="/proveedores" className="sidebar-link">🏪<span>Proveedores</span></Link>

          <Link to="/usuarios" className="sidebar-link">👥<span>Usuarios</span></Link>

      </nav>
              <button onClick={handleLogout} className="sidebar-logout"> Cerrar Sesion </button>

</aside> 
</>
);
}

