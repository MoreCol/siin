import { Request, Response } from 'express';
import {PedidoService} from "../service/pedidos.service"

const service = new PedidoService()

export const getPedidos = async (_: Request, res: Response) => {
  res.json(await service.findAll());
};

export const getPedido = async (req: Request, res: Response) => {
  const pedido = await service.findOne(Number(req.params.id)); //CONVERTIRMO URL A NUMBER
  if (!pedido) return res.status(404).json({ message: "Not found" });
  res.json(pedido);
};


export const createPedido = async (req: Request, res: Response) => {
  const pedido = await service.create(req.body); //CREACION DEL pedidoO EN BS 
  res.json(pedido); 
};


export const updatePedido = async (req: Request, res: Response) => {
  const pedido = await service.update(Number(req.params.id), req.body);
  if (!pedido) return res.status(404).json({ message: "Not found" });
  res.json(pedido);
};


export const deletePedido = async (req: Request, res: Response) => {
  const result = await service.delete(Number(req.params.id));
  if (result.affected === 0) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
};

export {}