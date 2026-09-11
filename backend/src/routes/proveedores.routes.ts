import { Router } from 'express';
import { TokenValidation } from '../middlewares/isAuthenticated';
import { authorizeRoles } from '../middlewares/autorizacion';
import {
  getProveedores,
  getProveedor,
  createProveedor,
  updateProveedor,
  deleteProveedor
} from '../controllers/proveedores.controllers';

const router = Router();

router.use(TokenValidation);
router.get('/proveedores', authorizeRoles(1,3), getProveedores);
router.get('/proveedores/:id', authorizeRoles(1,3), getProveedor);
router.post('/proveedores', authorizeRoles(1,3), createProveedor);
router.put('/proveedores/:id', authorizeRoles(1,3), updateProveedor);
router.delete('/proveedores/:id', authorizeRoles(1,3), deleteProveedor);

//EXPORTAMOS Y LO USAMOS EN TEST.JS
export default router;
