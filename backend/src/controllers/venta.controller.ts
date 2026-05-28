import { Request, Response } from 'express';
import { VentaService } from '../service/venta.service';

const service = new VentaService();

// =========================
// OBTENER TODAS LAS VENTAS
// =========================
export const getVentas = async (_: Request, res: Response) => {
  res.json(await service.findAll());
};

// =========================
// OBTENER UNA VENTA
// =========================
export const getVenta = async (req: Request, res: Response) => {
  const venta = await service.findOne(Number(req.params.id));

  if (!venta) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json(venta);
};

// =========================
// CREAR VENTA
// =========================
export const createVenta = async (req: Request, res: Response) => {
  try {
    console.log('insertData', req.body);

    const venta = await service.create(req.body);

    res.status(201).json(venta);
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

// =========================
// ACTUALIZAR VENTA
// =========================
export const updateVenta = async (req: Request, res: Response) => {
  const venta = await service.update(Number(req.params.id), req.body);

  if (!venta) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json(venta);
};

// =========================
// ELIMINAR VENTA
// =========================
export const deleteVenta = async (req: Request, res: Response) => {
  const result = await service.delete(Number(req.params.id));

  if (result.affected === 0) {
    return res.status(404).json({ message: 'Not found' });
  }

  res.json({
    message: 'Deleted'
  });
};

export {};
