import { AppDataSource } from '../config/dataBase';
import { Invent } from '../entity/inventario';
import { Product } from '../entity/product';
import { Usuario } from '../entity/usuarios';

export class InventService {
  private repo = AppDataSource.getRepository(Invent);
  private repoProducto = AppDataSource.getRepository(Product);
  private repoUsuario = AppDataSource.getRepository(Usuario);
  async findAll() {
    return await this.repo.find({
      relations: ['producto', 'usuario'],
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

      if (data.costo_unitario !== undefined) {
        const costo = Number(data.costo_unitario);
        producto.precio_compra = costo;
        producto.precio_venta = costo * (1 + Number(producto.porcentaje_ganancia) / 100);
      }
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
          throw new Error(`Stock insuficiente. Solo quedan ${producto.stock_actual} unidades`);
        }
        producto.stock_actual -= cantidadNueva;
      } else if (data.tipo_movimiento === 'ajuste') {
        producto.stock_actual = cantidadNueva;
      }
      if ((data.tipo_movimiento ?? invent.tipo_movimiento) === 'entrada' && data.costo_unitario !== undefined) {
        const costo = Number(data.costo_unitario);

        producto.precio_compra = costo;

        producto.precio_venta = costo * (1 + Number(producto.porcentaje_ganancia) / 100);
      }

      await this.repoProducto.save(producto);
    }
    this.repo.merge(invent, data);
    return await this.repo.save(invent);
    //UPDATE PRODUCTOS
  }

  async delete(id: number) {
    // 1. Busca el movimiento antes de eliminarlo
    const invent = await this.findOne(id);
    if (!invent) return null;

    // 2. Revierte el stock del producto
    const producto = await this.repoProducto.findOneBy({ id: invent.id_producto });
    if (producto) {
      const cantidad = Number(invent.cantidad);

      if (invent.tipo_movimiento === 'entrada') {
        producto.stock_actual -= cantidad; // revierte entrada
      } else if (invent.tipo_movimiento === 'salida') {
        producto.stock_actual += cantidad; // revierte salida
      }
      // ajuste no se puede revertir automáticamente — ignora

      await this.repoProducto.save(producto);
    }

    // 3. Elimina el movimiento
    return await this.repo.delete(id);
  }
}
