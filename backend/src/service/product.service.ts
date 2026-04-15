import { AppDataSource } from "../config/dataBase";
import { Product } from "../entity/product"; 

export class ProductService {


  private repo = AppDataSource.getRepository(Product);


  findAll() {
    return this.repo.find();
   
  }

  findOne(id: number) {
    return this.repo.findOneBy({id: id});
  
  }

  async create(data: Partial<Product>) {
    const product = this.repo.create(data);
    return await this.repo.save(product);
  
  }

  async update(id: number, data: Partial<Product>) {
    const product = await this.findOne(id);
    if (!product) return null;

    this.repo.merge(product, data);
    return await this.repo.save(product);
   
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }

}