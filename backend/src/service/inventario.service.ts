import { AppDataSource } from '../config/dataBase';
import { Invent } from '../entity/inventario';
import { Product } from '../entity/product';

export class InventService {
  private repo = AppDataSource.getRepository(Invent);
  private repoProducto = AppDataSource.getRepository(Product);
  async findAll() {
    return await this.repo.find({
      relations: ['producto'],
      order: { fecha_movimiento: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id_movimiento: id });
    //SELECT *FROM PRODUCTOS WHERE = ID
  }

  async create(data: Partial<Invent>) {
    const producto = await this.repoProducto.findOneBy({ id: data.id_producto });
    if (!producto) throw new Error('producto no encontrado');
    const cantidad = Number(data.cantidad);
    if (data.tipo_movimiento === 'entrada') {
      producto.stock_actual += cantidad;
    } else if (data.tipo_movimiento === 'salida') {
      if (producto.stock_actual < cantidad) {
        throw new Error('Stock insuficiente');
      }
      producto.stock_actual -= cantidad;
    } else if (data.tipo_movimiento === 'ajuste') {
      producto.stock_actual = cantidad;
    }

    await this.repoProducto.save(producto);

    const invent = this.repo.create(data);
    return await this.repo.save(invent);
    //INSERT INTO PRODUCTOS
  }
  async update(id: number, data: Partial<Invent>) {
    const invent = await this.findOne(id);
    if (!invent) return null;
    const producto = await this.repoProducto.findOneBy({ id: invent.id_producto });
    if (producto) {
      const cantidadAnterior = Number(invent.cantidad);
      if (invent.tipo_movimiento === 'entrada') {
        producto.stock_actual -= cantidadAnterior; // revierte entrada
      } else if (invent.tipo_movimiento === 'salida') {
        producto.stock_actual += cantidadAnterior; // revierte salida
      }
      const cantidadNueva = Number(data.cantidad ?? invent.cantidad);
      if (data.tipo_movimiento === 'entrada') {
        producto.stock_actual += cantidadNueva;
      } else if (data.tipo_movimiento === 'salida') {
        if (producto.stock_actual < cantidadNueva) {
          throw new Error('Stock insuficiente');
        }
        producto.stock_actual -= cantidadNueva;
      } else if (data.tipo_movimiento === 'ajuste') {
        producto.stock_actual = cantidadNueva;
      }

      await this.repoProducto.save(producto);
    }
    this.repo.merge(invent, data);
    return await this.repo.save(invent);
    //UPDATE PRODUCTOS
  }
  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
