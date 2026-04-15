import { Router } from "express";
//DEFINIMOS RUTAS 
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
//IMPORTAMOS FUNCIONES DEL CONTROLLER PARA RESPONDER EN CADA RUTRA 

const router = Router();

router.get("/products", getProducts); 
router.get("/products/:id", getProduct);
router.post("/products", createProduct); 
router.put("/products/:id", updateProduct); 
router.delete("/products/:id", deleteProduct); 

//EXPORTAMOS Y LO USAMOS EN TEST.JS 
export default router;