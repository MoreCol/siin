import { Navigate, Outlet } from 'react-router-dom'; //dirigimos a otra ruta 

export function ProteccionRutas() { //protegemos la ruta privada 
  const token = localStorage.getItem('token'); //busca el token
  return token ? <Outlet /> : <Navigate to="/" replace />; 
  //si hay token entra a rutas proytegidas sino redirige al login 
}