import { Router } from 'express';
import { AuthController } from '../controllers/auth.controllers';
import { TokenValidation } from '../middlewares/isAuthenticated';

const router = Router();
const controller = new AuthController();

router.post('/register', controller.register);
router.post('/login', controller.login);

router.get('/perfil', TokenValidation, (req, res) => {
  res.json({ message: 'acceso permitido' });
});

export default router;