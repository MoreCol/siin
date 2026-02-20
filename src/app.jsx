import { BrowserRouter, Routes, Route } from "react-router-dom";
import Productos from "./pages/productos";
import Pedidos from "./pages/pedidos";
import Ventas from "./pages/ventas";
import Usuarios from "./pages/usuarios";
import Proveedores from "./pages/Proveedores";
import Inventario from "./pages/inventario";
import Dashboard from "./pages/dashboard";
import { Login } from "./pages/Login";
import { AppLayout } from "./layouts/AppLayout";
import "./styles/shared.css";
import "./styles/navbar.css";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/inventarios" element={<Inventario />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/proveedores" element={<Proveedores />} />
          <Route path="/usuarios" element={<Usuarios />} />

          
        </Route>

        <Route />
      </Routes>
    </BrowserRouter>
  );
}
