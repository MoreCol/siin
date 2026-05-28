import { Router } from 'express';

// DEFINIMOS RUTAS
import {
  getVentas,
  getVenta,
  createVenta,
  updateVenta,
  deleteVenta
} from '../controllers/venta.controller';

// IMPORTAMOS FUNCIONES DEL CONTROLLER
// PARA RESPONDER EN CADA RUTA

const router = Router();

router.get('/ventas', getVentas);

router.get('/ventas/:id', getVenta);

router.post('/ventas', createVenta);

router.put('/ventas/:id', updateVenta);

router.delete('/ventas/:id', deleteVenta);

// EXPORTAMOS Y LO USAMOS EN app.ts o server.ts
export default router;