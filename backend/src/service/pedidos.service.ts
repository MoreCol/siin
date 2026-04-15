import { AppDataSource } from '../config/dataBase';
import { Pedido } from '../entity/pedidos';

export class PedidoService {
  private repo = AppDataSource.getRepository(Pedido);

  findAll() {
    return this.repo.find({
       relations: ["proveedor"]
    });
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id_pedido: id },
      relations: ["proveedor"],
    });
  }

  async create(data: Partial<Pedido>) {
    const pedidos = this.repo.create(data);
    return await this.repo.save(pedidos);
  }

  async update(id: number, data: Partial<Pedido>) {
    const pedidos = await this.findOne(id);
    if (!pedidos) return null;

    this.repo.merge(pedidos, data);
    return await this.repo.save(pedidos);
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
