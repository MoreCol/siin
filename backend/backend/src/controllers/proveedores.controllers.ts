import { Request, Response } from "express";

import {ProveedorService} from "../service/proveedores.service";





const service = new ProveedorService();


export const getProveedores = async (_: Request, res: Response) => {
  res.json(await service.findAll());}

export const getProveedor = async (req: Request, res: Response) => {
  const proveedor = await service.findOne(Number(req.params.id)); 
  if (!proveedor) return res.status(404).json({ message: "Not found" });
  res.json(proveedor);
};


export const createProveedor = async (req: Request, res: Response) => {
  const proveedor = await service.create(req.body); 
  res.json(proveedor); 
};


export const updateProveedor = async (req: Request, res: Response) => {
  const proveedor = await service.update(Number(req.params.id), req.body);
  if (!proveedor) return res.status(404).json({ message: "Not found" });
  res.json(proveedor);
};


export const deleteProveedor = async (req: Request, res: Response) => {
  const result = await service.delete(Number(req.params.id));
  if (result.affected === 0) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};

export {}
