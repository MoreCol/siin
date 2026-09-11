// backend/src/routes/venta.routes.ts
import { Router } from 'express';
import { TokenValidation } from '../middlewares/isAuthenticated';
import { authorizeRoles } from '../middlewares/autorizacion';
import { getVentas, getVenta, createVenta, updateVenta, deleteVenta } from '../controllers/venta.controller';

const router = Router();
router.use(TokenValidation);

router.get('/ventas', authorizeRoles(1, 2,3), getVentas);
router.get('/ventas/:id', authorizeRoles(1, 2), getVenta);
router.post('/ventas', authorizeRoles(1, 2), createVenta);
router.put('/ventas/:id', authorizeRoles(1, 2), updateVenta);

router.delete('/ventas/:id', authorizeRoles(1,2), deleteVenta);

export default router;