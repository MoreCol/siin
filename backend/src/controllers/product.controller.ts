import { Request, Response } from "express";
//tipamos los tipos de express
import { ProductService } from "../service/product.service";

//logica de negocio 


const service = new ProductService();

//OBTENER TODOS LOS PRODUCTOS OMITO EL REQ '_'
export const getProducts = async (_: Request, res: Response) => {
  res.json(await service.findAll());
};
//OBTENER UN SOLO PRODUCTOS ID 
export const getProduct = async (req: Request, res: Response) => {
  const product = await service.findOne(Number(req.params.id)); //CONVERTIRMO URL A NUMBER
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

//CREAR PRODUCTO 
export const createProduct = async (req: Request, res: Response) => {
  const product = await service.create(req.body); //CREACION DEL PRODUCTO EN BS 
  res.json(product); 
};

//ACTUALIZAR PRODUCTO 
export const updateProduct = async (req: Request, res: Response) => {
  const product = await service.update(Number(req.params.id), req.body);
  if (!product) return res.status(404).json({ message: "Not found" });
  res.json(product);
};

//ELIMINAR EL PRODUCTO 
export const deleteProduct = async (req: Request, res: Response) => {
  const result = await service.delete(Number(req.params.id));
  if (result.affected === 0) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};

export {}

//RECIBE PETICION- LLAMA AL SERVICIO Y RESPONDE 