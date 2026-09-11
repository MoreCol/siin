import { Router } from 'express';
import { TokenValidation } from '../middlewares/isAuthenticated';
import { authorizeRoles } from '../middlewares/autorizacion';

import { getInventarios, getInvent, createInvent, updateInvent, deleteInvent } from '../controllers/invent.controllers';

const router = Router();
router.use(TokenValidation);
router.get('/inventario', authorizeRoles(1, 3, 2), getInventarios);
router.get('/inventario/:id', authorizeRoles(1, 3, 2), getInvent);
router.post('/inventario', authorizeRoles(1, 3), createInvent);
router.put('/inventario/:id', authorizeRoles(1, 3), updateInvent);
router.delete('/inventario/:id', authorizeRoles(1, 3), deleteInvent);

export default router;
