import { AppDataSource } from "../config/dataBase";
import { Proveedor } from "../entity/proveedores"; 

export class ProveedorService {


  private repo = AppDataSource.getRepository(Proveedor);


  findAll() {
    return this.repo.find();
   
  }

  findOne(id: number) {
    return this.repo.findOneBy({id_proveedor: id});
  
  }

  async create(data: Partial<Proveedor>) {
    const Proveedor = this.repo.create(data);
    return await this.repo.save(Proveedor);
  
  }

  async update(id: number, data: Partial<Proveedor>) {
    const Proveedor = await this.findOne(id);
    if (!Proveedor) return null;

    this.repo.merge(Proveedor, data);
    return await this.repo.save(Proveedor);
   
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }

}