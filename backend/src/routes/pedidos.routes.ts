import { Router } from 'express';
import { TokenValidation } from '../middlewares/isAuthenticated';
import { authorizeRoles } from '../middlewares/autorizacion';
//DEFINIMOS RUTAS
import { getPedidos, getPedido, createPedido, updatePedido, deletePedido } from '../controllers/pedidos.controllers';
//IMPORTAMOS FUNCIONES DEL CONTROLLER PARA RESPONDER EN CADA RUTRA

const router = Router();
router.use(TokenValidation);

router.get('/pedidos', authorizeRoles(1, 3, 2), getPedidos);
router.get('/pedidos/:id', authorizeRoles(1, 3, 2), getPedido);
router.post('/pedidos', authorizeRoles(1, 3 ), createPedido);
router.put('/pedidos/:id', authorizeRoles(1, 3), updatePedido);
router.delete('/pedidos/:id', authorizeRoles( 1,3), deletePedido);

//EXPORTAMOS Y LO USAMOS EN TEST.JS
export default router;
