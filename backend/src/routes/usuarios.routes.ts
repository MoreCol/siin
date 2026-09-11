import { Router } from 'express';
import { authorizeRoles } from '../middlewares/autorizacion'; 
import { TokenValidation } from '../middlewares/isAuthenticated';

import {
  getUsuarios,
  getUsuario,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios
} from '../controllers/usuarios.controllers';

const router = Router()

router.use(TokenValidation);

router.get('/usuarios', authorizeRoles(1), getUsuarios);
router.get('/usuarios/:id', authorizeRoles(1), getUsuario);
router.post('/usuarios', authorizeRoles(1), createUsuarios);
router.put('/usuarios/:id', authorizeRoles(1), updateUsuarios);
router.delete('/usuarios/:id', authorizeRoles(1), deleteUsuarios);

export default router