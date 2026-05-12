import { AppDataSource } from '../config/dataBase';
import { DetallePedido } from '../entity/detallePedido';

export class DetallePedidosService {
  private repo = AppDataSource.getRepository(DetallePedido);

  async findAll() {
    return await this.repo.find({
      relations: ['producto', 'proveedor', 'pedido'],
      order: { id_detalle_pedido: 'DESC' }
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id_detalle_pedido: id },
      relations: ['producto', 'proveedor', 'pedido'],
    });
  }

  async create(data: Partial<DetallePedido>) {
    const detalle = this.repo.create(data);
    return await this.repo.save(detalle);
  }

  async update(id: number, data: Partial<DetallePedido>) {
    const detalle = await this.findOne(id);
    if (!detalle) return null;

    this.repo.merge(detalle, data);
    return await this.repo.save(detalle);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
}