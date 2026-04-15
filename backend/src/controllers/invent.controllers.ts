import { Request, Response } from 'express';
import { InventService } from '../service/inventario.service'; 


const service = new InventService();

export const getInventarios = async (_: Request, res: Response) => {
  res.json(await service.findAll());
};

export const getInvent = async (req: Request, res: Response) => {
  
  const invent = await service.findOne(Number(req.params.id));
  if (!invent) return res.status(404).json({ message: 'Not found' });
  res.json(invent);
};


export const createInvent = async (req: Request, res: Response) => {
  console.log('insertDta', req.body);

  try {
    const invent = await service.create(req.body);
     res.status(201).json(invent);
   
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const updateInvent = async (req: Request, res: Response) => {
  const invent = await service.update(Number(req.params.id), req.body);
  if (!invent) return res.status(404).json({ message: 'Not found' });
  res.json(invent);
};


export const deleteInvent = async (req: Request, res: Response) => {
  const result = await service.delete(Number(req.params.id));
  if (result.affected === 0) return res.status(404).json({ message: 'Not found' });
 else  res.status(204);
};

export {};
