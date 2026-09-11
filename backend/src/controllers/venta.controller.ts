// backend/src/controllers/venta.controller.ts
import { Request, Response } from 'express';
import { VentaService } from '../service/venta.service';

const service = new VentaService();


export const getVentas = async (_: Request, res: Response) => {
    res.json(await service.findAll());
};


export const getVenta = async (req: Request, res: Response) => {
    const venta = await service.findOne(Number(req.params.id));

    if (!venta) {
        return res.status(404).json({ message: 'Not found' });
    }

    res.json(venta);
};



export const createVenta = async (req: Request, res: Response) => {
    try {
      
        const usuario = (req as any).usuario;

        

        if (!usuario || !usuario.id) {
            return res.status(401).json({
                message: 'Usuario no autenticado correctamente'
            });
        }

       
        const ventaData = {
            ...req.body,
           id_usuario: Number(usuario.id)
        };

        console.log('📦 Datos finales de la venta:', ventaData);

        const venta = await service.create(ventaData);

        res.status(201).json(venta);
    } catch (error: any) {
        console.error('❌ Error en createVenta:', error);
        res.status(400).json({ message: error.message });
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

    res.json({ message: 'Deleted' });
};

export {};