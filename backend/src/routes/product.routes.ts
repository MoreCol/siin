import { Router } from 'express';
import { authorizeRoles } from '../middlewares/autorizacion';
import { TokenValidation } from '../middlewares/isAuthenticated';

import {
  getAllProducts,
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/product.controller';

const router = Router();

router.use(TokenValidation);

router.get('/products/all', authorizeRoles(1,3,2), getAllProducts);
router.get('/products', authorizeRoles(1,3,2), getProducts);
router.get('/products/:id', authorizeRoles(1,3,2), getProduct);

router.post('/products', authorizeRoles(1,3), createProduct);
router.put('/products/:id', authorizeRoles(1,3), updateProduct);
router.delete('/products/:id', authorizeRoles(1,3), deleteProduct);

export default router;
