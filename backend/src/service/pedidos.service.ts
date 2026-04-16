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

  /* async create(data: Partial<Pedido>) {
    const pedidos = this.pedidoRepo.create(data);
    return await this.repo.save(pedidos);
  }*/

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

  async update(id: number, data: Partial<Pedido>) {
    const pedidos = await this.findOne(id);
    if (!pedidos) return null;

    this.pedidoRepo.merge(pedidos, data);
    return await this.pedidoRepo.save(pedidos);
  }

  async delete(id: number) {
    return await this.pedidoRepo.delete(id);
  }
}
