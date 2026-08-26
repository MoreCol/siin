import { Request, Response } from 'express';
import { ProductService } from '../service/product.service';

const service = new ProductService();

const validarProducto = (body: any) => {
  const camposObligatorios = ['codigo_barras', 'descripcion', 'categoria', 'proveedor_id', 'estado'];
  for (const atributo of camposObligatorios) {
    const valor = body[atributo];

    if (valor === undefined || valor === null || (typeof valor === 'string' && valor.trim() === '')) {
      return `El atributo "${atributo}" es requerido y no puede estar vacío`;
    }
  }
  return null;
};

export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;

  res.json(await service.findAll(page, limit));
};

export const getAllProducts = async (_: Request, res: Response) => {
  try {
    const products = await service.totalProductos();
    res.json(products);
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};
export const getProduct = async (req: Request, res: Response) => {
  const product = await service.findOne(Number(req.params.id));
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const errorValidacion = validarProducto(req.body);
    if (errorValidacion) {
      return res.status(400).json({ message: errorValidacion });
    }

    const productoExistente = await service.findByCodigoBarras(req.body.codigo_barras);
    if (productoExistente) {
      return res.status(409).json({
        message: `El producto con código de barras "${req.body.codigo_barras}" ya existe`
      });
    }

    const product = await service.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error('Error en createProduct:', error);
    res.status(400).json({ message: 'Error al crear el producto' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await service.update(Number(req.params.id), req.body);
  if (!product) return res.status(404).json({ message: 'Not found' });
  res.json(product);
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const result = await service.delete(Number(req.params.id));
    if (result.affected === 0) return res.status(404).json({ message: 'Not found' });
    console.log(`Producto con ID ${req.params.id} eliminado exitosamente`)
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error en deleteProduct:', error);
    res.status(500).json({ message: 'Error al eliminar el producto' });
  }
};
export {};
