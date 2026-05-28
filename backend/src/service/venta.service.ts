import { AppDataSource } from '../config/dataBase';
import { DetalleVenta } from '../entity/detalleVentas';
import { Venta } from '../entity/ventas';

export class VentaService {
  private ventaRepo = AppDataSource.getRepository(Venta);
  private detalleRepo = AppDataSource.getRepository(DetalleVenta);

  // =========================
  // CREAR VENTA
  // =========================
  findAll() {
    return this.ventaRepo.find({
      relations: ['detalles'],
      order: { id_venta: 'DESC' }
    });
  }

  async create(data: any) {
    const { detalles = [], ...ventaData } = data;

    // Crear venta
    const venta = this.ventaRepo.create({
      usuario: {
        id_usuario: ventaData.id_usuario
      },
      fecha_venta: ventaData.fecha_venta,
      metodo_pago: ventaData.metodo_pago,
      total: ventaData.total,
      estado: ventaData.estado
    });

    // Guardar venta
    const guardarVenta = await this.ventaRepo.save(venta);
if (!guardarVenta.id_venta) {
  throw new Error("No se generó id_venta");
}
    // Crear detalles
    const detalleVenta = detalles.map((d: any) =>
      this.detalleRepo.create({
        id: d.id, // id propio del detalle
        id_producto: Number(d.id_producto),

        // id de la venta recién creada
        id_venta:guardarVenta.id_venta,

        cantidad: Number(d.cantidad),
        subtotal: Number(d.subtotal)
      })
    );

    // Guardar detalles
    await this.detalleRepo.save(detalleVenta);

    // Retornar venta completa

    return await this.findOne(guardarVenta.id_venta);
  }

  // =========================
  // OBTENER UNA VENTA
  // =========================
  async findOne(id: number) {
    return await this.ventaRepo.findOne({
      where: { id_venta: id },
      relations: ['usuario', 'detalles', 'detalles.producto']
    });
  }

  // =========================
  // ACTUALIZAR VENTA
  // =========================
  async update(id: number, data: any) {
    const venta = await this.findOne(id);

    if (!venta) return null;

    // Actualizar datos de venta
    venta.id_usuario = data.id_usuario ?? venta.id_usuario;
    venta.fecha_venta = data.fecha_venta ?? venta.fecha_venta;
    venta.metodo_pago = data.metodo_pago ?? venta.metodo_pago;
    venta.total = data.total ?? venta.total;
    venta.estado = data.estado ?? venta.estado;

    await this.ventaRepo.save(venta);

    // Si vienen detalles nuevos
    if (data.detalles && data.detalles.length > 0) {
      // eliminar detalles anteriores
      await this.detalleRepo.delete({
        id_venta: id
      });

      // crear nuevos detalles
      const nuevosDetalles = data.detalles.map((d: any) =>
        this.detalleRepo.create({
          id: d.id,
          id_producto: Number(d.id_producto),
          id_venta: id,
          cantidad: Number(d.cantidad),
          subtotal: Number(d.subtotal)
        })
      );

      await this.detalleRepo.save(nuevosDetalles);
    }

    return await this.findOne(id);
  }

  // =========================
  // ELIMINAR VENTA
  // =========================
  async delete(id: number) {
    // eliminar detalles primero
    await this.detalleRepo.delete({
      id_venta: id
    });

    // eliminar venta
    return await this.ventaRepo.delete(id);
  }
}
