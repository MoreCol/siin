import { Router } from "express";
//DEFINIMOS RUTAS 
import {
  getPedidos,
  getPedido,
  createPedido,
  updatePedido,
  deletePedido,
} from "../controllers/pedidos.controllers";
//IMPORTAMOS FUNCIONES DEL CONTROLLER PARA RESPONDER EN CADA RUTRA 

const router = Router();

router.get("/pedidos", getPedidos); 
router.get("/pedidos/:id", getPedido);
router.post("/pedidos", createPedido); 
router.put("/pedidos/:id", updatePedido); 
router.delete("/pedidos/:id", deletePedido); 

//EXPORTAMOS Y LO USAMOS EN TEST.JS 
export default router;