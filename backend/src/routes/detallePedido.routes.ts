import { Router } from 'express';

import {
  getDetalles,
  getDetalle,
  createDetalle,
  updateDetalle,
  deleteDetalle
} from '../controllers/detalllePedido.controllers';

const router = Router();

router.get('/detalles', getDetalles);
router.get('/detalles/:id', getDetalle);
router.post('/detalles', createDetalle);
router.put('/detalles/:id', updateDetalle);
router.delete('/detalles/:id', deleteDetalle);

export default router;
