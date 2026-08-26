import { Router } from 'express';
import {
  getUsuarios,
  getUsuario,
  createUsuarios,
  updateUsuarios,
  deleteUsuarios
} from '../controllers/usuarios.controllers';


const router = Router()

router.get ('/usuarios',getUsuarios)
router.get('/usuarios/:id', getUsuario)
router.post('/usuarios',createUsuarios)
router.put('/usuarios/:id', updateUsuarios)
router.delete('/usuarios/:id', deleteUsuarios)

export default router