import { AppDataSource } from '../config/dataBase';
import { Invent } from '../entity/inventario';

export class InventService {
  private repo = AppDataSource.getRepository(Invent);

async findAll() {
    return await this.repo.find({
      relations: ['producto'],
      order: { fecha_movimiento: 'DESC' }
    });
  }


  findOne(id: number) {
    return this.repo.findOneBy({id_movimiento: id});
    //SELECT *FROM PRODUCTOS WHERE = ID
  }

  async create(data: Partial<Invent>) {
    const invent = this.repo.create(data);
    return await this.repo.save(invent);
    //INSERT INTO PRODUCTOS
  }
  async update(id: number, data: Partial<Invent>) {
    const invent = await this.findOne(id);
    if (!invent) return null;

    this.repo.merge(invent, data);
    return await this.repo.save(invent);
    //UPDATE PRODUCTOS
  }
  async delete(id: number) {
    return await this.repo.delete(id);
  }
}
