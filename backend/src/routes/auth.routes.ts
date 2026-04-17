import { Router } from 'express';
import { AuhtController } from '../controllers/auth.controllers';
const router = Router()
const controller = new AuhtController
router.post('/register', controller.register)
router.post('/login', controller.login);
export default router;