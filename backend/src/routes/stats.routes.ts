import { Router } from 'express';
import { TokenValidation } from '../middlewares/isAuthenticated';
import { authorizeRoles } from '../middlewares/autorizacion';
import { getResumen } from '../controllers/stats.controller';

const router = Router();
router.use(TokenValidation);

router.get('/stats', authorizeRoles(1), getResumen);

export default router;