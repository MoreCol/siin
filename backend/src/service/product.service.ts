import { AppDataSource } from "../config/dataBase";
import { Product } from "../entity/product"; //IMPORTAMOS LA TABLA PRODUCTOS 

export class ProductService {


  private repo = AppDataSource.getRepository(Product);
  //REPOSITORIO PARA TRABAJAR CON TABLA PRODUCTOS 

  findAll() {
    return this.repo.find();
    //SELECT * FROM PRODUCTOS 
  }

  findOne(id: number) {
    return this.repo.findOneBy({id: id});
    //SELECT *FROM PRODUCTOS WHERE = ID 
  }

  async create(data: Partial<Product>) {
    const product = this.repo.create(data);
    return await this.repo.save(product);
   //INSERT INTO PRODUCTOS 
  }

  async update(id: number, data: Partial<Product>) {
    const product = await this.findOne(id);
    if (!product) return null;

    this.repo.merge(product, data);
    return await this.repo.save(product);
    //UPDATE PRODUCTOS 
  }

  async delete(id: number) {
    return await this.repo.delete(id);
  }
  //  DELETE FROM productos WHERE id = ?
}