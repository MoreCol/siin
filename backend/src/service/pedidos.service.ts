import { AppDataSource } from '../config/dataBase';
import { DetallePedido } from '../entity/detallePedido';
import { Pedido } from '../entity/pedidos';

export class PedidoService {
  private pedidoRepo = AppDataSource.getRepository(Pedido);
  private detalleRepo = AppDataSource.getRepository(DetallePedido);

  findAll() {
    return this.pedidoRepo.find({
      relations: ['detalles'],
      order: { id_pedido: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.pedidoRepo.findOne({
      where: { id_pedido: id },
      relations: ['detalles']
    });
  }

  async create(data: any) {
    const { detalles = [], ...pedidoData } = data;

    const pedido = this.pedidoRepo.create({
      fecha_pedido: pedidoData.fecha_pedido,
      fecha_entrega: pedidoData.fecha_entrega,
      estado: pedidoData.estado ?? 'Pendiente'
    });

    const guardarPedido = await this.pedidoRepo.save(pedido);

    const detalleEntity = detalles.map((d: any) =>
      this.detalleRepo.create({
        id_pedido: guardarPedido.id_pedido,
        id_producto: Number(d.id_producto),
        id_proveedor: Number(d.id_proveedor),
        cantidad: Number(d.cantidad)
      })
    );

    await this.detalleRepo.save(detalleEntity);
    return await this.findOne(guardarPedido.id_pedido);
  }

  async update(id: number, data: any) {
    const pedido = await this.findOne(id);
    if (!pedido) return null;

    // 1. Actualizar campos del pedido
    pedido.fecha_pedido = data.fecha_pedido ?? pedido.fecha_pedido;
    pedido.fecha_entrega = data.fecha_entrega ?? pedido.fecha_entrega;
    pedido.estado = data.estado ?? pedido.estado;
    await this.pedidoRepo.save(pedido);

    // 2. Si vienen detalles, reemplazar los anteriores
    if (data.detalles && data.detalles.length > 0) {
      await this.detalleRepo.delete({ id_pedido: id });

      const nuevosDetalles = data.detalles.map((d: any) =>
        this.detalleRepo.create({
          id_pedido: id,
          id_producto: Number(d.id_producto),
          id_proveedor: Number(d.id_proveedor),
          cantidad: Number(d.cantidad)
        })
      );
      await this.detalleRepo.save(nuevosDetalles);
    }

    // 3. Retornar pedido actualizado
    return await this.findOne(id);
  }

  async delete(id: number) {
    return await this.pedidoRepo.delete(id);
  }

} 