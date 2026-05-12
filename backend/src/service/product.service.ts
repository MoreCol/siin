import { AppDataSource } from "../config/dataBase";
import { Product } from "../entity/product"; 

export class ProductService {


  private repo = AppDataSource.getRepository(Product);


 async findAll(page:number=1, limit:number=5) {
    const[data,total] = await this.repo.findAndCount({
      skip: (page - 1)* limit,
      take:limit,
      order:{id:'desc'}
    })
    
   // return this.repo.find();
   return{
    data,
    
    total,
    page,
    totalPages:Math.ceil(total/limit)
   }
   
  }

  async totalProductos(){
    return this.repo.find({order:{id:'desc'}})
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