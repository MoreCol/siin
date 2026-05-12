import { Request, Response } from 'express';
import { DetallePedidosService } from '../service/detallePedido.service';

const service = new DetallePedidosService();

export const getDetalles = async (_: Request, res: Response) => {
  res.json(await service.findAll());
};

export const getDetalle = async (req: Request, res: Response) => {
  const detalle = await service.findOne(Number(req.params.id));
  if (!detalle) return res.status(404).json({ message: 'Not found' });
  res.json(detalle);
};

export const createDetalle = async (req: Request, res: Response) => {
  try {
    const detalle = await service.create(req.body);
    res.status(201).json(detalle);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateDetalle = async (req: Request, res: Response) => {
  const detalle = await service.update(Number(req.params.id), req.body);
  if (!detalle) return res.status(404).json({ message: 'Not found' });
  res.json(detalle);
};

export const deleteDetalle = async (req: Request, res: Response) => {
  const result = await service.delete(Number(req.params.id));
  if (result.affected === 0) return res.status(404).json({ message: 'Not found' });
  return res.status(204).send();
};