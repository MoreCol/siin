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

router.get("/products", getProducts); // OBTIENE * LOS PRODUCTOS
router.get("/products/:id", getProduct);// OBTIENE UN PRODUCTO POR ID 
router.post("/products", createProduct); // CREA PRODUCTOS 
router.put("/products/:id", updateProduct); // ACTUALIZA UN PRODUCTO CON ID
router.delete("/products/:id", deleteProduct);// ELIMAR UN PRODUCTO CON ID 

//EXPORTAMOS Y LO USAMOS EN TEST.JS 
export default router;