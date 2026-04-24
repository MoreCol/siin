import { Request, Response } from 'express';

import { ProductService } from '../service/product.service';

const service = new ProductService();

export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;

  res.json(await service.findAll(page, limit));
};

export const getAllProducts = async (_: Request, res: Response) => {
  const products = await service.totalProductos();
  res.json(products);
}

export const getProduct = async (req: Request, res: Response) => {
  const product = await service.findOne(Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  const product = await service.create(req.body);
  res.json(product);
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await service.update(Number(req.params.id), req.body);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  const result = await service.delete(Number(req.params.id));
  if (result.affected === 0) return res.status(404).json({ message: 'Not found' });
  res.json({ message: 'Deleted' });
};

export {};
