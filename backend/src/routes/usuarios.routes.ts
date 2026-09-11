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
router.use(authorizeRoles(1));

router.get('/usuarios',  getUsuarios)
router.get('/usuarios/:id', getUsuario)
router.post('/usuarios', createUsuarios)
router.put('/usuarios/:id', updateUsuarios)
router.delete('/usuarios/:id', deleteUsuarios)

export default router